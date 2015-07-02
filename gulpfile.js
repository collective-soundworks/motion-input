var gulp = require('gulp');
var browserify = require('browserify');
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var watch = require('gulp-watch');

gulp.task('browserify', ['transpile-app'], function() {
  var bundleStream = browserify('./test-app/index.js').bundle();
 
  bundleStream
    .pipe(source('index.js'))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('./test-app'));
});

gulp.task('transpile-app', ['transpile-lib'], function() {
  return gulp.src('test-app/index.es6.js')
    .pipe(babel())
    .pipe(rename(function(path) {
      path.basename = path.basename.replace('.es6', '');
    }))
    .pipe(gulp.dest('./test-app/'));
});

gulp.task('transpile-lib', function() {
  return gulp.src('src/*.es6.js')
    .pipe(babel())
    .pipe(rename(function(path) {
      path.basename = path.basename.replace('.es6', '');
    }))
    .pipe(gulp.dest('./src/'));

});

gulp.task('watch-app', function() {
  gulp.watch(['./test-app/index.es6.js'], ['browserify']);
});

gulp.task('watch-lib', function() {
  gulp.watch('./src/*.es6.js', ['browserify']);
});

gulp.task('default', ['browserify', 'watch-app', 'watch-lib']);