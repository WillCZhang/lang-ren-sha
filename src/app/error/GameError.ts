export default class GameError extends Error {
	public message: any;

    constructor(message: string) {
        super();
        this.message = message;
    }

    public getMessage() {
        return this.message;
    }
}
