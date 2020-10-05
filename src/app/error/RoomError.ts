import {MAX_PLAYER, MIN_PLAYER} from "../room/Room";
import AppError from "./AppError";

export class RoomNotFoundError extends AppError {
    public readonly message = "房间已经被解散啦";
}

export class RoomExpireError extends AppError {
    public readonly message = "游戏已超时，一局游戏最长有效时间为一天 ：）";
}

export class RoomSizeError extends AppError {
    public readonly message = `一局游戏最少${MIN_PLAYER}名玩家参与，最多${MAX_PLAYER}名玩家参与`;
}

export class NonCreatorStartGameError extends AppError {
    public readonly message = "只有房主才能开始游戏哦";
}

export class PlayerCountError extends AppError {
    public readonly message = "还有玩家没有加入游戏，再等一等吧";
}

export class SeatTakenError extends AppError {
    public readonly message =  "座位已经被抢啦，换一个试试吧";
}

export class TooManyRoomsError extends AppError{
    public readonly message = "游戏太火爆啦，玩的人比较多，请明天再来玩吧~";
}
