"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
// import FileStore from 'session-file-store';
const morgan_1 = __importDefault(require("morgan"));
const app_1 = require("./routes/app");
const app = express_1.default();
// view engine setup
app.set("views", path_1.default.join(__dirname, "/../frontend/views"));
app.set("view engine", "pug");
const port = process.env.PORT || 3000;
app.set("port", port);
app.use(morgan_1.default("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
app.use(express_1.default.static(path_1.default.join(__dirname, "/../frontend/public")));
app.use(express_session_1.default({
    secret: "wjerwleiaffwer",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 100000 // expire about a day
    }
}));
app.get("/", app_1.index);
app.get("/rooms/:id", app_1.rooms);
app.post("/create-room", app_1.createRooms);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(http_errors_1.default(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});
app.listen(port, () => {
    console.log(`🚀 App listening on the port ${port}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map