gulp         = require 'gulp'
concat       = require 'gulp-concat'
sourcemaps   = require 'gulp-sourcemaps'
postcss      = require 'gulp-postcss'
sass         = require 'gulp-ruby-sass'
autoprefixer = require 'autoprefixer'
cssnano      = require 'cssnano'
merge        = require 'merge-stream'

component = require '../lib/component'
addGlob   = require '../lib/add_glob'
config    = require '../config'

scssSourceDir = "#{config.sourceDir}/stylesheets"
cssOutputDir  = "#{config.outputDir}/stylesheets"

scssSourceGlob = addGlob scssSourceDir, 'scss'
scssLoadPath = [ scssSourceDir ].concat config.scssModules.map (pkg) -> component pkg, 'scss'
scssLoadPathGlobs = scssLoadPath.map (path) -> addGlob path

stylesheetFilesFor = (filename) ->
  [].concat.apply [], config.assets.stylesheets[filename].map (pkg) ->
    component pkg, 'css'

cssTasks = (filename) ->
  gulp.task "build:stylesheets:#{filename}:development", ->
    cssPipe = gulp.src stylesheetFilesFor(filename)
    sassPipe = sass scssSourceGlob, loadPath: scssLoadPath, sourcemap: true

    cssPipe
      .pipe sourcemaps.init()

    merge sassPipe, cssPipe
      .pipe concat "#{filename}.css"
      .pipe sourcemaps.write '.'
      .pipe gulp.dest cssOutputDir

  gulp.task "build:stylesheets:#{filename}:production", ->
    cssPipe = gulp.src stylesheetFilesFor(filename)
    sassPipe = sass scssSourceGlob, loadPath: scssLoadPath

    merge sassPipe, cssPipe
      .pipe concat "#{filename}.css"
      .pipe postcss [
        autoprefixer(),
        cssnano()
      ]
      .pipe gulp.dest cssOutputDir

Object.keys(config.assets.stylesheets).map cssTasks

gulp.task 'watch:stylesheets', ->
  for task in config.assets.stylesheets
    gulp.watch stylesheetFilesFor(task), [ "build:stylesheets:#{task}:development" ]

  gulp.watch scssLoadPathGlobs, [ "build:stylesheets:development" ]
