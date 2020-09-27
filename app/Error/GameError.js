class GameError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }

    getMessage() {
        return this.message;
    }
}

module.exports = GameError;