import {Occupation} from "./Occupation";

export function countWolfman(settings: { [occupation: string]: number }): number {
    return getOccupationCount(settings, Occupation.Wolfman);
}

export function countHuman(settings: { [occupation: string]: number }): number {
    return getOccupationCount(settings, Occupation.Human);
}

export function countGods(settings: { [occupation: string]: number }): number {
    let godCount = getOccupationCount(settings, Occupation.Prophet);
    godCount += getOccupationCount(settings, Occupation.Witch);
    godCount += getOccupationCount(settings, Occupation.Hunter);
    return godCount;
}

export function getOccupationCount(o: { [key: string]: number }, key: Occupation): number {
    return o[key]? o[key] : 0;
}
