var ejs = require('ejs');
var app = require('../../app');
var _ = require('lodash');

app.locals.trans = function(i18nKey, locale, interpolationHash) {
  var i18nKeyArray = i18nKey.split('.');
  if (!app.i18n[locale]) {
    return '[unhandled locale "'+locale+'"]';
  }
  var currentI18nScope = app.i18n[locale];
  for(var i= 0, j = i18nKeyArray.length; i < j; i++) {
    var currentKeyPart = i18nKeyArray[i];
    if (!currentI18nScope[currentKeyPart]) {
      return '['+i18nKey+']';
    }
    if (i < j - 1) {
      currentI18nScope = currentI18nScope[currentKeyPart];
    } else {
      var result = currentI18nScope[currentKeyPart];
      if (interpolationHash) {
        _.forEach(interpolationHash, function (value, key) {
          result = result.replace(key, value);
        });
      }

      return result;
    }
  }
};

