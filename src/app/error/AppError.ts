export default class AppError extends Error {
    public message: any;
    private language;

    constructor(message: string) {
        super();
        this.message = message;
    }

    public getMessage() {
        return this.message;
    }
}
