gulp = require 'gulp'
sass = require 'gulp-ruby-sass'
del  = require 'del'

config = require '../config'

gulp.task 'clean', ->
  sass.clearCache()
  del [config.outputDir]

gulp.task 'distclean', ['clean'], ->
  del [
    config.bowerRoot,
    'node_modules',
    '.sass-cache'
  ]
