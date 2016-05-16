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

var javascripts = {
  "all.js": [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/PACE/pace.js',
    'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
    'bower_components/classie/classie.js',
    'bower_components/AnimatedHeader/js/cbpAnimatedHeader.js',
    'bower_components/wow/dist/wow.js',
    'vendor/javascripts/inspinia.js',
    'source/javascripts/all.js'
  ],
  "ie.js": [
    'bower_components/respond/dest/respond.src.js',
    'bower_components/html5shiv/dist/html5shiv.js',
    'vendor/javascripts/placeholder-IE-fixes.js'
  ]
};

var fonts = [
  'bower_components/font-awesome/fonts/*',
  'bower_components/bootstrap-sass/assets/fonts/**/*'
];

gulp.task('default', ['build', 'watch']);
gulp.task('build', ['fonts', 'javascripts', 'stylesheets']);

gulp.task('javascripts', ['all.js', 'ie.js']);
gulp.task('stylesheets', ['all.css']);

gulp.task('all.js', function() {
  return gulp
    .src(javascripts['all.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(js_output_dir));
});

gulp.task('ie.js', function() {
  return gulp
    .src(javascripts['ie.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('ie.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(js_output_dir));
});

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
