// Generated on 2016-03-15 using generator-angular 0.15.1
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var openURL = require('open');
var lazypipe = require(
    'lazypipe'); // https://github.com/OverZealous/lazypipe#using-with-more-complex-function-arguments-such-as-gulp-if
var rimraf = require('rimraf');
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');
var concatCss = require('gulp-concat-css');
var merge = require(
    'merge-stream'); // http://stackoverflow.com/questions/30782030/gulp-concat-after-sass

var client = {
  app : __dirname + '/client',
  dist : __dirname + '/public/app',
  dependencies : __dirname + '/client/dependencies'
};

var paths = {
  scripts : [ client.app + '/app.js', client.app + '/src/**/*.js' ],
  styles : [ client.app + '/app.scss', client.app + '/src/**/*.scss' ],
  views : {
    main : './views/index.phtml',
    source : './views/main.phtml',
    files : [ client.app + '/src/**/*.html' ]
  }
};

// Reusable pipelines
var lintScripts = lazypipe()
                      .pipe($.jshint, '.jshintrc')
                      .pipe($.jshint.reporter, 'jshint-stylish');
var styles =
    lazypipe()
        .pipe($.sourcemaps.init)
        .pipe($.sass,
              {
                outputStyle : 'expanded',
                precision : 10,
                includePaths : [
                  client.app + '',
                  client.dependencies + '/bootstrap-sass/assets/stylesheets',
                  client.dependencies + '/font-awesome/scss'
                ]
              })
        .pipe($.autoprefixer, 'last 1 version')
        .pipe($.sourcemaps.write)
        .pipe(gulp.dest, '.tmp');

var concatStyles = lazypipe()
                       .pipe($.sourcemaps.init)
                       .pipe(concatCss, 'all.css')
                       .pipe($.sourcemaps.write)
                       .pipe(gulp.dest, client.dist);

var concatAppScripts = lazypipe()
                           .pipe($.sourcemaps.init)
                           .pipe($.concat, 'all.js')
                           .pipe($.sourcemaps.write)
                           .pipe(gulp.dest, __dirname + '/public/js');

/*=============================================>>>>>
= Styles =
===============================================>>>>>*/

gulp.task('sass', function() { return gulp.src(paths.styles).pipe(styles()); });
gulp.task('compile:styles', function() {
  var sassStream = gulp.src(paths.styles).pipe($.plumber()).pipe(styles());
  var cssStream = gulp.src([ __dirname + '/.tmp/**/*.css' ]).pipe($.plumber());
  var compileStyles = merge(sassStream, cssStream).pipe(concatStyles());
  return compileStyles;
});

/*= End of Styles =*/
/*=============================================<<<<<*/

/*=============================================>>>>>
= scripts =
===============================================>>>>>*/
gulp.task('lint:scripts',
          function() { return gulp.src(paths.scripts).pipe(lintScripts()); });

gulp.task('compile:scripts:app', function() {
  var lintStream =
      gulp.src(paths.scripts).pipe($.plumber()).pipe(lintScripts());
  var appScriptStream =
      gulp.src(paths.scripts).pipe($.plumber()).pipe(concatAppScripts());
  var scriptTask = merge(lintStream, appScriptStream);
  return scriptTask;
});
/*= End of scripts =*/
/*=============================================<<<<<*/

gulp.task('html', function() {
  return gulp.src(client.app + '/src/**/*.html')
      .pipe(gulp.dest(client.dist + ''));
});

gulp.task('images', function() {
  return gulp.src(client.app + '/images/**/*')
      .pipe($.cache($.imagemin(
          {optimizationLevel : 5, progressive : true, interlaced : true})))
      .pipe(gulp.dest(client.dist + '/images'));
});

gulp.task('copy:extras', function() {
  return gulp.src(client.app + '/src/*/.*', {dot : true})
      .pipe(gulp.dest(client.dist));
});

gulp.task('copy:fonts', function() {
  return gulp.src(client.app + '/fonts/**/*')
      .pipe(gulp.dest(client.dist + '/../fonts'));
});

console.log($.watchSequence);
gulp.task('watch', function(cb) {
  gulp.watch(paths.views.files, [ 'html' ]);
  gulp.watch(paths.styles, [ 'compile:styles' ]);
  gulp.watch(paths.scripts, [ 'compile:scripts:app' ]);
  gulp.watch('bower.json', [ 'bower' ]);
});
// inject bower components
var bowerFileStream =
    gulp.src(__dirname + '/bower.json')
        .pipe($.mainBowerFiles())
        .pipe(gulp.dest(__dirname + '/public/client/dependencies/'));
var bowerWireDepStream =
    gulp.src(paths.views.main)
        .pipe(wiredep({directory : client.dependencies, ignorePath : '..'}))
        .pipe(gulp.dest('./views'));
var bowerTask = merge(bowerFileStream, bowerWireDepStream);

gulp.task('bower', function() { return bowerTask; });

gulp.task('clean:dist', function(cb) { rimraf('./public/app/', cb); });
gulp.task('clean:tmp', function(cb) { rimraf('./.tmp', cb); });

gulp.task('client:build', [ 'html', 'compile:styles', 'bower' ], function() {});
gulp.task('build', [ 'clean:dist', 'compile:scripts:app' ], function(cb) {
  runSequence([ 'images', 'copy:extras', 'copy:fonts', 'client:build' ], cb);
});
gulp.task('compile', function(cb) { runSequence([ 'build' ], 'watch', cb); });
gulp.task('default', [ 'build' ], function() {

});
