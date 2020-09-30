import {MAX_PLAYER, MIN_PLAYER} from "../Room";
import AppError from "./AppError";

export class RoomNotFoundError extends AppError {
    static readonly msg = "房间已经被解散啦";

    constructor() {
        super(RoomNotFoundError.msg);
    }
}

export class RoomExpireError extends AppError {
    static readonly msg = "游戏已超时，一局游戏最长有效时间为一天 ：）";

    constructor() {
        super(RoomExpireError.msg);
    }
}

export class RoomSizeError extends AppError {
    static readonly msg = `一局游戏最少${MIN_PLAYER}名玩家参与，最多${MAX_PLAYER}名玩家参与`;

    constructor() {
        super(RoomSizeError.msg);
    }
}

export class NonCreatorStartGameError extends AppError {
    static readonly msg = "只有房主才能开始游戏哦";

    constructor() {
        super(NonCreatorStartGameError.msg);
    }
}

export class PlayerCountError extends AppError {
    static readonly msg = "还有玩家没有加入游戏，再等一等吧";

    constructor() {
        super(PlayerCountError.msg);
    }
}

export class SeatTakenError extends AppError {
    static readonly msg = "座位已经被抢啦，换一个试试吧";

    constructor() {
        super(SeatTakenError.msg);
    }
}
