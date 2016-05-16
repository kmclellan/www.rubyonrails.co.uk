'use strict';

var gulp       = require('gulp'),
  sourcemaps   = require('gulp-sourcemaps'),
  concat       = require('gulp-concat'),
  uglify       = require('gulp-uglify'),
  postcss      = require('gulp-postcss'),
  sass         = require('gulp-sass'),
  autoprefixer = require('autoprefixer'),
  cssnano      = require('cssnano'),
  del          = require('del');

var output_dir   = 'intermediate',
  js_output_dir  = output_dir + '/javascripts/',
  css_output_dir = output_dir + '/stylesheets/',
  font_output_dir = output_dir + '/fonts/';

var bowerRoot = 'bower_components';

function bowerComponent(pkg) {
  var pkgs = {
    'jquery':         'jquery/dist/jquery.js',
    'pace':           'PACE/pace.js',
    'bootstrap':      'bootstrap-sass/assets/javascripts/bootstrap.js',
    'classie':        'classie/classie.js',
    'animatedheader': 'AnimatedHeader/js/cbpAnimatedHeader.js',
    'wow':            'wow/dist/wow.js',
    'respond':        'respond/dest/respond.src.js',
    'html5shiv':      'html5shiv/dist/html5shiv.js'
  };

  if(!pkgs[pkg]) {
    throw "couldnt find package named '" + pkg + "'";
  }

  return bowerRoot + '/' + pkgs[pkg];
}

var javascripts = {
  "all.js": [
    bowerComponent('jquery'),
    bowerComponent('pace'),
    bowerComponent('bootstrap'),
    bowerComponent('classie'),
    bowerComponent('animatedheader'),
    bowerComponent('wow'),
    'vendor/inspinia/javascripts/inspinia.js'
  ],
  "ie.js": [
    bowerComponent('respond'),
    bowerComponent('html5shiv'),
    'vendor/inspinia/javascripts/placeholder-IE-fixes.js'
  ]
};

var fonts = [
  bowerRoot + '/font-awesome/fonts/*',
  bowerRoot + '/bootstrap-sass/assets/fonts/**/*'
];

gulp.task('default', ['build', 'watch']);
gulp.task('build', ['fonts', 'javascripts', 'stylesheets']);

gulp.task('javascripts', ['all.js', 'ie.js']);
gulp.task('stylesheets', ['all.css']);

function jsTask(name) {
  var filename = name + '.js';

  gulp.task(filename, function() {
    return gulp
    .src(javascripts[filename])
    .pipe(sourcemaps.init())
    .pipe(concat(filename))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(js_output_dir));
  });
}

jsTask('all');
jsTask('ie');

gulp.task('all.css', function() {
  return gulp
    .src([
      'source/stylesheets/*.scss',
      'bower_components/animate.css/animate.css'
    ])
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: [
        'source/stylesheets',
        'bower_components/bootstrap-sass/assets/stylesheets',
        'bower_components/font-awesome/scss',
        'vendor/inspinia/scss'
      ]
    }))
    .pipe(concat('all.css'))
    .pipe(postcss([
      autoprefixer(),
      cssnano()
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(css_output_dir));
});

gulp.task('fonts', function() {
  return gulp.src(fonts)
  .pipe(gulp.dest(font_output_dir));
});

gulp.task('watch', function() {
  gulp.watch(javascripts['all.js'], ['all.js']);
  gulp.watch(javascripts['ie.js'],  ['ie.js']);

  gulp.watch([
    'source/stylesheets/**/*.scss',
    'bower_components/animate.css/animate.css',
    'bower_components/bootstrap-sass/assets/stylesheets/**/*.scss',
    'bower_components/font-awesome/scss/**/*.scss'
  ], ['stylesheets']);

  // Watch bower components for changes.
  gulp.watch([fonts], ['fonts']);
});

gulp.task('clean', function() {
  return del([output_dir]);
});
