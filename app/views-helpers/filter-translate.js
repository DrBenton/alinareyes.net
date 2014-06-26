var ejs = require('ejs');
var app = require('../../app');

ejs.filters.trans = function(i18nKey, locale) {
  return app.locals.trans(i18nKey, locale, null);
};

