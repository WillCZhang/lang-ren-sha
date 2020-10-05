import {UnknownOccupation} from "../error/GameError";

export enum Occupation {
    Wolfman = "狼人",
    Human = "平民",
    Prophet = "预言家",
    Witch = "女巫",
    Hunter = "猎人"
}

export const getOccupation = (o: string): Occupation => {
    switch (o) {
        case "狼人":
            return Occupation.Wolfman;
        case "平民":
            return Occupation.Human;
        case "预言家":
            return Occupation.Prophet;
        case "女巫":
            return Occupation.Witch;
        case "猎人":
            return Occupation.Hunter;
        default:
            throw new UnknownOccupation();
    }
};
