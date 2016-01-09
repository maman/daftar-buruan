import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { StatsWriterPlugin } from 'webpack-stats-plugin';

const staticDir = path.join(__dirname, 'static');
const env = process.env.NODE_ENV || 'development';
const misc = {
  cache: true,
  devtool: 'source-map',
  debug: (env === 'development') ? true : false
};

let config = {};

/** Application entrypoint */
config.entry = {
  main: path.join(staticDir, 'src/js/app.js')
};

/** Application modules */
config.module = {
  loaders: [{
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel'
  }, {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract(
      'style',
      'css?sourceMap',
      'autoprefixer'
    )
  }]
};

/** Application plugins */
config.plugins = [
  // new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.[hash].js'),
  new webpack.DefinePlugin({
    DEBUG: (env === 'development') ? true : false
  }),
  new StatsWriterPlugin({
    filename: 'output.json'
  }),
  new ExtractTextPlugin('style.[hash].css')
];

/** Optional development - production plugin */
if (env === 'development') {
  config.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    ...config.plugins
  ];
} else {
  config.plugins = [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true,
      mangle: true,
      preserveComments: false,
      output: {
        comments: false
      }
    }),
    new webpack.BannerPlugin(banner, {
      raw: false,
      entryOnly: true
    }),
    ...config.plugins
  ];
}

/** Output */
config.output = {
  filename: 'main.[hash].js',
  path: staticDir
};

let finalConfig = Object.assign(config, misc);

export default finalConfig;
