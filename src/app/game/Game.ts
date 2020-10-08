import {InvalidGameConfigError} from "../error/GameError";
import {NormalGame} from "./GameTypes";
import {GameStates} from "./GameStates";
import {Occupation} from "./Occupation";
import {countGods, countHuman, countWolfman} from "./GameUtil";


// 暂时默认屠边局
export default class Game {
    public readonly players: number;
    public readonly settingText: string;
    public readonly occupationCount: { [occupation: string]: number };
    private state;

    constructor(players: number, occupationCount: { [occupation: string]: number }, settingText: string) {
        this.players = players;
        this.settingText = settingText;
        this.occupationCount = occupationCount;
        this.state = GameStates.Assignment;
    }

    protected isGameOver(): boolean {
        return countHuman(this.occupationCount) === 0 || countWolfman(this.occupationCount) === 0 ||
            countGods(this.occupationCount) === 0;
    }
}

export class GameFactory {
    public static createGame(settings: { [occupation: string]: number }): Game {
        if (Object.keys(settings).length > Object.keys(Occupation).length || !GameFactory.isValidGameConfig(settings)) {
            throw new InvalidGameConfigError();
        }
        let count = 0;
        let occupationCount = {};
        Object.keys(settings).forEach((key) => {
            count += settings[key];
            occupationCount[key] = settings[key];
        });
        return new Game(
            count,
            occupationCount,
            GameFactory.formatSettingText(settings)
        );
    }

    private static isValidGameConfig(settings: { [occupation: string]: number }) {
        // TODO: add rules
        return NormalGame(settings);
    }

    private static formatSettingText(settings: { [occupation: string]: number }): string {
        const total = [];
        Object.keys(settings).forEach((key) => total.push(`${key}: ${settings[key]}名`));
        return total.join("\n");
    }
}
