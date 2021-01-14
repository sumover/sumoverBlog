const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const appConfig = require('./app-config');
const helmet = require('helmet');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

app.use(helmet());

// view engine setup
app.set('views', appConfig.viewPath);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(appConfig.staticPath));
app.use(session({
    secret: "session sumover blog",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 3600
    }
}));


//  初始化URL mapping
require('./router-autodetect')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
