import {
    NonCreatorStartGameError,
    PlayerCountError,
    RoomSizeError,
    SeatTakenError
} from "../error/RoomError";
import Seat from "./Seat";
import Game, {GameFactory} from "../game/Game";
import {getOccupation} from "../game/Occupation";
import {shuffle} from "../util/AppUtil";
import {GameNotStartedError, NotInTheGameError} from "../error/GameError";

const ROOM_EXPIRATION_TIME = 86400 * 1000; // in ms
export const MIN_PLAYER = 3; // Not sure
export const MAX_PLAYER = 20; // Not sure

export default class Room {
    private readonly createdTime: any;
    private readonly creator: any;
    private readonly game: Game;
    private readonly seatMap: { [playerId: string]: Seat } = {};
    private readonly seats: Seat[] = [];
    private started: any;

    constructor(creator: string, settings: { [occupation: string]: number }) {
        this.createdTime = Date.now();
        this.creator = creator;
        this.game = GameFactory.createGame(settings);
        if (this.game.players < MIN_PLAYER ||
            this.game.players > MAX_PLAYER) {
            throw new RoomSizeError();
        }
        // Create initial seats with occupations
        for (let key of Object.keys(settings)) {
            for (let i = 0; i < settings[key]; i++) {
                this.seats.push(new Seat(getOccupation(key)));
            }
        }
        // shuffle 4 times for randomness
        this.seats = shuffle(this.seats);
        this.seats = shuffle(this.seats);
        this.seats = shuffle(this.seats);
        this.seats = shuffle(this.seats);
        this.seats.forEach((seat, number) => seat.setSeatNumber(number));

        this.started = false;
    }

    /**
     * Should be invoked when the player sits on a chair
     * @param playerId
     * @param seatNumber
     */
    public join(playerId: string, seatNumber: number) {
        if (this.started) {
            // we are hacked or bug in frontend
            throw new SeatTakenError();
        }
        this.leave(playerId);
        this.seats[seatNumber].sit(playerId);
        this.seatMap[playerId] = this.seats[seatNumber];
    }

    /**
     * leave a room, not an ideal implementation, but should be fine
     * @param playerId
     */
    public leave(playerId: string) {
        if (this.isPlayerInTheRoom(playerId)) {
            this.seatMap[playerId].leave();
            delete this.seatMap[playerId];
        }
    }

    public start(playerId: string) {
        if (!this.isCreator(playerId)) {
            throw new NonCreatorStartGameError();
        }
        for (let seat of this.seats) {
            if (!seat.isTaken()) {
                throw new PlayerCountError();
            }
        }
        this.started = true;
    }

    /**
     * For simplicity (for rendering), returns a boolean list to indicate whether a seat
     */
    public getCurrentSeatStatus(): boolean[] {
        return this.seats.map((s) => s.isTaken());
    }

    public getSeatNumber(playerId): number {
        return this.seatMap[playerId]? this.seatMap[playerId].getSeatNumber() : -1;
    }

    public getRoomSize(): number {
        return this.game.players;
    }

    public getGameConfigurationDisplayText(): string {
        return this.game.settingText;
    }

    public isRoomExpired(): boolean {
        return Date.now() - this.createdTime > ROOM_EXPIRATION_TIME;
    }

    public isCreator(playerId: string): boolean {
        return this.creator === playerId;
    }

    private isPlayerInTheRoom(playerId: string): boolean {
        return this.seatMap[playerId] !== undefined;
    }

    /**
     * After the game is started, use this API to get the Game and operate
     */
    private getGame(playerId: string): Game {
        if (!this.started) {
            throw new GameNotStartedError();
        } else if (!this.isPlayerInTheRoom(playerId)) {
            throw new NotInTheGameError();
        }
        return this.game;
    }
}
