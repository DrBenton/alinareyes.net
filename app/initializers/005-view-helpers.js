var path = require('path');

var Q = require('q');
var glob = Q.denodeify(require('glob'));
var _ = require('lodash');

var app = require('../../app');

function loadViewHelpers () {

  var viewsHelpersLoadingPromise = glob('app/views-helpers/**/*.js', {cwd: app.get('appRootPath')})
    .then(function (viewsHelpersFilesPaths) {

      viewsHelpersFilesPaths.forEach(function (viewsHelperFilePath) {
        console.log('View helper "'+viewsHelperFilePath+'" loading...');
        require(path.join(app.get('appRootPath'), viewsHelperFilePath));
      });

      return viewsHelpersFilesPaths;
    });

  return viewsHelpersLoadingPromise;

}

// Search & require() Views Helpers.
// We return this init process... as a Promise, as usual! :-)
module.exports = function (previousInitializerPromise) {
  return previousInitializerPromise
    .then(function () {
      console.log('loadViewHelpers()');
      return loadViewHelpers();
    })
    .then(function (viewsHelpersPaths) {
      console.log(_.size(viewsHelpersPaths) + ' Views Helper(s) loaded. Views Helpers init process complete!');
    })
    .fail(function (err) {
      throw err;
    });
};