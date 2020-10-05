import {Occupation} from "./Occupation";

/**
 * 最基本的狼人杀玩法，人神狼阵营至少各有一个人
 * @param settings
 * @return match or not
 */
export const NormalGame = (settings: { [occupation: string]: number }): boolean => {
    return getOccupationCount(settings, Occupation.Human) > 0 &&
        countGods(settings) > 0 && getOccupationCount(settings, Occupation.Wolfman) > 0;
};

function countGods(settings: { [occupation: string]: number }): number {
    let godCount = getOccupationCount(settings, Occupation.Prophet);
    godCount += getOccupationCount(settings, Occupation.Witch);
    godCount += getOccupationCount(settings, Occupation.Hunter);
    return godCount;
}

function getOccupationCount(o: { [key: string]: number }, key: Occupation): number {
    return o[key]? o[key] : 0;
}


