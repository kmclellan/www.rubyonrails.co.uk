gulp = require 'gulp'

config    = require './gulp/config'
component = require './gulp/lib/component'
addGlob   = require './gulp/lib/add_glob'

require './gulp/tasks/fonts'
require './gulp/tasks/javascripts'
require './gulp/tasks/stylesheets'

# A set of generic tasks to do specific parts of the build.
gulp.task('default', ['build'])
gulp.task('build', ['build:production'])
gulp.task('serve', ['build:development', 'watch'])

for environment in config.environments
  gulp.task "watch", ['fonts', 'javascripts', 'stylesheets'].map (task) -> "watch:#{task}"

  gulp.task "build:#{environment}", ['build:fonts', "build:javascripts:#{environment}", "build:stylesheets:#{environment}"]
  gulp.task "build:javascripts:#{environment}", Object.keys(config.assets.javascripts).map (task) -> "build:javascripts:#{task}:#{environment}"
  gulp.task "build:stylesheets:#{environment}", Object.keys(config.assets.stylesheets).map (task) -> "build:stylesheets:#{task}:#{environment}"
