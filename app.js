// Node.js core Modules
var fs = require('fs');
var path = require('path');
// Third-party Modules
var express = require('express');
var ini = require('ini');
var Q = require('q');
var glob = Q.denodeify(require('glob'));
// Express / Connect Middlewares
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var connectI18n = require('connect-i18n');

// App instance creation
var app = express();

// App config loading & parsing
var appConfig = ini.parse(fs.readFileSync('./app/config/main.ini', 'utf-8'));
app.set('config', appConfig);
app.set('appRootPath', __dirname);

// view engine setup
app.set('views', path.join(__dirname, 'app', 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout-main');

// Express / Connect Middlewares plugging
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.use(connectI18n({default_locale: 'fr', handled_locales: ['fr']}));

// Initializers, go!
app.initPromise = glob('app/initializers/*.js', { cwd: app.get('appRootPath')})
  .then(function (files) {

    var currentInitalizerPromise = Q();//let's start with a fullfilled Promise...
    files.forEach(function (initializerFilePath) {
      console.log('Registering initializer "'+path.basename(initializerFilePath)+'"...');
      var initializer = require(path.join(app.get('appRootPath'), initializerFilePath));
      var initializerPromise = initializer(currentInitalizerPromise);
      currentInitalizerPromise = initializerPromise;
    });

    return currentInitalizerPromise;
  });

// Each Initializer returns a Promise
// --> our app will be ready to serve when the combination of these Promises,
// accessible as "app.initPromise", fill be successfully fulfilled.
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
