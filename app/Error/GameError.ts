export default class GameError extends Error {
	public message: any;

    constructor(message: string) {
        super();
        this.message = message;
    }

    getMessage() {
        return this.message;
    }
}