const path = require('path');
const WebpackHtmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Copy = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: [
      'react-hot-loader/patch',
      './src/app/root',
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: '/node_modules/',
        use: [
          'babel-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        use: 'file-loader?name=assets/[name].[ext]',
      },
      {
        test: /\.s?css$/,
        exclude: ['/node_modules/', path.join(__dirname, 'src', 'app')],
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
              },
            },
            { loader: 'sass-loader' },
          ],
        }),
      },
    ],
  },
  plugins: [
    new Copy([
      { from: 'node_modules/font-awesome/fonts', to: 'assets' },
      { from: 'node_modules/font-awesome/css/font-awesome.min.css' },
    ]),
    new WebpackHtmlPlugin({
      template: './src/index.html',
    }),
    new ExtractTextPlugin('styles.css'),
  ],
};