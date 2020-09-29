"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GameError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
    getMessage() {
        return this.message;
    }
}
exports.default = GameError;
//# sourceMappingURL=GameError.js.map