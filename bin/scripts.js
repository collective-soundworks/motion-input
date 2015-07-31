var babel = require('babel');
var browserify = require('browserify');
var childProcess = require('child_process');
var clc = require('cli-color');
var fs = require('fs');
var fse = require('fs-extra');
var nodeWatch = require('node-watch');
var pkg = require('../package.json');
var uglifyJS = require('uglify-js');
var util = require('util');

// CONFIG
// -----------------------------------------------
var srcDir = 'src';
var distDir = 'dist';

// options for babel
var babelOptions = {
  sourceMap: 'inline',
  modules: 'common',
  optional: ['runtime']
};

// options for browserify
var browserifyOptions = {
  standalone: pkg.standalone,
  debug: true
};

// colors for shell - for a more complete list
// cf. http://stackoverflow.com/questions/5947742/how-to-change-the-output-color-of-echo-in-linux
var red   = '\033[0;31m';
var green = '\033[0;32m';
var NC    = '\033[0m'; // No Color

// COMMAND INTERPRETER
// -----------------------------------------------
var command = process.argv[2];
// execute the correct function given the script
switch (command) {
  case '--watch':
    watch();
    break;
  case '--bundle':
    bundle();
    break;
  case '--uglify':
    uglify();
    break;
  case '--transpile':
    transpileAll();
    break;
}

// HELPERS
// -----------------------------------------------

// create filename from src to dist
function createTargetName(filename) {
  // replace source dir with target dir and '.es6.js' to '.js'
  return filename.replace(new RegExp('^' + srcDir), distDir).replace('.es6.js', '.js');
}

// create filename from `pck.main` to `umd` version
function getUmdName() {
  return pkg.main.replace('.js', '.umd.js');
}

// create filename from `umd` to `min` version
function getMinName() {
  return getUmdName().replace('.umd.js', '.min.js');
}

// SCRIPTS
// -----------------------------------------------

// watch source dir
function watch() {
  nodeWatch(srcDir, function(filename) {
    transpile(filename);
  });
}

// create the `.umd.js` version
function bundle() {
  var src = './' + pkg.main;
  var target = getUmdName();
  var b = browserify(src, browserifyOptions);

  try {
    b.bundle().pipe(fse.createWriteStream(target));
    // is not called at the right place - streams are async
    console.log(util.format(green + '=> "%s" successfully created' + NC, target));
  } catch(e) {
    return console.log(err.message);
  }

}

// create the `.min.js` version
function uglify() {
  var src = getUmdName();
  var target = getMinName();
  var res = uglifyJS.minify(src);

  fse.outputFile(target, res.code, function(err, res) {
    if (err) { return console.log(err.message); }

    console.log(util.format(green + '=> "%s" successfully created' + NC, target));
    // reminder
    console.log(util.format(red + '==> THINK ABOUT UPDATING PACKAGE VERSION [npm --help version] <==' + NC));
  });
}

// transpile all files in `srcDir`
function transpileAll() {
  var cmd = 'find ' + srcDir + ' -type f';

  childProcess.exec(cmd , function(err, stdout, stderr) {
    if (err) { console.error(err); }
    var fileList = stdout.split('\n');

    fileList.forEach(function(file, index) {
      if (!file) { return; }
      // if (index > 1) { return; }
      transpile(file);
    });
  });
}

// transpile one file
function transpile(src) {
  var target = createTargetName(src);
  // if async transform is used all source maps refers to the last file... looks like a babel bug
  // try {
    var res = babel.transformFileSync(src, babelOptions);
  // } catch(err) {
  //   console.log(err.message);
  // }

  fse.outputFile(target, res.code, function(err) {
    if (err) { return console.error(err.message); }

    console.log(util.format(green + '=> "%s" successfully transpiled to "%s"' + NC, src, target));
  });
}