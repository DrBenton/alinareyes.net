var path = require('path');

var Q = require('q');
var glob = Q.denodeify(require('glob'));
var _ = require('lodash');

var app = require('../../app');

function loadRoutes () {

  var routesLoadingPromise = glob('app/routes/**/*.js', {cwd: app.get('appRootPath')})
    .then(function (routesFilesPaths) {

      routesFilesPaths.forEach(function (routeFilePath) {
        console.log('Route "'+routeFilePath+'" loading...');
        var routesData = require(path.join(app.get('appRootPath'), routeFilePath));
        app.use(routesData.mountUrl, routesData.router);
      });

      return routesFilesPaths;
    });

  return routesLoadingPromise;

}

// Search & load routes files.
// We return this init process... as a Promise, as usual! :-)
module.exports = function (previousInitializerPromise) {
  return previousInitializerPromise
    .then(function () {
      console.log('loadRoutes()');
      return loadRoutes();
    })
    .then(function (routesFilesPaths) {
      console.log(_.size(routesFilesPaths) + ' routes file(s) loaded and registered. Routes init process complete!');
    })
    .fail(function (err) {
      throw err;
    });
};
