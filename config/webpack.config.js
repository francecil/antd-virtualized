const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const resolveFile = function(filePath) {
  return path.join(__dirname, '..', filePath)
}
module.exports = {
  entry: resolveFile('dist/css.js'),
  output: {
    filename: 'css.bundle.js',
    path: resolveFile('dist')
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'antdv.css',
    }),
  ],
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              javascriptEnabled: true
            }
          },
        ],
      },
    ],
  },
};