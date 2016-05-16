'use strict';

var gulp       = require('gulp'),
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
    'vendor/javascripts/jquery-2.1.1.js',
    'vendor/javascripts/pace.min.js',
    'vendor/javascripts/bootstrap.js',
    'vendor/javascripts/classie.js',
    'vendor/javascripts/cbpAnimatedHeader.js',
    'vendor/javascripts/wow.min.js',
    'vendor/javascripts/inspinia.js',
    'assets/javascripts/all.js'
  ],
  "ie.js": [
    'vendor/javascripts/respond.js',
    'vendor/javascripts/html5shiv.js',
    'vendor/javascripts/placeholder-IE-fixes.js'
  ]
};

var stylesheets = {
  'all.css': [
    'vendor/stylesheets/bootstrap.css',
    'vendor/stylesheets/animate.min.css',
    'vendor/stylesheets/font-awesome.css',
    'vendor/stylesheets/style.css',
    'intermediate/stylesheets/demo.css'
  ]
};

gulp.task('default', ['build', 'watch']);
gulp.task('build', ['fonts', 'javascripts', 'stylesheets']);

gulp.task('javascripts', ['all.js', 'ie.js']);
gulp.task('stylesheets', ['sass', 'all.css']);
gulp.task('fonts', ['fonts:fontawesome']);

gulp.task('all.js', function() {
  return gulp
    .src(javascripts['all.js'])
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest(js_output_dir));
});

gulp.task('ie.js', function() {
  return gulp
    .src(javascripts['ie.js'])
    .pipe(concat('ie.js'))
    .pipe(uglify())
    .pipe(gulp.dest(js_output_dir));
});

gulp.task('sass', function() {
  return gulp
    .src('assets/stylesheets/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('intermediate/stylesheets'));
});

gulp.task('all.css', function() {
  return gulp
    .src(stylesheets['all.css'])
    .pipe(postcss([
      autoprefixer(),
      cssnano()
    ]))
    .pipe(concat('all.css'))
    .pipe(gulp.dest(css_output_dir));
});

gulp.task('fonts:fontawesome', function() {
  return gulp.src('bower_components/font-awesome/fonts/*')
  .pipe(gulp.dest(font_output_dir));
});

gulp.task('watch', function() {
  gulp.watch(javascripts['all.js'], ['all.js']);
  gulp.watch(javascripts['ie.js'],  ['ie.js']);
  gulp.watch(stylesheets['all.css'], ['all.css']);

  glup.watch('assets/stylesheets/*.scss', ['sass']);

  // Watch bower components for changes.
  gulp.watch(['bower_components/font-awesome'], ['fonts:fontawesome']);
});

gulp.task('clean', function() {
  return del([output_dir]);
});
