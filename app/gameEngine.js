let log4js = require("log4js");
let logger = log4js.getLogger();

let fs = require('fs');
let path = require('path');
let GameError = require('./Error/GameError');
let Game = require('./game');
let cachePath = path.join(__dirname, "/../data/");
let cacheFile = path.join(cachePath, "cache.json");

const MAX_ID_LENGTH = 8;
const MAX_GAME_ID = 100000000;
const GARBAGE_COLLECTION_THRESHOLD = MAX_GAME_ID / 2;

/**
 * GameEngine is the entry point of the app. The caller, the controller in this case,
 * should perform validation before invoke the Engine.
 */
class GameEngine {
    constructor() {
        this.games = this._loadGames();
        this._removeExpiredGames().then(counter => logger.log("removed {} expired games", counter));
    }

    /**
     * This should create a new game in the system, and generate a unique {@code MAX_ID_LENGTH}-digit game ID
     * for users to join the game.
     * @param creator
     * @param settings
     * @return string id
     */
    newGame(creator, settings) {
        let id = this._generateGameId();
        this.games[id] = new Game(creator, settings);
        this._saveGames();
        return id;
    }

    /**
     *
     * @param id
     * @return Game the game
     */
    getGame(id) {
        let game = this.games[id];
        if (!game)
            throw new GameError("游戏ID不存在");
        if (game.isGameExpired()) {
            delete this.games[id];
            throw new GameError("游戏已超时，一局游戏最长有效时间为一天 ：）");
        }
        this._saveGames();
        return game;
    }

    _generateGameId() {
        if (Object.keys(this.games).length > GARBAGE_COLLECTION_THRESHOLD)
            this._removeExpiredGames().then(counter => logger.log("removed {} expired games", counter));

        let id = Math.floor(Math.random() * MAX_GAME_ID).toString();
        while (Object.keys(this.games).includes(id)) {
            // TODO: should probably add a cool-down period in the controller if we'are hacked
            id = Math.floor(Math.random() * MAX_GAME_ID).toString();
        }

        if (id.length < MAX_ID_LENGTH)
            id = "0".repeat(MAX_ID_LENGTH - id.length) + id;

        return id;
    }

    _saveGames() {
        // should be async to reduce latency
        fs.writeFile(cacheFile, JSON.stringify(this.games), err => {
            if (err) throw err;
        });
    }

    _loadGames() {
        try {
            return JSON.parse(fs.readFileSync(cacheFile).toString());
        } catch (e) {
            fs.mkdir(cachePath, (err) => {
                /* very likely the dir exists, do nothing, other errs will cause error when saving */
            });
            return {};
        }
    }

    _removeExpiredGames() {
        return new Promise((fulfill, reject) => {
            let counter = 0;
            for (let id of Object.keys(this.games)) {
                try {
                    this.getGame(id);
                } catch (e) {
                    counter++;
                }
            }
            fulfill(counter);
        });
    }
}

module.exports = GameEngine;