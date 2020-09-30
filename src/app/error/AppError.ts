export default class AppError extends Error {
    public getMessage() {
        return this.message;
    }
}
