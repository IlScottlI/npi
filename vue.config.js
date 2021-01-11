module.exports = {
  publicPath: '/npi',
  devServer: {
    disableHostCheck: true,
  },

  configureWebpack: {
    resolve: {
      symlinks: false,
    },
  },
  transpileDependencies: ['vuetify'],
}
