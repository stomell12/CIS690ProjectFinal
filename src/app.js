const mySecret = process.env['connectionString']
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var flash = require('connect-flash');

const mongoose = require('mongoose');

var bodyParser = require('body-parser');
var loginRouter = require('./routes/login');
var dashboardRouter = require('./routes/dashboard');
var infoRouter = require('./routes/info');
var accountRouter = require('./routes/account');
var patientRouter = require('./routes/patient')

var app = express();

mongoose.connect(process.env['connectionString'], {useNewUrlParser:true, useUnifiedTopology:true});

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
var session = require('express-session');
require('./config/passport')(passport);
app.use(cookieParser()); // read cookies (needed for auth)

app.use(session({
  secret: 'devkey',
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', loginRouter);
app.use('/dashboard', dashboardRouter);
app.use('/info', infoRouter);
app.use('/account', accountRouter);
app.use('/patient', patientRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  //consider changing this to res.render a notFound.ejs view
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

app.get('/dashboard/list', (req, res) => {
    res.render('dashboardList', { currentPage: 'PatientDashboard' });
});

app.get('/dashboard/userlist', (req, res) => {
    res.render('dashboardUserList', { currentPage: 'UserDashboard' });
});

app.get('/account/myAccount', (req, res) => {
    res.render('MyAccount', { currentPage: 'AccountList' });
});

module.exports = app;
