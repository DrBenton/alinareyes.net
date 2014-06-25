var app = require('./app');

console.log('Waiting for app initialization...');

app.initPromise.then(function () {
  console.log('App initialization done.');
  var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
  });
}
).done();

