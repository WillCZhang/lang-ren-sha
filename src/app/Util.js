"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Collection of logging methods. Useful for making the output easier to read and understand.
 */
/* tslint:disable */
/* eslint-disable */
class Log {
    static trace(...msg) {
        console.log(`<T> ${new Date().toLocaleString()}:`, ...msg);
    }
    static info(...msg) {
        console.info(`<I> ${new Date().toLocaleString()}:`, ...msg);
    }
    static warn(...msg) {
        console.warn(`<W> ${new Date().toLocaleString()}:`, ...msg);
    }
    static error(...msg) {
        console.error(`<E> ${new Date().toLocaleString()}:`, ...msg);
    }
    static test(...msg) {
        console.log(`<X> ${new Date().toLocaleString()}:`, ...msg);
    }
}
exports.default = Log;
//# sourceMappingURL=Util.js.map