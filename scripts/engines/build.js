/* @author  -  Michael Citro
 *
 * @summary -  This is the webpack configuration for our production build. This config allows us to build for
 *             our mobile site, desktop site, legacy, and server, individually or all together by passing
 *             a buildType param when running the build.js script
 *
 * @example -  node scripts/build.js
 * @example -  BUILD_TYPE=mobile node scripts/build.js
 * @example -  BUILD_TYPE=server node scripts/build.js
 * @example -  WATCH_MODE=true BUILD_TYPE=development node scripts/build.js
 */
'use strict';
// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_PATH = process.env.NODE_PATH || './src';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.BUILD_TYPE = process.env.BUILD_TYPE || 'desktop';
process.env.WATCH_MODE = process.env.WATCH_MODE || 'false';
process.env.REACT_APP_BUILD_ID = process.env.REACT_APP_BUILD_ID || '';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

// Ensure environment variables are read.
require('../../config/env');

const chalk = require('chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const config = require('../../config/webpack.config.prod');
const paths = require('../../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

console.log(chalk.green(`Build started for ${process.env.NODE_ENV} ${process.env.BUILD_TYPE} WATCH_MODE=${process.env.WATCH_MODE}\n`));

preBundle();

// First, read the current file sizes in build directory.
// This lets us display how much they changed later.
build()
  .then(({ stats, warnings }) => {
    postBundle();
    if (warnings.length) {
      // printWarnings(warnings);
    } else {
      console.log(chalk.green('Compiled successfully.\n'));
    }
  },
    (err) => {
      console.log(chalk.red('Failed to compile.\n'));
      console.log((err.message || err) + '\n');
      process.exit(1);
    }
  );

// Create the production build and print the deployment instructions.
function build () {

  let compiler = webpack(config);

  return new Promise((resolve, reject) => {
    // We can run this in watch mode if we pass that arg in the command line.
    if (process.env.WATCH_MODE === 'true') {
      compiler.watch({}, bundleCallback.bind(this, resolve, reject));
    } else {
      compiler.run(bundleCallback.bind(this, resolve, reject));
    }
  });
}

function preBundle () {
  // Copy index.html over for dev builds
  if (process.env.NODE_ENV === 'development') {
    fs.copySync(paths.appHtml, paths.appBuild + '/index.html');
  }

  /* FIXME: I only check desktop becsue when we run mobile and desktop in paraalless both will conflict in this section
  * but we never really run just a mobile build we generally to all builds
  */
  if (process.env.BUILD_TYPE === 'desktop') {
    fs.copySync(paths.appFonts.src, paths.appFonts.des);
    fs.copySync(paths.appImgs.src, paths.appImgs.des);
  } else if (process.env.BUILD_TYPE === 'server' || process.env.BUILD_TYPE === 'all') {
    var babel = require('babel-core');

    // Copy over package Json and server configs to server build location
    fs.copySync(paths.serverConfigs.src, paths.serverConfigs.des);
    fs.copySync(paths.appPackageJson, paths.serverBuild + '/package.json');

    // (WIP) FIXME: Create a helper function to do this on all js files in a given direcotry
    // transcode server files
    var serverJS = babel.transformFileSync(paths.appSrc + '/server/server.js').code;
    var expressJS = babel.transformFileSync(paths.appSrc + '/server/express.js').code;
    var routesJS = babel.transformFileSync(paths.appSrc + '/server/routes.js').code;
    var cspPoliciesJS = babel.transformFileSync(paths.appSrc + '/server/config/cspPolicy.js').code;
    var appDynamics = babel.transformFileSync(paths.appSrc + '/server/config/appDynamics.js').code;
    var nodeJs = babel.transformFileSync(paths.appSrc + '/server/config/node.js').code;
    var envVariables = babel.transformFileSync(paths.appSrc + '/server/config/envVariables.js').code;

    // output transcoded server files to server build location.
    fs.outputFileSync(paths.serverConfigs.des + '/cspPolicy.js', cspPoliciesJS);
    fs.outputFileSync(paths.serverConfigs.des + '/appDynamics.js', appDynamics);
    fs.outputFileSync(paths.serverConfigs.des + '/node.js', nodeJs);
    fs.outputFileSync(paths.serverConfigs.des + '/envVariables.js', envVariables);
    fs.outputFileSync(paths.serverBuild + '/server.js', serverJS);
    fs.outputFileSync(paths.serverBuild + '/express.js', expressJS);
    fs.outputFileSync(paths.serverBuild + '/routes.js', routesJS);

  }
}

function postBundle () {
  if (process.env.NODE_ENV === 'production') {
    fs.remove(paths.appBuild + '/client/css/*.js');
    fs.remove(paths.appBuild + '/client/css/*.map');
  }

  process.send && process.send({BUILD_TYPE: process.env.BUILD_TYPE});
}

function printWarnings (warnings) {
  console.log(chalk.yellow('Compiled with warnings.\n'));
  console.log(warnings.join('\n\n'));
  console.log('\nSearch for the ' + chalk.underline(chalk.yellow('keywords')) + ' to learn more about each warning.');
  console.log('To ignore, add ' + chalk.cyan('// eslint-disable-next-line') + ' to the line before.\n');
}

function bundleCallback (resolve, reject, err, stats) {
  if (err) {
    return reject(err);
  }
  const messages = formatWebpackMessages(stats.toJson({}, true));
  if (messages.errors.length) {
    return reject(new Error(messages.errors.join('\n\n')));
  }
  if (process.env.CI && messages.warnings.length) {
    console.log(
      chalk.yellow(
        '\nTreating warnings as errors because process.env.CI = true.\n' +
          'Most CI servers set it automatically.\n'
      )
    );
    return reject(new Error(messages.warnings.join('\n\n')));
  }
  return resolve({
    stats,
    warnings: messages.warnings
  });
}
