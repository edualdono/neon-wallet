const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const paths = require('./paths')

const commonLoaders = {
  cssModules: {
    loader: 'css-loader',
    options: {
      modules: true,
      importLoaders: 1,
    },
  },
}

module.exports = {
  mode: 'production',
  bail: true,
  devtool: false,
  target: 'electron-renderer',
  entry: ['babel-polyfill', path.join(__dirname, '..', 'app/index.js')],
  externals: {
    'node-hid': 'require("node-hid")',
    usb: 'require("usb")',
  },
  output: {
    path: path.join(__dirname, '..', 'app/dist/'),
    filename: 'bundle.js',
    publicPath: '',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: paths.alias,
  },
  node: {
    __dirname: false,
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new UglifyJSPlugin(),
    new HtmlWebpackPlugin({
      template: 'app/index.tpl.html',
      inject: true,
      filename: 'index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
  ],
  module: {
    rules: [
      // Must be added to support syntax used in several of the wallet
      // connect dependencies => https://github.com/WalletConnect/walletconnect-monorepo/issues/1349
      {
        test: /@?(@walletconnect).*\.(ts|js)x?$/,
        loader: 'babel-loader',
        options: {
          presets: [['@babel/preset-env', { targets: 'defaults' }]],
        },
      },
      {
        test: /(@cityofzion\/blockchain-service|@cityofzion\/bs-neo3\/node_modules).*\.(ts|js)x?$/,
        loader: 'babel-loader',
        options: {
          presets: [['@babel/preset-env', { targets: 'defaults' }]],
        },
      },
      {
        test: /(@cityofzion\/neon-invoker).*\.(ts|js)x?$/,
        loader: 'babel-loader',
        options: {
          presets: [['@babel/preset-env', { targets: 'defaults' }]],
        },
      },
      {
        test: /(@cityofzion\/neon-parser).*\.(ts|js)x?$/,
        loader: 'babel-loader',
        options: {
          presets: [['@babel/preset-env', { targets: 'defaults' }]],
        },
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            compact: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.global\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /^((?!\.global).)*\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          commonLoaders.cssModules,
        ],
      },
      {
        test: /\.global\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'resolve-url-loader',
          'sass-loader',
        ],
      },
      {
        test: /^((?!\.global).)*\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          commonLoaders.cssModules,
          'resolve-url-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: {
          loader: 'url-loader',
        },
      },
      {
        // Match woff2 in addition to patterns like .woff?v=1.1.1.
        test: /\.(woff|woff2|ttf)(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 50000,
            mimetype: 'application/font-woff',
            name: './fonts/[name].[ext]',
          },
        },
      },
      {
        test: /\.svg$/,
        use: ['svg-react-loader'],
        exclude: [
          /node_modules/,
          path.resolve(__dirname, '../app/assets/nep5/svg'),
        ],
      },
      {
        test: /\.(svg)$/,
        use: {
          loader: 'url-loader',
        },
        include: [path.resolve(__dirname, '../app/assets/nep5/svg')],
      },
      {
        test: /\.(wav)(\?[a-z0-9#=&.]+)?$/,
        use: {
          loader: 'url-loader',
        },
      },
      { test: /\.mjs$/, include: /node_modules/, type: 'javascript/auto' },
    ],
  },
  performance: {
    hints: false,
  },
}
