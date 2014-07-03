var swig = require('swig');
var app = require('../../app');

swig.setFilter('trans', function(i18nKey, locale) {
  return app.locals.trans(i18nKey, locale, null);
});

