var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');

var mongoStore  = require('connect-mongo')(session);

var passport= require('passport');
var flash = require('connect-flash');
var helmet = require('helmet');

var routes = require('./routes/index');
var userRoutes = require('./routes/user');


var app = express();
//solving deprecation issue
app.use(helmet());

/* Commenting database connection*/

var mongodb = 'mongodb://127.0.0.1/pasco';
//重点在这一句，赋值一个全局的承诺。
mongoose.Promise = global.Promise;
var db = mongoose.connect(mongodb);
//res.locals.db = req.db;*/
require('./config/passport');
require('./config/configMpower');

//mongoose.connect('localhost:27017/pasco');

// view engine setup

app.engine('.hbs',expressHbs({defaultLayout:'layout',extname:'.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(session(
    { secret: 'mysupersecret',
      resave:false,
      saveUninitialized:false,
      store : new mongoStore({ mongooseConnection: mongoose.connection }),
      cookie: {maxAge: 210 * 60 * 1000}
    }
  ));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(expressValidator());

//checking if the user is login to generate the corresponding view
app.use(function (req,res,next) {
  res.locals.db = req.db;
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

app.use('/user', userRoutes);
app.use('/', routes);


// Handle 404
app.use(function(req, res) {
  //res.send('404: Page not Found', 404);
  res.status(404);
  res.render('shop/404');
});

//handle favicon error 500 message
app.use(ignoreFavicon);

// Handle 500
/*app.use(function(error, req, res, next) {
 res.send('500: Internal Server Error', 500);
 });*/
// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  if(err.code = 500){
    console.log(err.errors);
  }

  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


//write middleware taking care of 500 message error
function ignoreFavicon(req, res, next) {
  if (req.originalUrl === '/favicon.ico') {
    res.status(204).json({nope: true});
  } else {
    next();
  }
}
module.exports = app;


