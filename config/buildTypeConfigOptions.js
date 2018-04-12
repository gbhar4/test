const ExtractTextPlugin = require('extract-text-webpack-plugin');
const chalk = require('chalk');
const paths = require('./paths');

// Array of supported build configurations
const SUPPORTED_BUILD_TYPES = {
  MOBILE: 'mobile',
  DESKTOP: 'desktop',
  SERVER: 'server',
  CSS: 'css'
};

// A list of all the entry points and output configs for each build type
const buildTypeConfigOptions = {
  [SUPPORTED_BUILD_TYPES.MOBILE]: {
    target: 'web',
    sourcemap: 'source-map',
    entry: {
      'app': [require.resolve('./polyfills'), paths.appIndexJs]
    },
    output: {
      filename: `client/js/[name].js`,
      chunkFilename: 'client/js/[name].chunk.js'
    },
    cssFile: new ExtractTextPlugin({ filename: `client/css/m-page-checkout.min.css` })
  },
  [SUPPORTED_BUILD_TYPES.DESKTOP]: {
    target: 'web',
    sourcemap: 'source-map',
    entry: {
      'app': [require.resolve('./polyfills'), paths.appIndexJs]
    },
    output: {
      filename: `client/js/[name].js`,
      chunkFilename: 'client/js/[name].chunk.js'
    },
    cssFile: new ExtractTextPlugin({ filename: `client/css/d-page-checkout.min.css` })
  },
  [SUPPORTED_BUILD_TYPES.SERVER]: {
    target: 'node',
    sourcemap: 'eval',
    entry: {
      'server': [paths.serverIndexJs]
    },
    output: {
      filename: 'server/[name]-bundle.js',
      chunkFilename: 'server/[name]-bundle.chunk.js',
      libraryTarget: 'commonjs',
      library: 'Router'
    },
    cssFile: new ExtractTextPlugin({ filename: 'client/css/server.min.css' })
  },
  [SUPPORTED_BUILD_TYPES.CSS]: {
    target: 'web',
    sourcemap: 'eval',
    entry: {
      'base-styles': paths.appGlobalCSSEntry,
      'page-guidelines': paths.appGuidelinesCSSEntry,
      'page-readiness': paths.appreadinessCSSEntry
    },
    output: {
      filename: `client/css/[name].min.js`,
      chunkFilename: 'client/css/[name].chunk.min.js'
    },
    cssFile: new ExtractTextPlugin({ filename: `client/css/[name].min.css` })
  }
};

// Assert this just to be safe.
// We can not build for a none supported build type.
if (!buildTypeConfigOptions[process.env.BUILD_TYPE]) {
  console.log(chalk.red('Please provide a supported BUILD_TYPE arg in the command line like'));
  process.exit(0);
}

module.exports = buildTypeConfigOptions;
