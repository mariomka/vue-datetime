const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, '../demo/src/app.js'),

  output: {
    path: path.resolve(__dirname, '../demo/dist'),
    filename: 'app.js',
    publicPath: path.resolve(__dirname, '../demo/dist/')
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('postcss-cssnext')()
              ]
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    },
    extensions: ['.js', '.vue']
  },
  devServer: {
    contentBase: path.resolve(__dirname, '../demo')
  }
}
