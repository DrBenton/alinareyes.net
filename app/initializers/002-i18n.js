var path = require('path');

var Q = require('q');
var glob = Q.denodeify(require('glob'));
var _ = require('lodash');
require('require-yaml');

var app = require('../../app');

function loadTranslations () {

  var translationsLoadingPromise = glob('app/data/i18n/**/*.yml', {cwd: app.get('appRootPath')})
    .then(function (translationsFilesPaths) {

      var translations = {};

      translationsFilesPaths.forEach(function (translationFilePath) {
        console.log('Translation "'+translationFilePath+'" loading...');
        var translationData = require(path.join(app.get('appRootPath'), translationFilePath));
        var language = translationData['LANGUAGE'];
        delete translationData['LANGUAGE'];
        translations[language] = translationData;
      });

      return translations;
    });

  return translationsLoadingPromise;

}

// Search & load internationalization data.
// We return this init process... as a Promise, as usual! :-)
module.exports = function (previousInitializerPromise) {
  return previousInitializerPromise
    .then(function () {
      console.log('loadTranslations()');
      return loadTranslations();
    })
    .then(function (translations) {
      console.log(_.size(translations) + ' translation(s) loaded. Internationalization init process complete!');
      app.i18n = translations;
    })
    .fail(function (err) {
      throw err;
    });
};
