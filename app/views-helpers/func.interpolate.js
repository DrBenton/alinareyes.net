var app = require('../../app');
var _ = require('lodash');

app.locals.interpolate = function(string, interpolationHash) {
  _.forEach(interpolationHash, function (value, key) {
    string = string.replace(key, value);
  });

  return string;
};

