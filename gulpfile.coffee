# Gulp modules, et al, that I'm using.
gulp         = require 'gulp'
sourcemaps   = require 'gulp-sourcemaps'
concat       = require 'gulp-concat'
uglify       = require 'gulp-uglify'
postcss      = require 'gulp-postcss'
sass         = require 'gulp-ruby-sass'
autoprefixer = require 'autoprefixer'
cssnano      = require 'cssnano'
merge        = require 'merge-stream'
hub     = require 'gulp-hub'

config = require './gulp/config'
component = require './gulp/lib/component'

hub ['gulp/tasks/*.coffee']

# Where things live.
scssSourceDir = "#{config.sourceDir}/stylesheets"

# Map the utterly non-standard package format to a list of files of a
# particular type for a package.
addGlob = (path, extension) ->
  "#{path}/**/*#{extension ? ".#{extension}" : ''}"

scssLoadPath = [
  scssSourceDir,
  component('bootstrap', 'scss'),
  component('fontawesome', 'scss'),
  component('inspinia', 'scss')
]

outputDir    = 'intermediate'
jsOutputDir   = outputDir + "#{outputDir}/javascripts"
cssOutputDir  = outputDir + "#{outputDir}/stylesheets"
fontOutputDir = outputDir + "#{outputDir}/fonts"

# What goes into the built stylesheets.
stylesheets =
  "all.css": [
    component('animate', 'css')
  ]

sassFiles = {
  "all.css": [
    addGlob(scssSourceDir, 'scss'),
  ]
}

# What goes into the built javascripts.
javascripts =
  "all.js": [
    'jquery',
    'pace',
    'bootstrap',
    'classie',
    'AnimatedHeader',
    'wow',
    'inspinia'
  ].map (pkg) -> component pkg, 'js',
  "ie.js": [
    'respond',
    'html5shiv',
    'inspinia/placeholder'
  ].map (pkg) -> component pkg, 'js'


# The fonts we want to be built.
fonts = ['fontawesome', 'bootstrap'].map (pkg) -> addGlob(component(pkg, 'fonts'))

# A set of generic tasks to do specific parts of the build.
gulp.task('default', ['build'])
gulp.task('build', ['build:production'])
gulp.task('serve', ['build:development', 'watch'])

for environment in [ 'development', 'production' ]
  gulp.task('build:' + environment, ['fonts', 'javascripts', 'stylesheets'].map (task) -> 'build:' + task + ':' + environment)
  gulp.task('build:javascripts:' + environment, Object.keys(javascripts).map (task) -> 'build:javascripts:' + task + ':' + environment)
  gulp.task('build:stylesheets:' + environment, Object.keys(stylesheets).map (task) -> 'build:stylesheets:' + task + ':' + environment)

  gulp.task 'build:fonts:' + environment, ->
    gulp.src(fonts)
      .pipe(gulp.dest(fontOutputDir + '/'))

jsTasks = (filename) ->
  gulp.task 'build:javascripts:' + filename + ':development', ->
    gulp
      .src(javascripts[filename])
      .pipe(sourcemaps.init())
      .pipe(concat(filename))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(jsOutputDir + '/'))

  gulp.task 'build:javascripts:' + filename + ':production', ->
     gulp
      .src(javascripts[filename])
      .pipe(concat(filename))
      .pipe(uglify())
      .pipe(gulp.dest(jsOutputDir + '/'))

Object.keys(javascripts).map(jsTasks)

cssTasks = (filename) ->
  gulp.task 'build:stylesheets:' + filename + ':development', ->
    sassPipe = sass(sassFiles[filename], loadPath: scssLoadPath, sourcemap: true)

    cssPipe = gulp.src(stylesheets[filename])
      .pipe(sourcemaps.init())

    merge(sassPipe, cssPipe)
      .pipe(concat(filename))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(cssOutputDir + '/'))

  gulp.task 'build:stylesheets:' + filename + ':production', ->
    sassPipe = sass(sassFiles[filename], { loadPath: scssLoadPath })

    cssPipe  = gulp.src(stylesheets[filename])

    merge(sassPipe, cssPipe)
      .pipe(concat(filename))
      .pipe(postcss([
        autoprefixer(),
        cssnano()
      ]))
      .pipe(gulp.dest(cssOutputDir + '/'))

Object.keys(stylesheets).map(cssTasks)

gulp.task 'watch', ->
  for javascript in javascripts
    gulp.watch(javascripts[task], ['build:javascripts:' + task + ':development'])

  scssLoadPathGlobs = scssLoadPath.map (path) -> addGlob(path)
  for stylesheet in stylesheets
    globs = stylesheets[task].concat(scssLoadPathGlobs)
    gulp.watch(globs, ['build:stylesheets:' + task + ':development'])


  gulp.watch(fonts, ['build:fonts:development'])
