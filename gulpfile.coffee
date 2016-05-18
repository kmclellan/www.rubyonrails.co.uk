# Gulp modules, et al, that I'm using.
gulp         = require 'gulp'
sourcemaps   = require 'gulp-sourcemaps'
concat       = require 'gulp-concat'
uglify       = require 'gulp-uglify'
postcss      = require 'gulp-postcss'
sass         = require 'gulp-ruby-sass'
autoprefixer = require 'autoprefixer'
cssnano      = require 'cssnano'
del          = require 'del'
merge        = require 'merge-stream'

# Where things live.
sourceDir     = 'source'
scssSourceDir = "#{sourceDir}/stylesheets"
bowerRoot     = 'bower_components'

# Map the utterly non-standard package format to a list of files of a
# particular type for a package.

component = (pkg, kind) ->
  [ p, f ] = pkg.split('/')

  if p == 'inspinia' || p == 'AnimatedHeader'
    if f
      vendorComponent(p, kind, f)
    else
      vendorComponent(p, kind)
  else
    bowerComponent(pkg, kind)

bowerComponent = (pkg, kind) ->
  pkgs = {
    'jquery': {
      'js': 'jquery/dist/jquery.js'
    },
    'pace': {
      'js': 'PACE/pace.js'
    },
    'fontawesome': {
      'fonts': 'font-awesome/fonts',
      'scss':  'font-awesome/scss'
    },
    'bootstrap': {
      'js':    'bootstrap-sass/assets/javascripts/bootstrap.js',
      'fonts': 'bootstrap-sass/assets/fonts',
      'scss':  'bootstrap-sass/assets/stylesheets'
    },
    'classie': {
      'js': 'classie/classie.js'
    },
    'wow': {
      'js': 'wow/dist/wow.js'
    },
    'respond': {
      'js': 'respond/dest/respond.src.js'
    },
    'html5shiv': {
      'js': 'html5shiv/dist/html5shiv.js'
    },
    'animate': {
      'css': 'animate.css/animate.css'
    }
  }

  if !pkgs[pkg] || !pkgs[pkg][kind]
    throw "couldnt find " + kind + " for package named '" + pkg + "'"

  bowerRoot + '/' + pkgs[pkg][kind]

vendorComponent = (pkg, kind, file = 'default') ->
  vendorRoot = 'vendor'

  pkgs = {
    'inspinia': {
      'js': {
        'default': 'javascripts/inspinia.js',
        'placeholder': 'javascripts/placeholder-IE-fixes.js'
      },
      'scss': { 'default': 'scss' }
    },
    'AnimatedHeader': {
      'js': {
        'default': 'js/cbpAnimatedHeader.js'
      }
    }
  }

  if !pkgs[pkg] || !pkgs[pkg][kind] || !pkgs[pkg][kind][file]
    throw "couldnt find " + kind + " for package named '" + pkg + "'"

  vendorRoot + '/' + pkg + '/' + pkgs[pkg][kind][file]

addGlob = (path, extension) ->
  if extension
    path + '/**/*.' + extension
  else
    path + '/**/*'

scssLoadPath = [
  scssSourceDir,
  component('bootstrap', 'scss'),
  component('fontawesome', 'scss'),
  component('inspinia', 'scss')
]

outputDir    = 'intermediate'
jsOutputDir   = outputDir + '/javascripts'
cssOutputDir  = outputDir + '/stylesheets'
fontOutputDir = outputDir + '/fonts'

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

gulp.task 'clean', ->
  sass.clearCache()
  del([outputDir])

gulp.task 'distclean', ['clean'], ->
  del([
    bowerRoot,
    'node_modules',
    '.sass-cache'
  ])
