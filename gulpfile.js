'use strict';

// Gulp modules, et al, that I'm using.
var gulp       = require('gulp'),
  sourcemaps   = require('gulp-sourcemaps'),
  concat       = require('gulp-concat'),
  uglify       = require('gulp-uglify'),
  postcss      = require('gulp-postcss'),
  sass         = require('gulp-ruby-sass'),
  autoprefixer = require('autoprefixer'),
  cssnano      = require('cssnano'),
  del          = require('del'),
  merge        = require('merge-stream');

// Where things live.
var sourceDir = 'source',
  scssSourceDir = sourceDir + '/stylesheets';


var scssLoadPath = [
  scssSourceDir,
  component('bootstrap', 'scss'),
  component('fontawesome', 'scss'),
  component('inspinia', 'scss')
];

var outputDir    = 'intermediate',
  jsOutputDir   = outputDir + '/javascripts',
  cssOutputDir  = outputDir + '/stylesheets',
  fontOutputDir = outputDir + '/fonts';

// What goes into the built stylesheets.
var stylesheets = {
  "all.css": [
    component('animate', 'css')
  ]
}

var sassFiles = {
  "all.css": [
    addGlob(scssSourceDir, 'scss'),
  ]
}

// What goes into the built javascripts.
var javascripts = {
  "all.js": [
    'jquery',
    'pace',
    'bootstrap',
    'classie',
    'AnimatedHeader',
    'wow',
    'inspinia'
  ].map(function(pkg) { return component(pkg, 'js') }),
  "ie.js": [
    'respond',
    'html5shiv',
    'inspinia/placeholder'
  ].map(function(pkg) { return component(pkg, 'js') })
};

// The fonts we want to be built.
var fonts = ['fontawesome', 'bootstrap'].map(function(pkg) { return addGlob(component(pkg, 'fonts')); });

// A set of generic tasks to do specific parts of the build.
gulp.task('default', ['build', 'watch']);
gulp.task('build', ['fonts', 'javascripts', 'stylesheets']);

gulp.task('javascripts', Object.keys(javascripts));
gulp.task('stylesheets', Object.keys(stylesheets));

function jsTask(filename) {
  return gulp.task(filename, function() {
    return gulp
    .src(javascripts[filename])
    .pipe(sourcemaps.init())
    .pipe(concat(filename))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(jsOutputDir + '/'));
  });
}

Object.keys(javascripts).map(jsTask);

function cssTask(filename) {
  return gulp.task(filename, function() {
    var sassPipe = sass(sassFiles[filename], { loadPath: scssLoadPath, sourcemap: true });

    var cssPipe  = gulp.src(stylesheets[filename])
      .pipe(sourcemaps.init());

    return merge(sassPipe, cssPipe)
      .pipe(concat(filename))
      .pipe(postcss([
        autoprefixer(),
        cssnano()
      ]))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(cssOutputDir + '/'));
  });
}

Object.keys(stylesheets).map(cssTask);

gulp.task('fonts', function() {
  return gulp.src(fonts)
  .pipe(gulp.dest(fontOutputDir + '/'));
});

gulp.task('watch', function() {
  for(var task in javascripts) {
    gulp.watch(javascripts[task], [task]);
  }

  var scssLoadPathGlobs = scssLoadPath.map(function(path) { return addGlob(path) });
  for(var task in stylesheets) {
    var globs = stylesheets[task].concat(scssLoadPathGlobs);
    gulp.watch(globs, [task]);
  }

  gulp.watch(fonts, ['fonts']);
});

gulp.task('clean', function() {
  sass.clearCache();
  return del([outputDir]);
});

function component(pkg, kind) {
  var [ p, f ] = pkg.split('/');

  if(p == 'inspinia' || p == 'AnimatedHeader') {
    if(f) {
      return vendorComponent(p, kind, f);
    } else {
      return vendorComponent(p, kind);
    }
  } else {
    return bowerComponent(pkg, kind);
  }
}

// Map the utterly non-standard package format to a list of files of a
// particular type for a package.
function bowerComponent(pkg, kind) {
  var bowerRoot = 'bower_components';

  var pkgs = {
    'jquery': {
      'js': 'jquery/dist/jquery.js'
    },
    'pace': {
      'js': 'PACE/pace.js'
    },
    'fontawesome': {
      'fonts': 'font-awesome/fonts',
      'scss':  'font-awesome/scss'
    },
    'bootstrap': {
      'js':    'bootstrap-sass/assets/javascripts/bootstrap.js',
      'fonts': 'bootstrap-sass/assets/fonts',
      'scss':  'bootstrap-sass/assets/stylesheets'
    },
    'classie': {
      'js': 'classie/classie.js'
    },
    'wow': {
      'js': 'wow/dist/wow.js'
    },
    'respond': {
      'js': 'respond/dest/respond.src.js'
    },
    'html5shiv': {
      'js': 'html5shiv/dist/html5shiv.js'
    },
    'animate': {
      'css': 'animate.css/animate.css'
    }
  };

  if(!pkgs[pkg] || !pkgs[pkg][kind]) {
    throw "couldnt find " + kind + " for package named '" + pkg + "'";
  }

  return bowerRoot + '/' + pkgs[pkg][kind];
}

function vendorComponent(pkg, kind, file = 'default') {
  var vendorRoot = 'vendor';

  var pkgs = {
    'inspinia': {
      'js': {
        'default': 'javascripts/inspinia.js',
        'placeholder': 'javascripts/placeholder-IE-fixes.js'
      },
      'scss': { 'default': 'scss' }
    },
    'AnimatedHeader': {
      'js': {
        'default': 'js/cbpAnimatedHeader.js'
      }
    }
  }

  if(!pkgs[pkg] || !pkgs[pkg][kind] || !pkgs[pkg][kind][file]) {
    throw "couldnt find " + kind + " for package named '" + pkg + "'";
  }

  return vendorRoot + '/' + pkg + '/' + pkgs[pkg][kind][file];
}

function addGlob(path, extension) {
  if(extension) {
    return path + '/**/*.' + extension;
  } else {
    return path + '/**/*';
  }
}
