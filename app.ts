import * as createError from 'http-errors';
import * as express from 'express';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
// import FileStore from 'session-file-store';
import * as logger from 'morgan';

import {createRooms, index, rooms} from './routes/app.js';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.set("port", process.env.PORT || 3000);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'wjerwleiaffwer', // TODO: remove from Github && change it
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 100000 // expire about a day
  }
}));

app.get("/", index);
app.get("/rooms/:id", rooms);
app.post("/create-room", createRooms);

// catch 404 and forward to error handler
app.use(function(req: any, res: any, next: (arg0: any) => void) {
  next(createError(404));
});

// error handler
app.use(function(err: any,
                 req: any,
                 res: any,
                 next: any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen();

export default app;
