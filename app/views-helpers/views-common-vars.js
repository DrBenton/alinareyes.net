var _ = require('lodash');
var _s = require('underscore.string');

var app = require('../../app');

var appConfig = app.get('config');

app.locals._ = _;
app.locals._s = _s;
app.locals.appConfig= appConfig;
app.locals.baseUrl= appConfig['general']['baseUrl'];
app.locals.themeUrl= appConfig['theme']['themeUrl'];
app.locals.bowerComponentsUrl= appConfig['general']['bowerComponentsUrl'];
