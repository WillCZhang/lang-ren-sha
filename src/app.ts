import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";

const FileStore = require('session-file-store')(session);
import logger from "morgan";

import {createRooms, index, rooms, sit} from "./routes/app";
import Log from "./app/Util";

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "/../frontend/views"));
app.set("view engine", "pug");

const port = process.env.PORT || 3000;

app.set("port", port);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/../frontend/public")));
app.use("/js", express.static(path.join(__dirname + '/../frontend/public/js')));

app.use(session({
    name: "skey",
    secret: "wjerwleiaffwer", // TODO: remove from Github && change it
    saveUninitialized: false,
    store: new FileStore(),
    resave: false,
    cookie: {
        maxAge: 100000 * 1000 // expire about a day
    }
}));

app.get("/", index);
app.get("/rooms/:id", rooms);
app.post("/create-room", createRooms);
app.post("/sit", sit);

// catch 404 and forward to error handler
app.use(function (req: any, res: any, next: (arg0: any) => void) {
    next(createError(404));
});

// error handler
app.use(function (err: any,
                  req: any,
                  res: any,
                  next: any) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

app.listen(port, () => {
    Log.info(`🚀 App listening on the port ${port}`);
});

export default app;
