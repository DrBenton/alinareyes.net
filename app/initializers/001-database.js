var path = require('path');

var Q = require('q');
var glob = Q.denodeify(require('glob'));
var _ = require('lodash');
var Knex = require('knex');
var Bookshelf = require('bookshelf');

var app = require('../../app');
var appConfig = app.get('config');

// Knex DB abstraction init
var knex = Knex({
  client: 'mysql',
  connection: {
    host     : appConfig['database']['host'],
    database : appConfig['database']['dbname'],
    user     : appConfig['database']['username'],
    password : appConfig['database']['password'],
    charset  : 'utf8'
  }
});

// Bookshelf ORM init
var bookshelf = Bookshelf(knex);

// Let's attach it to the application
app.set('bookshelf', bookshelf);

// Bookshelf plugins
bookshelf.plugin('virtuals');

// Recursive search of models
function loadModels () {

  var modelsLoadingPromise = glob('app/models/**/*.js', {cwd: app.get('appRootPath')})
    .then(function (modelsFilesPaths) {

      var appModels = {
        models: {},
        collections: {}
      };

      modelsFilesPaths.forEach(function (modelFilePath) {
        console.log('Model "'+modelFilePath+'" loading...');
        var modelData = require(path.join(app.get('appRootPath'), modelFilePath));
        var modelIdentity = modelData.identity;
        // Model management
        appModels.models[modelIdentity] = modelData.model;
        // Collection management
        appModels.collections[modelIdentity] = modelData.collection;
      });

      return appModels;
    });

  return modelsLoadingPromise;

}

// Start Waterline, passing adapters in.
// We return this init process... as a Promise, as usual! :-)
module.exports = function (previousInitializerPromise) {
  return previousInitializerPromise
    .then(function () {
      console.log('loadModels()');
      return loadModels();
    })
    .then(function (models) {
      console.log(_.size(models.models) + ' Model(s) linked to ORM. Database init process complete!');
      app.models = models.models;
      app.collections = {};
      app.collections._schemas = models.collections;
      app.collections.get = function (collectionIdentity) {
        if (!app.collections._schemas[collectionIdentity]) {
          throw new Error('No collection "'+collectionIdentity+'" found!');
        }
        return app.collections._schemas[collectionIdentity].forge();
      };
    })
    .fail(function (err) {
      throw err;
    });
};
