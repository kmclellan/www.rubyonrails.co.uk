config = require '../config'

module.exports = (pkg, kind) ->
  [ p, f ] = pkg.split('/')

  if p in [ 'inspinia', 'AnimatedHeader', 'amazon' ]
    if f
      vendorComponent(p, kind, f)
    else
      vendorComponent(p, kind)
  else
    bowerComponent(pkg, kind)

bowerComponent = (pkg, kind) ->
  pkgs =
    jquery:
      js: 'jquery/dist/jquery.js'
    pace:
      js: 'PACE/pace.js'
    fontawesome:
      fonts: 'font-awesome/fonts',
      scss:  'font-awesome/scss'
    bootstrap:
      js:    'bootstrap-sass/assets/javascripts/bootstrap.js',
      fonts: 'bootstrap-sass/assets/fonts',
      scss:  'bootstrap-sass/assets/stylesheets'
    classie:
      js: 'classie/classie.js'
    wow:
      js: 'wow/dist/wow.js'
    respond:
      js: 'respond/dest/respond.src.js'
    html5shiv:
      js: 'html5shiv/dist/html5shiv.js'
    animate:
      css: 'animate.css/animate.css'
    aws:
      js: 'aws-sdk/dist/aws-sdk.js'
    jsbn:
      js: [
        'jsbn/jsbn.js'
        'jsbn/jsbn2.js'
      ]

  if !pkgs[pkg] || !pkgs[pkg][kind]
    throw "couldnt find " + kind + " for package named '" + pkg + "'"

  files = pkgs[pkg][kind]
  files = [files] if typeof files is 'string'

  files.map (file) ->
    "#{config.bowerRoot}/#{file}"

vendorComponent = (pkg, kind, file = 'default') ->
  pkgs =
    inspinia:
      js:
        default: 'javascripts/inspinia.js',
        placeholder: 'javascripts/placeholder-IE-fixes.js'
      scss:
        default: 'scss'
    AnimatedHeader:
      js:
        default: 'js/cbpAnimatedHeader.js'
    amazon:
      js:
        default: 'javascripts/amazon-cognito.min.js'

  if !pkgs[pkg] || !pkgs[pkg][kind] || !pkgs[pkg][kind][file]
    throw "couldnt find #{kind} for package named '#{pkg}'."

  "#{config.vendorDir}/#{pkg}/#{pkgs[pkg][kind][file]}"
