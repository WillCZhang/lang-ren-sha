import GameError from "./Error/GameError.js";
import set = Reflect.set;

const GAME_EXPIRATION_TIME = 86400 * 1000; // in ms
const MIN_PLAYER = 4; // Not sure
const MAX_PLAYER = 20; // Not sure

export default class Game {
    public createdTime: any;
    public creator: any;
    public settings: {[name: string]: number};
    public playerCount: number;
    public playerIds: any;
    public assignment: any;
    public seats: any;
    public seatMap: boolean[];
    public started: any;
    private settingText: string;

    constructor(creator: string, settings: any) {
        this.createdTime = Date.now();
        this.creator = creator; // 房主
        this.settings = settings; // 每个职业配比
        let count = 0;
        for (const job of Object.keys(settings)) {
            count += settings[job];
        }
        this.settingText = this.formSettingText();
        if (count < MIN_PLAYER || count > MAX_PLAYER) {
            throw new GameError(`一局游戏最少${MIN_PLAYER}名玩家参与，最多${MAX_PLAYER}名玩家参与`);
        }
        this.playerCount = count; // 玩家数量
        this.playerIds = [creator]; // 玩家id list
        this.assignment = {}; // 玩家职业分配, Key is player ID, value is the player's job
        this.seats = {}; // Key is player ID, value is the player's seat number
        this.seatMap = [];
        for (let i = 0; i < count; i++) {
            this.seatMap.push(false);
        }
        this.started = false;
    }

    /**
     * Should be invoked when the player sits on a chair
     * @param playerId
     * @param seatNumber
     * @return {boolean}
     */
    public join(playerId: string, seatNumber: number): boolean {
        if (this.started ||
            this.playerIds.length >= this.playerCount ||
            Object.values(this.seats).includes(seatNumber)) {
            return false;
        }
        this.playerIds.concat(playerId);
        this.seatMap[this.seats[playerId]] = false;
        this.seatMap[seatNumber] = true;
        this.seats[playerId] = seatNumber;
        return true;
    }

    public start(playerId: string): boolean {
        if (playerId !== this.creator || this.playerIds.length !== this.playerCount) {
            return false;
        }
        this._assignJob();
        this.started = true;
        return true;
    }

    /**
     * For simplicity (for rendering), returns a boolean list to indicate whether a seat
     */
    public getCurrentSeatMap(): Array<boolean> {
        return this.seatMap;
    }

    public getSeatNumber(playerId): number {
        return this.seats[playerId];
    }

    public getPlayerCount(): number {
        return this.playerCount;
    }

    public getRoomConfiguration(): string {
        return this.settingText? this.settingText : this.formSettingText();
    }

    public isCreator(playerId: string): boolean {
        return this.creator === playerId;
    }

    public isGameExpired(): boolean {
        return Date.now() - this.createdTime > GAME_EXPIRATION_TIME;
    }

    private _assignJob() {
        // shuffle 3 times before assign
        this.playerIds = Game._shuffle(this.playerIds);
        this.playerIds = Game._shuffle(this.playerIds);
        this.playerIds = Game._shuffle(this.playerIds);

        for (const player of this.playerIds) {
            this.assignment[player] = this._getNextAvailableJob();
        }

        delete this.settings;
    }

    private static _shuffle(a: string[]) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    private _getNextAvailableJob() {
        for (const job of Object.keys(this.settings)) {
            if (this.settings[job] === 0) {
                delete this.settings[job];
            } else {
                this.settings[job] = this.settings[job] - 1;
                return job;
            }
        }
        // will never reach this line
        return undefined;
    }

    private formSettingText() {
        let total = [];
        Object.keys(this.settings).forEach(key => total.push(`${key}: ${this.settings[key]}名`));
        return total.join(" ");
    }
}
