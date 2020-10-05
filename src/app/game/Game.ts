import {InvalidGameConfigError} from "../error/GameError";
import {NormalGame} from "./Rules";


export default class Game {
    public readonly players: number;
    public readonly settingText: string;

    constructor(players: number, settingText: string) {
        this.players = players;
        this.settingText = settingText;
    }

}

export class GameFactory {
    public static createGame(settings: {[occupation: string]: number}): Game {
        if (!GameFactory.isValidGameConfig(settings)) {
            throw new InvalidGameConfigError();
        }
        let count = 0;
        Object.keys(settings).forEach((key) => count += settings[key]);
        return new Game(count, GameFactory.formatSettingText(settings));
    }

    private static isValidGameConfig(settings: {[occupation: string]: number}) {
        // TODO: add rules
        return NormalGame(settings);
    }

    private static formatSettingText(settings: {[occupation: string]: number}): string {
        const total = [];
        Object.keys(settings).forEach((key) => total.push(`${key}: ${settings[key]}名`));
        return total.join("\n");
    }
}
