
/**
* Most of this code comes from "sails console", by Mike McNeil - MIT license
*
* Enter the interactive console (aka REPL) for the app
* in our working directory.
*/

var REPL = require('repl');
require('colors');


console.log('Starting app in interactive mode...'.magenta);

// Now load up our app
var app = require('../app');

app.initPromise
  .then(function () {

    console.info('Welcome to the app console.'.green);
    console.info('(to exit, type <CTRL>+<D>)'.grey);

    global.app = app;//our app will be immediately available, yeah!
    var repl = REPL.start({
      prompt: 'app> ',
      ignoreUndefined: true,
      useColors: true,
      useGlobal: true
    });

    repl.on('exit', function(err) {
      if (err) {
        process.exit(1);
      }
      console.log('');//adds a blank line before exiting...
      process.exit(0);
    });

  })
  .fail(function (err) {
    console.error('App console startup failed!');
    throw err;
  })
  .done();