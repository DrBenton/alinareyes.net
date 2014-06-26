var app = require('../../app');

var appConfig = app.get('config');

app.locals.themeUrl= appConfig['theme']['themeUrl'];