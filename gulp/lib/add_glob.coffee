module.exports = (path, extension = null) ->
  "#{path}/**/*#{if extension then ".#{extension}" else ''}"
