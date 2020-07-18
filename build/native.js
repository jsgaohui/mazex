require('./check-versions')()

process.env.NODE_ENV = 'production'
process.env.APP_MODULE = 'native'

var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.native.conf')

var spinner = ora('building for native app...')
spinner.start()

rm(path.join(config.native.assetsRoot, config.native.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')
  })
})
