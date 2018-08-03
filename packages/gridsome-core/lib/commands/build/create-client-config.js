const VueSSRClientPlugin = require('./plugins/VueSSRClientPlugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = api => {
  const config = api.resolveChainableWebpackConfig()

  config.stats('none')
  config.plugins.delete('friendly-errors')

  config.node
    .merge({
      setImmediate: false,
      global: false,
      process: false,
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    })

  config
    .plugin('ssr-client')
    .use(VueSSRClientPlugin, [{
      filename: 'manifest/client.json'
    }])

  config
    .plugin('progress')
    .use(require('webpack/lib/ProgressPlugin'))

  config
    .plugin('optimize-css')
    .use(OptimizeCssAssetsPlugin, [{
      canPrint: false,
      cssProcessorOptions: {
        safe: true,
        autoprefixer: { disable: true },
        mergeLonghand: false
      }
    }])

  config
    .plugin('define')
    .tap((args) => [Object.assign({}, ...args, {
      'process.client': true,
      'process.server': false
    })])
  
  return api.service.resolveWebpackConfig(config)
}
