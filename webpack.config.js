const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: './module.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'module.js',
    libraryTarget: 'amd',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src/plugin.json'), to: 'plugin.json' },
        { from: path.resolve(__dirname, 'src/img'), to: 'img', noErrorOnMissing: true },
        { from: path.resolve(__dirname, 'README.md'), to: 'README.md', noErrorOnMissing: true },
        { from: path.resolve(__dirname, 'LICENSE'), to: '.', noErrorOnMissing: true },
        { from: path.resolve(__dirname, 'CHANGELOG.md'), to: 'CHANGELOG.md', noErrorOnMissing: true },
      ],
    }),
  ],
  devtool: 'source-map',
  externals: [
    'react',
    'react-dom',
    '@grafana/data',
    '@grafana/ui',
    '@grafana/runtime',
    '@emotion/css',
    (context, request, callback) => {
      const prefix = 'grafana/';
      if (request.indexOf(prefix) === 0) {
        return callback(null, request.substr(prefix.length));
      }
      callback();
    },
  ],
};
