import * as fs from "fs";
import path from "path";
import GameError from "./Error/GameError";
import Game from "./Game";
import Log from "./Util";

const cachePath = path.join(__dirname, "../data");
const cacheFile = path.join(cachePath, "cache.json");
const cacheBackup = path.join(cachePath, "cache-backup.json");

const MAX_ID_LENGTH = 8;
const MAX_GAME_ID = 100000000;
const GARBAGE_COLLECTION_THRESHOLD = MAX_GAME_ID / 2;

/**
 * GameEngine is the entry point of the app. The caller, the controller in this case,
 * should perform validation before invoke the Engine.
 */
export default class GameEngine {
    private games: { [key: string]: Game };
    private isSaving: boolean;

    constructor() {
        this.games = GameEngine._loadGames();
        this._saveGames();
        this._removeExpiredGames();
    }

    /**
     * This should create a new game in the system, and generate a unique {@code MAX_ID_LENGTH}-digit game ID
     * for users to join the game.
     * @param creator
     * @param settings TODO: needs interface
     * @return string id
     */
    public newGame(creator: string, settings: any) {
        const id: string = this._generateGameId();
        this.games[id] = new Game(creator, settings);
        this._saveGames();
        return id;
    }

    /**
     *
     * @param id
     * @return Game the game
     */
    public getGame(id: string) {
        const game: Game = this.games[id];
        if (!game) {
            throw new GameError("游戏ID不存在");
        }
        if (game.isGameExpired()) {
            delete this.games[id];
            throw new GameError("游戏已超时，一局游戏最长有效时间为一天 ：）");
        }
        this._saveGames();
        return game;
    }

    private _generateGameId() {
        if (Object.keys(this.games).length > GARBAGE_COLLECTION_THRESHOLD) {
            this._removeExpiredGames();
        }

        let id = Math.floor(Math.random() * MAX_GAME_ID).toString();
        while (Object.keys(this.games).includes(id)) {
            // TODO: should probably add a cool-down period in the controller if we'are hacked
            id = Math.floor(Math.random() * MAX_GAME_ID).toString();
        }

        if (id.length < MAX_ID_LENGTH) {
            id = "0".repeat(MAX_ID_LENGTH - id.length) + id;
        }

        return id;
    }

    /***
     * Thread-safe & recoverable save
     * @private
     */
    private _saveGames() {
        if (this.isSaving) {
            return;
        }
        this.isSaving = true;
        fs.renameSync(cacheFile, cacheBackup);
        // should be async to reduce latency
        fs.writeFile(cacheFile, JSON.stringify(this.games), (err: any) => {
            fs.unlinkSync(cacheBackup);
            this.isSaving = false;
            if (err) {
                throw err;
            }
        });
    }

    /***
     * recoverable load - should run once only
     * @private
     */
    private static _loadGames() {
        try {
            if (fs.existsSync(cacheBackup)) {
                fs.unlinkSync(cacheFile);
                fs.renameSync(cacheBackup, cacheFile);
            }
            const unParsedObjects = JSON.parse(fs.readFileSync(cacheFile).toString());
            Object.keys(unParsedObjects).forEach(key => Object.setPrototypeOf(unParsedObjects[key], Game.prototype));
            return unParsedObjects;
        } catch (e) {
            fs.mkdir(cachePath, (err: any) => {
                /* very likely the dir exists, do nothing, other errs will cause error when saving */
            });
            return {};
        }
    }

    private _removeExpiredGames(): Promise<number> {
        return new Promise((fulfill, reject) => {
            let counter = 0;
            for (const id of Object.keys(this.games)) {
                try {
                    this.getGame(id);
                } catch (e) {
                    counter++;
                }
            }
            Log.info(`removed ${counter} expired games`);
            fulfill(counter);
        });
    }
}
