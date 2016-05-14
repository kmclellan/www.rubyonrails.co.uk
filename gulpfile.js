var gulp       = require('gulp'),
  concat       = require('gulp-concat'),
  uglify       = require('gulp-uglify'),
  postcss      = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  cssnano      = require('cssnano'),
  del          = require('del');

var output_dir   = 'intermediate',
  js_output_dir  = output_dir + '/javascripts/',
  css_output_dir = output_dir + '/stylesheets/';

var javascripts = {
  "all.js": [
    'vendor/javascripts/jquery-2.1.1.js',
    'vendor/javascripts/pace.min.js',
    'vendor/javascripts/bootstrap.js',
    'vendor/javascripts/classie.min.js',
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
  ]
};

gulp.task('default', ['build', 'watch']);
gulp.task('build', ['javascripts', 'stylesheets']);
gulp.task('javascripts', ['all.js', 'ie.js']);
gulp.task('stylesheets', ['all.css']);

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

gulp.task('watch', function() {
  gulp.watch(javascripts['all.js'], ['all.js']);
  gulp.watch(javascripts['ie.js'],  ['ie.js']);
  gulp.watch(stylesheets['all.css'], ['all.css']);
});

gulp.task('clean', function() {
  return del([output_dir]);
});
