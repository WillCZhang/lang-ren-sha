import {countGods, countHuman, countWolfman} from "./GameUtil";

// 屠边屠城局的设置之类的也应该加一下
// 可以把game 变成super class，然后给一些常见配置方案extend，以及一个完整configurable的游戏，把权力完全交给用户
// 同时这个问题在使用db or 把json parse回subtype的问题解决之前是block的

/**
 * 最基本的狼人杀玩法，人神狼阵营至少各有一个人
 * @param settings
 * @return match or not
 */
export const NormalGame = (settings: { [occupation: string]: number }): boolean => {
    return countWolfman(settings) > 0 && countGods(settings) > 0 && countHuman(settings) > 0;
};
