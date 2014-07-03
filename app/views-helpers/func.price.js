var _ = require('lodash');
var _s = require('underscore.string');
var app = require('../../app');

app.locals.price = function(amount, locale) {
  var i18nKey, interpolationHash;
  if (0 === amount) {
    i18nKey = 'common.price_free';
  } else {
    var amountStr = amount.toString();
    if ( -1 === amountStr.indexOf('.')) {
      i18nKey = 'common.price_int';
      interpolationHash = {'%int%': amountStr};
    } else {
      var amountArray = amountStr.split('.')
      var amountInt = amountArray[0], amountDecimal = amountArray[1];
      i18nKey = 'common.price_float';
      interpolationHash = {
        '%int%': amountInt,
        '%decimal%': _s.pad(amountDecimal, 2, '0', 'right')
      };
    }
  }

  return app.locals.trans(i18nKey, locale, interpolationHash);
};

