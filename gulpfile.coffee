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

scssLoadPath = [
  scssSourceDir,
  component('bootstrap', 'scss'),
  component('fontawesome', 'scss'),
  component('inspinia', 'scss')
]

outputDir    = 'intermediate'
jsOutputDir   = "#{outputDir}/javascripts"
cssOutputDir  = "#{outputDir}/stylesheets"
fontOutputDir = "#{outputDir}/fonts"

assets =
  stylesheets:
    all: [
      'animate'
    ]
  javascripts:
    all: [
      'jquery'
      'pace'
      'bootstrap'
      'classie'
      'AnimatedHeader'
      'wow'
      'inspinia'
    ]
    ie: [
      'respond'
      'html5shiv'
      'inspinia/placeholder'
    ]
  fonts: [
    'fontawesome',
    'bootstrap'
  ]

# A set of generic tasks to do specific parts of the build.
gulp.task('default', ['build'])
gulp.task('build', ['build:production'])
gulp.task('serve', ['build:development', 'watch'])

addGlob = (path, extension = null) ->
  "#{path}/**/*#{if extension then ".#{extension}" else ''}"

for environment in [ 'development', 'production' ]
  gulp.task "build:#{environment}", ['fonts', 'javascripts', 'stylesheets'].map (task) -> "build:#{task}:#{environment}"
  gulp.task "build:javascripts:#{environment}", Object.keys(assets.javascripts).map (task) -> "build:javascripts:#{task}:#{environment}"
  gulp.task "build:stylesheets:#{environment}", Object.keys(assets.stylesheets).map (task) -> "build:stylesheets:#{task}:#{environment}"

  gulp.task "build:fonts:#{environment}", ->
    fontGlobs = assets.fonts.map (pkg) -> addGlob component pkg, 'fonts'

    gulp.src fontGlobs
      .pipe gulp.dest fontOutputDir

jsTasks = (filename) ->
  files = assets.javascripts[filename].map (pkg) -> component pkg, 'js'

  gulp.task "build:javascripts:#{filename}:development", ->
    gulp
      .src files
      .pipe sourcemaps.init()
      .pipe concat "#{filename}.js"
      .pipe sourcemaps.write '.'
      .pipe gulp.dest jsOutputDir

  gulp.task "build:javascripts:#{filename}:production", ->
     gulp
      .src files
      .pipe concat "#{filename}.js"
      .pipe uglify()
      .pipe gulp.dest jsOutputDir

Object.keys(assets.javascripts).map jsTasks

cssTasks = (filename) ->
  cssFiles  = assets.stylesheets[filename].map (pkg) -> component pkg, 'css'
  sassGlobs = addGlob(scssSourceDir, 'scss')

  gulp.task "build:stylesheets:#{filename}:development", ->
    sassPipe = sass sassGlobs, loadPath: scssLoadPath, sourcemap: true

    cssPipe = gulp.src cssFiles
      .pipe sourcemaps.init()

    merge sassPipe, cssPipe
      .pipe concat "#{filename}.css"
      .pipe sourcemaps.write '.'
      .pipe gulp.dest cssOutputDir

  gulp.task "build:stylesheets:#{filename}:production", ->
    sassPipe = sass sassGlobs, loadPath: scssLoadPath

    cssPipe  = gulp.src cssFiles

    merge sassPipe, cssPipe
      .pipe concat "#{filename}.css"
      .pipe postcss [
        autoprefixer(),
        cssnano()
      ]
      .pipe gulp.dest cssOutputDir

Object.keys(assets.stylesheets).map cssTasks

gulp.task 'watch', ->
  for task in assets.javascripts
    files = assets.javascripts[task].map (pkg) -> component pkg, 'js'

    gulp.watch files, [ "build:javascripts:#{task}:development" ]

  scssLoadPathGlobs = scssLoadPath.map addGlob

  for task in assets.stylesheets
    files = assets.stylesheets[filename].map (pkg) -> component pkg, 'css'

    gulp.watch files, [ "build:stylesheets:#{task}:development" ]
    gulp.watch scssLoadPathGlobs, [ "build:stylesheets:#{tasks}:development" ]


  fontGlobs = assets.fonts.map (pkg) -> addGlob component pkg, 'fonts'
  gulp.watch(fontGlobs, ['build:fonts:development'])
