var fs = require('fs');
var ini = require('ini');
var path = require('path');
// Gulp stuff
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
//var flatten = require('gulp-flatten');

var appConfig = ini.parse(fs.readFileSync('./app/config/main.ini', 'utf-8'));

gulp.task('jshint', function() {
  return gulp.src([
      './app/**/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('fonts', function(){
  return gulp.src('public/bower_components/bootstrap/fonts/*.*')
    .pipe(gulp.dest('public/themes/html5up-strongly-typed/fonts'));
});

gulp.task('less', function () {
  return gulp.src('public/themes/html5up-strongly-typed-src/less/main.less')
    .pipe(less())
    .pipe(gulp.dest('public/themes/html5up-strongly-typed/css'));
});

gulp.task('restart-passenger', function () {
  fs.writeSync(fs.openSync(__dirname + '/tmp/restart.txt', 'w'), '');
});

gulp.task('deploy', ['fonts', 'less', 'restart-passenger'], function () {
  console.log('Site deployed.');
});

gulp.task('watch', ['less'], function() {

  console.log('LESS files watching starts.');
  gulp.watch([
    'public/themes/**/*.less'
  ],
    ['less']
  );

  var liveReloadEnabled = !! appConfig['debug']['livereload'];

  if (liveReloadEnabled) {
    var livereloadPort = parseInt(appConfig['debug']['livereload.port']);
    var server = livereload(livereloadPort);
    console.log('LiveReload started.');
  }

});

gulp.task('default', ['watch']);

