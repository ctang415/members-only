require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
const LocalStrategy = require('passport-local').Strategy
var logger = require('morgan');
const session = require('express-session')
const passport = require('passport')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models/user')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const board = require('./routes/board')
const auth = require('./routes/auth')

mongoose.connect(`${process.env.mongodb}`, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.authenticate('session'));
app.use(passport.session())
app.use(express.urlencoded({ extended: false }));


app.use(function(req, res, next) {
  res.locals.user = req.user || null;
  console.log(res.locals.user)
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/board', board)
app.use('/', auth)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// function used to authenticate

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
