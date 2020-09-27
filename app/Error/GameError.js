export default class GameError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
    getMessage() {
        return this.message;
    }
}
//# sourceMappingURL=GameError.js.map