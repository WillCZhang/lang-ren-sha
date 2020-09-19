class Game {
    // TODO：不确定要不要最少or最多玩家数目check…感觉没必要
    // 理论上说如果abstraction做的好的话不需要做检查
    constructor(creator, settings) {
        this.createdTime = Date.now();
        this.settings = settings; // 每个职业配比
        let count = 0;
        for (let job of Object.keys(settings))
            count += settings[job];
        this.players = count; // 玩家数量
        this.playerIds = [creator]; // 玩家id list
        this.assignment = {}; // 玩家职业分配（start之后才会有）
        this.started = false;
    }

    join(playerId) {
        if (this.started || this.playerIds.length >= this.players)
            return false;
        this.playerIds.concat(playerId);
        return true;
    }

    start() {
        if (this.playerIds.length !== this.players)
            return false;
        this._assignJob();
        this.started = true;
        return true;
    }

    getCreatedTime() {
        return this.createdTime;
    }

    _assignJob() {
        // shuffle 3 times before assign
        this.playerIds = this._shuffle(this.playerIds);
        this.playerIds = this._shuffle(this.playerIds);
        this.playerIds = this._shuffle(this.playerIds);

        for (let player of this.playerIds)
            this.assignment[player] = this._getNextAvailableJob();

        delete this.settings;
    }

    _shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    _getNextAvailableJob() {
        for (let job of Object.keys(this.settings)) {
            if (this.settings[job] === 0) {
                delete this.settings[job];
            } else {
                this.settings[job] = this.settings[job] - 1;
                return job;
            }
        }
        // will never reach this line
        return undefined;
    }
}

module.exports = Game;