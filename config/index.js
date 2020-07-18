const target = 'http://13.228.217.246:8080'
const path = require('path')
module.exports = {
  dev: {
    env: require('./dev.env'),
    port: 8888,
    autoOpenBrowser: false,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    cssSourceMap: false,
    proxyTable: {
      '/verify/': {
        target,
        pathRewrite: {
          '^/verify/': '/verify',
        },
      },
      '/app/':{
        target,
        pathRewrite: {
          '^/app/': '/app/'
        },
      },
      '/udax/': {
        target,
        pathRewrite: {
          '^/udax/': '/udax/'
        },
      },
      '/v8': {
        changeOrigin: true,
        target:'https://query2.finance.yahoo.com/v8/finance/chart/TSLA?formatted=true&crumb=IPhO8nOr2B9&lang=en-US&region=US&interval=1d&events=div%7Csplit&range=1y&corsDomain=finance.yahoo.com',
        pathRewrite: {
          '^/v8': ''
        },
      },
      '/sec-filings': {
        changeOrigin: true,
        target:'https://backend.otcmarkets.com/otcapi/company/sec-filings/TSLA?symbol=TSLA&page=1&pageSize=50',
        pathRewrite: {
          '^/sec-filings': ''
        },
      },
    },
  },
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    productionSourceMap: false,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report,
  },
  native: {
    env: require('./native.env'),
    index: path.resolve(__dirname, '../../PabApp/native/index.html'),
    assetsRoot: path.resolve(__dirname, '../../PabApp/native'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    productionSourceMap: false,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report,
  },
}
