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
var loadModels = function() {

  var modelsLoadingPromise = glob('app/models/**/*.js', {cwd: app.get('appRootPath')})
    .then(function (modelsFilesPaths) {

      var appModels = {
        models: {},
        collections: {}
      };

      modelsFilesPaths.forEach(function (modelFilePath) {
        console.log('Model "'+modelFilePath+'" loading...');
        var modelData = require(path.join(app.get('appRootPath'), modelFilePath));
        console.log('->', modelData);
        var modelIdentity = modelData.identity;
        var modelSchema = modelData.schema;
        // The Model and its Collection are added to the ORM
        var model = bookshelf.Model.extend(modelSchema);
        appModels.models[modelIdentity] = model;
        var collection = bookshelf.Collection.extend({
          model: model
        });
        appModels.collections[modelIdentity] = collection.forge();//our Collections are singletons
      });

      return appModels;
    });

  return modelsLoadingPromise;

};

// Start Waterline, passing adapters in.
// We return this init process... as a Promise, as usual! :-)
module.exports = loadModels()
  .then(function (models) {
    console.log(_.size(models.models) + ' Model(s) linked to ORM. Database init process complete!');
    app.models = models.models;
    app.collections = models.collections;
  })
  .fail(function (err) {
    throw err;
  });
