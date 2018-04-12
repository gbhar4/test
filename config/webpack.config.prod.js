/* @author  -  Michael Citro
 *
 * @summary -  This is the webpack configuration for our production build. This config allows us to build for
 *             our mobile site, desktop site, legacy, and server, individually or all together by passing
 *             a buildType param when running the build.js script
 *
 * @example -  node scripts/build.mobile.js
 * @example -  node scripts/build.desktop.js
 * @example -  node scripts/build.css.js
 */
'use strict';

const path = require('path');
const webpack = require('webpack');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const paths = require('./paths');
const getClientEnvironment = require('./env');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const sassAssetFunctions = require('node-sass-asset-functions');
const buildTypeConfigOptions = require('./buildTypeConfigOptions.js');

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = paths.servedPath;

// Get environment variables to inject into our app.
const env = getClientEnvironment(publicPath.slice(0, -1));

// Assert this just to be safe.
// Development builds of React are slow and not intended for production.
/*
  if (env.stringified['process.env'].NODE_ENV !== '"production"') {
   throw new Error('Production builds must have NODE_ENV=production.');
  }
*/

const getProductionConfigByBuildType = (buildType) => ({
  // Don't attempt to continue if there are any errors.
  bail: true,
  target: buildTypeConfigOptions[buildType].target,
  // We generate sourcemaps in production. This is slow but gives good results.
  // You can exclude the *.map files from the build during deployment.
  // https://webpack.js.org/configuration/devtool/
  devtool: buildTypeConfigOptions[buildType].sourcemap,
  // In production, we only want to load the polyfills and the app code.
  entry: buildTypeConfigOptions[buildType].entry,

  output: Object.assign({
    // The build folder.
    path: paths.appBuild,
    // Generated JS file names (with nested folders).
    // There will be one main bundle, and one file per asynchronous chunk.
    // We don't currently advertise code splitting but Webpack supports it.
    // We inferred the "public path" (such as / or /my-project) from homepage.
    publicPath: publicPath,
    // Point sourcemap entries to original disk location
    devtoolModuleFilenameTemplate: (info) => path.relative(paths.appSrc, info.absoluteResourcePath)
  }, buildTypeConfigOptions[buildType].output),

  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We placed these paths second because we want `node_modules` to "win"
    // if there are any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    modules: ['node_modules', paths.appNodeModules].concat(
      // It is guaranteed to exist because we tweak it in `env.js`
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebookincubator/create-react-app/issues/290
    extensions: ['.js', '.json', '.jsx', '.scss', '.html'],
    alias: {

      // Support React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      'react-native': 'react-native-web'
    },
    plugins: [
      // Prevents users from importing files from outside of src/ (or node_modules/).
      // This often causes confusion because we only process files within src/ with babel.
      // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
      // please link the files into your node_modules/ and let module-resolution kick in.
      // Make sure your source files are compiled, as they will not be processed in any way.
      new ModuleScopePlugin(paths.appSrc)
    ]
  },
  module: {
    strictExportPresence: true,
    rules: [
      { test: /\.html$/, loader: 'html-loader' },
      // TODO: Disable require.ensure as it's not a standard language feature.
      // We are waiting for https://github.com/facebookincubator/create-react-app/issues/2176.
      // { parser: { requireEnsure: false } },

      // First, run the linter.
      // It's important to do this before Babel processes the JS.
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: eslintFormatter
            },
            loader: require.resolve('eslint-loader')
          }
        ],
        include: paths.appSrc
      },
      // "url" loader works just like "file" loader but it also embeds
      // assets smaller than specified size as data URLs to avoid requests.
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'client/images/[name].[ext]'
        }
      },
      // "url" loader works just like "file" loader but it also embeds
      // assets smaller than specified size as data URLs to avoid requests.
      {
        test: [/\.eot$/, /\.svg$/, /\.ttf$/, /\.woff$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'client/fonts/[name].[ext]'
        }
      },
      // Process JS with Babel.
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        loaders: [
          'babel-loader?presets[]=env,presets[]=stage-2,presets[]=react',
          `ifdef-loader?${require('querystring').encode({json: JSON.stringify({
            STATIC: false,
            STATIC2: false,
            LEGACY: false,
            'ifdef-verbose': false,
            'ifdef-triple-slash': false
          })})}`]
      },
      // The notation here is somewhat confusing.
      // "postcss" loader applies autoprefixer to our CSS.
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader normally turns CSS into JS modules injecting <style>,
      // but unlike in development configuration, we do something different.
      // `ExtractTextPlugin` first applies the "postcss" and "css" loaders
      // (second argument), then grabs the result CSS and puts it into a
      // separate file in our build process. This way we actually ship
      // a single CSS file in production instead of JS code injecting <style>
      // tags. If you use code splitting, however, any async bundles will still
      // use the "style" loader inside the async code so CSS from them won't be
      // in the main CSS file.
      buildType === 'server'
      ? { test: /\.scss$/, loader: 'ignore-loader' }
      : {
        test: /\.scss$/,
        use: buildTypeConfigOptions[buildType].cssFile.extract({
          use: [{
            loader: 'css-loader'
          }, {
            loader: 'sass-loader',
            options: {
              includePaths: ['node_modules/compass-mixins/lib', 'src/views/scss'],
              functions: sassAssetFunctions({
                images_path: '/wcsstore/static/images',
                fonts_path: '/wcsstore/static/fonts',
                http_images_path: '/wcsstore/static/images',
                http_fonts_path: '/wcsstore/static/fonts'
              }),
              fonts_dir: 'fonts',
              images_dir: 'images'
            }
          }],
            // use style-loader in development
          fallback: 'style-loader'
        })
      }
      // ** STOP ** Are you adding a new loader?
      // Remember to add the new extension(s) to the 'file' loader exclusion list.
    ]
  },
  plugins: [
    process.env.BUILD_TYPE === 'server'
      ? new webpack.DefinePlugin({ 'global.GENTLY': false })
      : new ProgressBarPlugin({ clear: false }),

    new webpack.DefinePlugin({
      DESKTOP: buildType === 'desktop',
      LOCAL_SERVE: false
    }),
    new webpack.DefinePlugin(env.stringified),

    // Minify the code.
    process.env.WATCH_MODE !== 'true'
    ? new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        // Disabled because of an issue with Uglify breaking seemingly valid code:
        // https://github.com/facebookincubator/create-react-app/issues/2376
        // Pending further investigation:
        // https://github.com/mishoo/UglifyJS2/issues/2011
        comparisons: false
      },
      output: {
        comments: false
      },
      sourceMap: true
    })
    : new ProgressBarPlugin({ clear: false }),

    // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
    buildTypeConfigOptions[buildType].cssFile
  ],

  node: {
    __dirname: true
  }

});

// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = getProductionConfigByBuildType(process.env.BUILD_TYPE);
