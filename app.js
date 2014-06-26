var fs = require('fs');
var path = require('path');

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var ini = require('ini');
var Q = require('q');
var glob = Q.denodeify(require('glob'));

var routes = require('./app/routes/index');
var users = require('./app/routes/users');

var app = express();

// App config loading & parsing
var appConfig = ini.parse(fs.readFileSync('./app/config/main.ini', 'utf-8'));
app.set('config', appConfig);
app.set('appRootPath', __dirname);

// view engine setup
app.set('views', path.join(__dirname, 'app', 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);

app.use('/', routes);
app.use('/users', users);

// Views common locals
app.locals.sayHello = function () {
  return 'hello old chap!';
};
app.locals.themeUrl= appConfig['theme']['themeUrl'];

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// Initializers, go!
app.initPromise = glob('app/initializers/*.js', { cwd: app.get('appRootPath')})
  .then(function (files) {

    console.log(files);
    var allInitializersPromise = Q();

    files.forEach(function (initializerFilePath) {
      var initializerPromise = require(path.join(app.get('appRootPath'), initializerFilePath));
      allInitializersPromise = allInitializersPromise.thenResolve(initializerPromise);
    });

    return allInitializersPromise;
  });

app.initPromise
  .then(function () {
    console.log('Initializers done.');
  })
  .fail(function (err) {
    console.log('Initializers error !', err);
    console.dir(err);
    throw err;
  })
  .done();

module.exports = app;
