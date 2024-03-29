'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_PATH = process.env.NODE_PATH || './src';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 3000;
process.env.HOST = process.env.HOST || 'pctcloud.azurewebsites.net';
process.env.HTTPS = 'false';
process.env.REACT_APP_DEV_MODE = process.env.REACT_APP_DEV_MODE || '';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

// Ensure environment variables are read.
require('../../config/env');

const fs = require('fs-extra');
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const clearConsole = require('react-dev-utils/clearConsole');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls
} = require('react-dev-utils/WebpackDevServerUtils');
// const openBrowser = require('react-dev-utils/openBrowser');
const paths = require('../../config/paths');
const config = require('../../config/webpack.config.dev');
const createDevServerConfig = require('../../config/webpackDevServer.config');

const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';

// We attempt to use the default port but if it is busy, we offer the user to
// run on a different port. `detect()` Promise resolves to the next free port.
choosePort(HOST, DEFAULT_PORT)
  .then((port) => {
    if (port == null) {
      // We have not found a port.
      return;
    }
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const appName = require(paths.appPackageJson).name;
    const urls = prepareUrls(protocol, HOST, port);
    // Create a webpack compiler that is configured with custom messages.
    const compiler = createCompiler(webpack, config, appName, urls);
    // Load proxy config
    const proxySetting = require(paths.appPackageJson).proxy;
    const proxyConfig = prepareProxy(proxySetting, paths.appPublic);
    // Serve webpack assets generated by the compiler over a web sever.
    const serverConfig = createDevServerConfig(
      proxyConfig,
      urls.lanUrlForConfig
    );
    const devServer = new WebpackDevServer(compiler, serverConfig);
    // Launch WebpackDevServer.
    devServer.listen(process.env.PORT || port, HOST, (err) => {
      if (err) {
        return console.log(err);
      }
      if (isInteractive) {
        clearConsole();
      }
      console.log(chalk.cyan('Starting the development server...\n'));
      moveFonts();
      // openBrowser(urls.localUrlForBrowser);
    });

    ['SIGINT', 'SIGTERM'].forEach(function (sig) {
      process.on(sig, function () {
        devServer.close();
        moveFonts(true);
        process.exit();
      });
    });
  })
  .catch((err) => {
    moveFonts(true);
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });

function moveFonts (remove) {
  if (remove) {
    fs.emptyDirSync(paths.appBuild + '/wcsstore');
  } else {
    fs.copySync(paths.appFonts.src, paths.appBuild + '/wcsstore/static/fonts');
  }
}
