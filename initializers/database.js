var Waterline = require('waterline');
var mysqlAdapter = require('sails-mysql');
var Q = require('q');
var glob = Q.denodeify(require('glob'));
var _ = require('lodash');

var app = require('../app');
var appConfig = app.get('config');

var dbConfig = {

  // Setup Adapters
  // Creates named adapters that have have been required
  adapters: {
    'default': mysqlAdapter
  },

  // Build Connections Config
  // Setup connections using the named adapter configs
  connections: {
    'default': {
      adapter: 'default',
      host: appConfig['database']['host'],
      database: appConfig['database']['dbname'],
      user: appConfig['database']['username'],
      password: appConfig['database']['password']
    }
  },

  defaults: {
    connection: 'default',
    migrate: 'alter'
  }

};


// Instantiate a new instance of the ORM
var orm = new Waterline();


// Recursive search of models
var loadModels = function() {

  var modelsLoadingPromise = glob('models/**/*.js', {cwd: app.get('appRootPath')})
    .then(function (modelsFilesPaths) {

      modelsFilesPaths.forEach(function (modelFilePath) {
        console.log('Model "'+modelFilePath+'" loading...');
        var model = require(app.get('appRootPath') + '/' + modelFilePath);
        // Model collection is added to the ORM
        orm.loadCollection(model);
      });

    });

  return modelsLoadingPromise;

};

// Start Waterline, passing adapters in.
// We return this init process... as a Promise, as usual! :-)
module.exports = loadModels()
  .then(function () {
    console.log('Models loaded');
    return Q.ninvoke(orm, 'initialize', dbConfig);
  })
  .then(function (models) {
    console.log(_.size(models.collections) + ' Model(s) linked to ORM. Database init process complete!');
    app.models = models.collections;
  })
  .fail(function (err) {
    throw err;
  });
