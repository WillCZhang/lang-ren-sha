let fs = require('fs');
let path = require('path');
let Game = require('./game');
let cachePath = path.join(__dirname, "/../data/");
let cacheFile = path.join(cachePath, "cache.json");

class GameEngine {
    constructor() {
        // TODO: delete expired games
        this.games = this._loadGames();
    }

    newGame(creator, settings) {
        if (!creator || !settings)
            throw new Error("Invalid request");
        let id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        while (Object.keys(this.games).includes(id)) {
            // I doubt this line will ever run...
            id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        }
        this.games[id] = new Game(creator, settings);
        this._saveGames();
    }

    getGame(id) {
        let game = this.games[id];
        if (game.isGameExpired())
            throw new Error("游戏已超时，一局游戏最长有效时间为一天 ：）");
        this._saveGames();
        return game;
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
                /* very likely the dir exists, do nothing, other errs will cause error when saving anyways */
            });
            return {};
        }
    }
}

module.exports = GameEngine;