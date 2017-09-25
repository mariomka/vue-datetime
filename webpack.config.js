const path = require('path')

module.exports = {
  context: __dirname,

  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'vue-datetime',
    libraryTarget: 'umd',
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'],
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.vue'],
  },

  externals: {
    vue: 'vue',
  }
}
