const path = require('path')
const postcss = require('postcss')
const cssnext = require('postcss-cssnext')
const CleanCSS = require('clean-css')
const write = require('./write.js')

function processCss (style) {
  const componentName = path.basename(style.id, '.vue')
  return postcss([cssnext()])
    .process(style.code, {})
    .then(result => {
      return {
        name: componentName,
        css: result.css,
        map: result.map
      }
    })
}

function processStyle (style) {
  if (style.lang === 'css') {
    return processCss(style)
  } else {
    throw new Error(`Unknown style language '${style.lang}'`)
  }
}

function writeCss (style) {
  write(`dist/${style.name}.css`, style.css)

  if (style.original) {
    write(`dist/${style.name}.${style.original.ext}`, style.original.code)
  }

  if (style.map) {
    write(`dist/${style.name}.css.map`, style.map)
  }

  write(`dist/${style.name}.min.css`, new CleanCSS().minify(style.css).styles)
}

module.exports = {
  writeCss,
  processStyle
}
