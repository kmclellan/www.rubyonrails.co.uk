gulp = require 'gulp'

config    = require '../config'
addGlob   = require '../lib/add_glob'
component = require '../lib/component'

fontOutputDir = "#{config.outputDir}/fonts"

fontGlobs = [].concat.apply [], config.assets.fonts.map (pkg) ->
  component pkg, 'fonts'
.map (f) ->
  addGlob(f)

gulp.task "build:fonts", ->
  gulp.src fontGlobs
    .pipe gulp.dest fontOutputDir

gulp.task 'watch:fonts', ->
  gulp.watch(fontGlobs, ['build:fonts'])
