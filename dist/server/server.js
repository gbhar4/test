/**
 * @author Constantin
 * @author Agu
 */
'use strict';

// Import this for the sake of initalizing .env File and appDynamics

var _appDynamics = require('./config/appDynamics');

var _express = require('./express.js');

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _node = require('./config/node.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var httpsPort = _node.config.server.httpsPort; // eslint-disable-line

var httpsCerts = _node.config.server.httpsCerts;

/* Start Node Server On HTTPS Port */
_https2.default.createServer(httpsCerts, _express.app).listen(process.env.PORT || httpsPort, function () {
  console.log('HTTPS app started: Listening to port: ' + httpsPort);
});

/* Handle Node Server Error */
_express.app.on('error', function (error) {
  if (error.syscall !== 'listen') {
    console.error('\nERROR: ' + error);
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      console.error('\nERROR: Port ' + httpsPort + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      console.error('\nERROR: Port ' + httpsPort + ' is already in use');
      process.exit(1);
    default:
      console.error('\nERROR: ' + error);
      throw error;
  }
});

/* kill node process on application shut-down */
process.on('SIGINT', function () {
  console.info('\nGracefully shutting down from SIGINT (Ctrl-C)');
  process.exit();
});

/* render exceptions thrown in non-promies code */
process.on('uncaughtException', function (error) {
  console.error('\nERROR: Uncaught Exception');
  console.log(error);
});

/* render unhandled rejections */
process.on('unhandledRejection', function (error) {
  console.error('\nERROR: Unhandled Rejection - ' + error);
  console.log(error);
});