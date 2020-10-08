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
     * For a player to join this room
     * @param playerId
     * @param seatNumber
     * @throws {@code SeatTakenError}
     */
    public join(playerId: string, seatNumber: number) {
        if (this.isGameStarted()) {
            // we are hacked or bug in frontend
            throw new SeatTakenError();
        }
        this.seats[seatNumber].sit(playerId);
        this.leave(playerId);
    }

    /**
     * leave a room
     * @param playerId
     */
    public leave(playerId: string) {
        if (this.isPlayerInTheRoom(playerId)) {
            this.getSeatList(playerId)[0].leave();
        }
    }

    /**
     * Start the game!!!
     * @param playerId
     */
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
     * Getters & Setters
     */

    public getCurrentSeatStatus(): boolean[] {
        // a boolean list to indicate whether a seat is taken
        return this.seats.map((s) => s.isTaken());
    }

    public getSeatNumber(playerId): number {
        return this.isPlayerInTheRoom(playerId)? -1 : this.getSeatList(playerId)[0].getSeatNumber();
    }

    public getRoomSize(): number {
        return this.game.players;
    }

    public getGameConfigurationDisplayText(): string {
        return this.game.settingText;
    }

    public getOccupation(playerId: string): string {
        this.getGame(playerId);
        return this.getSeatList(playerId)[0].getOccupation();
    }

    private getGame(playerId: string): Game {
        if (!this.isGameStarted()) {
            throw new GameNotStartedError();
        } else if (!this.isPlayerInTheRoom(playerId)) {
            throw new NotInTheGameError();
        }
        return this.game;
    }

    public isGameStarted(): boolean {
        return this.started;
    }

    public isRoomExpired(): boolean {
        return Date.now() - this.createdTime > ROOM_EXPIRATION_TIME;
    }

    public isCreator(playerId: string): boolean {
        return this.creator === playerId;
    }

    private isPlayerInTheRoom(playerId: string): boolean {
        return this.getSeatList(playerId).length === 1;
    }

    private getSeatList(playerId: string): Seat[] {
        // TODO: this could be really bad for performance
        // short-term fix before moving things to a database
        return this.seats.filter((s) => s.getPlayerId() === playerId);
    }
}
