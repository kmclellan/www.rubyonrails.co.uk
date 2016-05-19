path = require 'path'

module.exports =
  bowerRoot: 'bower_components'
  sourceDir: 'source'
  outputDir: 'intermediate'
  vendorDir: 'vendor'

  environments: [
    'development',
    'production'
  ]

  assets:
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
        'aws'
        'amazon'
        'jsbn'
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

  scssModules: [
    'bootstrap',
    'fontawesome',
    'inspinia'
  ]
