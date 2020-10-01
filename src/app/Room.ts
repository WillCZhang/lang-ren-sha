import {
    NonCreatorStartGameError,
    PlayerCountError,
    RoomSizeError,
    SeatTakenError
} from "./error/RoomError";

const ROOM_EXPIRATION_TIME = 86400 * 1000; // in ms
export const MIN_PLAYER = 4; // Not sure
export const MAX_PLAYER = 20; // Not sure

export default class Room {
    private readonly createdTime: any;
    private readonly creator: any;
    private settings: { [name: string]: number };
    private roomSize: number;
    private readonly assignment: { [playerId: string]: string };
    private readonly seatMap: { [playerId: string]: number };
    private readonly seatStatus: boolean[];
    private started: any;
    private readonly settingText: string;

    constructor(creator: string, settings: any) {
        this.createdTime = Date.now();
        this.creator = creator;
        this.settings = settings;
        this.roomSize = 0;
        for (const job of Object.keys(settings)) {
            this.roomSize += settings[job];
        }
        if (this.roomSize < MIN_PLAYER || this.roomSize > MAX_PLAYER) {
            throw new RoomSizeError();
        }
        this.settingText = this.formatSettingText();
        this.assignment = {}; // 玩家职业分配, Key is player ID, value is the player's job
        this.seatMap = {}; // Key is player ID, value is the player's seat number
        this.seatStatus = [];
        for (let i = 0; i < this.roomSize; i++) {
            this.seatStatus.push(false);
        }
        this.started = false;
    }

    /**
     * Should be invoked when the player sits on a chair
     * @param playerId
     * @param seatNumber
     */
    public join(playerId: string, seatNumber: number) {
        if (this.started ||
            Object.keys(this.seatMap).length >= this.roomSize ||
            seatNumber > this.roomSize ||
            this.seatStatus[seatNumber]) { // the three conditions above means we are hacked
            throw new SeatTakenError();
        }
        if (this.playerInTheRoom(playerId)) {
            this.seatStatus[this.seatMap[playerId]] = false;
        }
        this.seatStatus[seatNumber] = true;
        this.seatMap[playerId] = seatNumber;
    }

    /**
     * leave a room, not an ideal implementation, but should be fine
     * @param playerId
     */
    public leave(playerId: string) {
        if (this.playerInTheRoom(playerId)) {
            this.seatStatus[this.seatMap[playerId]] = false;
            delete this.seatMap[playerId];
        }
    }

    public playerInTheRoom(playerId: string): boolean {
        return this.seatMap[playerId] >= 0;
    }

    public start(playerId: string): boolean {
        if (!this.isCreator(playerId)) {
            throw new NonCreatorStartGameError();
        } else if (Object.keys(this.seatMap).length !== this.roomSize) {
            throw new PlayerCountError();
        }
        this._assignJob();
        this.started = true;
        return true;
    }

    /**
     * For simplicity (for rendering), returns a boolean list to indicate whether a seat
     */
    public getCurrentSeatMap(): Array<boolean> {
        return this.seatStatus;
    }

    public getSeatNumber(playerId): number {
        return this.seatMap[playerId];
    }

    public getRoomSize(): number {
        return this.roomSize;
    }

    public getRoomConfiguration(): string {
        return this.settingText;
    }

    public isCreator(playerId: string): boolean {
        return this.creator === playerId;
    }

    public isRoomExpired(): boolean {
        return Date.now() - this.createdTime > ROOM_EXPIRATION_TIME;
    }

    private _assignJob() {
        // TODO: 留给game 去做

        // shuffle 3 times before assign
        // this.playerIds = Room._shuffle(this.playerIds);
        // this.playerIds = Room._shuffle(this.playerIds);
        // this.playerIds = Room._shuffle(this.playerIds);
        //
        // for (const player of this.playerIds) {
        //     this.assignment[player] = this._getNextAvailableJob();
        // }
        //
        // delete this.settings;
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

    private formatSettingText() {
        const total = [];
        Object.keys(this.settings).forEach(key => total.push(`${key}: ${this.settings[key]}名`));
        return total.join("\n");
    }
}
