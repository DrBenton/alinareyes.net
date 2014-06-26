var path = require('path');

var Q = require('q');

var app = require('../../app');

function registerErrorsHandlders () {

  /// catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  /// error handlers

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

}


// Event if this initializer is ot async, we return this init process... as a Promise, as usual! :-)
module.exports = function (previousInitializerPromise) {
  return previousInitializerPromise
    .then(function () {
      console.log('registerErrorsHandlders()');
      return registerErrorsHandlders();
    })
    .then(function () {
      console.log('Errors handlers registered. Errors handlers init process complete!');
    })
    .fail(function (err) {
      throw err;
    });
};