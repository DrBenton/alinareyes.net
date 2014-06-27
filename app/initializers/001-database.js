var path = require('path');

var Q = require('q');
var glob = Q.denodeify(require('glob'));
var _ = require('lodash');

var app = require('../../app');
var appConfig = app.get('config');

// Knex DB abstraction init
var knex = require('knex')({
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
var bookshelf = require('bookshelf')(knex);

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
        var modelSchema = modelData.modelSchema;
        var model = bookshelf.Model.extend(modelSchema);
        appModels.models[modelIdentity] = model;
        // Collection management
        var collectionSchema = modelData.collectionSchema || {};
        collectionSchema.model = model;
        var collection = bookshelf.Collection.extend(collectionSchema);
        appModels.collections[modelIdentity] = collection;
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
