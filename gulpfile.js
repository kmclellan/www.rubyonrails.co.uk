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
    'vendor/javascripts/pace.min.js',
    'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
    'vendor/javascripts/classie.js',
    'vendor/javascripts/cbpAnimatedHeader.js',
    'vendor/javascripts/wow.min.js',
    'vendor/javascripts/inspinia.js',
    'assets/javascripts/all.js'
  ],
  "ie.js": [
    'vendor/javascripts/respond.js',
    'bower_components/html5shiv/dist/html5shiv.js',
    'vendor/javascripts/placeholder-IE-fixes.js'
  ]
};

var stylesheets = {
  'all.css': [
    'vendor/stylesheets/animate.min.css',
    'intermediate/stylesheets/demo.css',
    'vendor/stylesheets/style.css'
  ]
};

var fonts = [
  'bower_components/font-awesome/fonts/*',
  'bower_components/bootstrap-sass/assets/fonts/**/*'
];

gulp.task('default', ['build', 'watch']);
gulp.task('build', ['fonts', 'javascripts', 'stylesheets']);

gulp.task('javascripts', ['all.js', 'ie.js']);
gulp.task('stylesheets', ['sass', 'all.css']);

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

gulp.task('sass', function() {
  return gulp
    .src('assets/stylesheets/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: [
        'assets/stylesheets',
        'bower_components/bootstrap-sass/assets/stylesheets',
        'bower_components/font-awesome/scss'
      ]
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('intermediate/stylesheets'));
});

gulp.task('all.css', function() {
  return gulp
    .src(stylesheets['all.css'])
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(postcss([
      autoprefixer(),
      cssnano()
    ]))
    .pipe(concat('all.css'))
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
  gulp.watch(stylesheets['all.css'], ['all.css']);

  gulp.watch('assets/stylesheets/*.scss', ['sass']);

  // Watch bower components for changes.
  gulp.watch(['bower_components/font-awesome/fonts/*', 'bower_components/bootstrap/assets/fonts/**/*'], ['fonts']);
});

gulp.task('clean', function() {
  return del([output_dir]);
});
