import {Occupation} from "../game/Occupation";
import {SeatTakenError} from "../error/RoomError";

export default class Seat {
    private readonly occupation: Occupation;
    private taken: boolean = false;
    private playerId: string;
    private seatNumber: number = -1;

    constructor(occupation: Occupation) {
        this.occupation = occupation;
    }

    public sit(playerId: string) {
        if (this.isTaken()) {
            throw new SeatTakenError();
        }
        this.taken = true;
        this.playerId = playerId;
    }

    public leave() {
        this.taken = false;
        this.playerId = undefined;
    }

    public isTaken(): boolean {
        return this.taken;
    }

    public setSeatNumber(number: number) {
        if (this.seatNumber === -1) {
            this.seatNumber = number;
        }
    }

    public getSeatNumber(): number {
        return this.seatNumber;
    }

    public getOccupation(): Occupation {
        return this.occupation;
    }

    public getPlayerId(): string {
        return this.playerId;
    }
}
