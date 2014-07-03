var app = require('../../app');
var _ = require('lodash');

app.locals.trans = function(i18nKey, locale, interpolationHash) {

  // Raw message (probably from a debug cotext): no translation
  if (!_.isString(i18nKey) || -1 === i18nKey.indexOf('.')) {
    return i18nKey;
  }

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
        result = app.locals.interpolate(result, interpolationHash);
      }
      return result;
    }
  }
};

