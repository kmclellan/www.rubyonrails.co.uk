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
var sourceDir   = 'source',
  scssSourceDir = sourceDir + '/stylesheets',
  bowerRoot     = 'bower_components';


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
gulp.task('default', ['build']);
gulp.task('build', ['build:production']);
gulp.task('serve', ['build:development', 'watch']);

var environments = [ 'development', 'production' ];
for(var i in environments) {
  var environment = environments[i];

  gulp.task('build:' + environment, ['fonts', 'javascripts', 'stylesheets'].map(function(task) { return 'build:' + task + ':' + environment }));
  gulp.task('build:javascripts:' + environment, Object.keys(javascripts).map(function(task) { return 'build:javascripts:' + task + ':' + environment }));
  gulp.task('build:stylesheets:' + environment, Object.keys(stylesheets).map(function(task) { return 'build:stylesheets:' + task + ':' + environment }));

  gulp.task('build:fonts:' + environment, function() {
    return gulp.src(fonts)
    .pipe(gulp.dest(fontOutputDir + '/'));
  });
}

function jsTasks(filename) {
  gulp.task('build:javascripts:' + filename + ':development', function() {
    return gulp
    .src(javascripts[filename])
    .pipe(sourcemaps.init())
    .pipe(concat(filename))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(jsOutputDir + '/'));
  });

  gulp.task('build:javascripts:' + filename + ':production', function() {
    return gulp
    .src(javascripts[filename])
    .pipe(concat(filename))
    .pipe(uglify())
    .pipe(gulp.dest(jsOutputDir + '/'));
  });
}

Object.keys(javascripts).map(jsTasks);

function cssTasks(filename) {
  gulp.task('build:stylesheets:' + filename + ':development', function() {
    var sassPipe = sass(sassFiles[filename], { loadPath: scssLoadPath, sourcemap: true });

    var cssPipe  = gulp.src(stylesheets[filename])
      .pipe(sourcemaps.init());

    return merge(sassPipe, cssPipe)
      .pipe(concat(filename))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(cssOutputDir + '/'));
  });

  gulp.task('build:stylesheets:' + filename + ':production', function() {
    var sassPipe = sass(sassFiles[filename], { loadPath: scssLoadPath });

    var cssPipe  = gulp.src(stylesheets[filename]);

    return merge(sassPipe, cssPipe)
      .pipe(concat(filename))
      .pipe(postcss([
        autoprefixer(),
        cssnano()
      ]))
      .pipe(gulp.dest(cssOutputDir + '/'));
  });
}

Object.keys(stylesheets).map(cssTasks);

gulp.task('watch', function() {
  for(var task in javascripts) {
    gulp.watch(javascripts[task], ['build:javascripts:' + task + ':development']);
  }

  var scssLoadPathGlobs = scssLoadPath.map(function(path) { return addGlob(path) });
  for(var task in stylesheets) {
    var globs = stylesheets[task].concat(scssLoadPathGlobs);
    gulp.watch(globs, ['build:stylesheets:' + task + ':development']);
  }

  gulp.watch(fonts, ['build:fonts:development']);
});

gulp.task('clean', function() {
  sass.clearCache();
  return del([outputDir]);
});

gulp.task('distclean', ['clean'], function() {
  return del([
    bowerRoot,
    'node_modules',
    '.sass-cache'
  ]);
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
