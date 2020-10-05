import AppError from "./AppError";

export class InvalidGameConfigError extends AppError {
    public readonly message = "这不是合理的游戏配置哦，请参见狼人杀规则xxxxxx";
}

export class GameNotStartedError extends AppError {
    public readonly message = "游戏还没有开始哦，请等等吧~"
}

export class NotInTheGameError extends AppError {
    public readonly message = "您不在这个房间中哦，请重新进入房间"
}

export class UnknownOccupation extends AppError {
    public readonly message = "这个职业现在还不支持哦"
}
