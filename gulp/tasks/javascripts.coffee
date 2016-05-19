gulp       = require 'gulp'
concat     = require 'gulp-concat'
uglify     = require 'gulp-uglify'
sourcemaps = require 'gulp-sourcemaps'

component  = require '../lib/component'
config     = require '../config'

jsOutputDir = "#{config.outputDir}/javascripts"

javascriptFilesFor = (filename) ->
  [].concat.apply [], config.assets.javascripts[filename].map (pkg) ->
    component pkg, 'js'

jsTasks = (filename) ->
  gulp.task "build:javascripts:#{filename}:development", ->
    gulp.src javascriptFilesFor(filename).concat(["#{config.sourceDir}/javascripts/#{filename}.js"])
      .pipe sourcemaps.init()
      .pipe concat "#{filename}.js"
      .pipe sourcemaps.write '.'
      .pipe gulp.dest jsOutputDir

  gulp.task "build:javascripts:#{filename}:production", ->
    gulp.src javascriptFilesFor filename
      .pipe concat "#{filename}.js"
      .pipe uglify()
      .pipe gulp.dest jsOutputDir

Object.keys(config.assets.javascripts).map jsTasks

gulp.task 'watch:javascripts', ->
  for task in config.assets.javascripts
    gulp.watch javascriptFilesFor(task), [ "build:javascripts:#{task}:development" ]
