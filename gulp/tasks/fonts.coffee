gulp = require 'gulp'

config    = require '../config'
addGlob   = require '../lib/add_glob'
component = require '../lib/component'

fontOutputDir = "#{config.outputDir}/fonts"
fontGlobs = config.assets.fonts.map (pkg) -> addGlob component pkg, 'fonts'

gulp.task "build:fonts", ->
  gulp.src fontGlobs
    .pipe gulp.dest fontOutputDir

gulp.task 'watch:fonts', ->
  gulp.watch(fontGlobs, ['build:fonts'])
