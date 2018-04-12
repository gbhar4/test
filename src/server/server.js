/**
 * @author Constantin
 * @author Agu
 */
'use strict';

// Import this for the sake of initalizing .env File and appDynamics
import {appDynamics} from './config/appDynamics'; // eslint-disable-line
import {app} from './express.js';
import https from 'https';
import {config} from './config/node.js';

let httpsPort = config.server.httpsPort;
let httpsCerts = config.server.httpsCerts;

/* Start Node Server On HTTPS Port */
https.createServer(httpsCerts, app).listen(process.env.PORT || httpsPort, () => {
  console.log('HTTPS app started: Listening to port: ' + httpsPort);
});

/* Handle Node Server Error */
app.on('error', (error) => {
  if (error.syscall !== 'listen') {
    console.error(`\nERROR: ${error}`);
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      console.error(`\nERROR: Port ${httpsPort} requires elevated privileges`);
      process.exit(1);
    case 'EADDRINUSE':
      console.error(`\nERROR: Port ${httpsPort} is already in use`);
      process.exit(1);
    default:
      console.error(`\nERROR: ${error}`);
      throw error;
  }
});

/* kill node process on application shut-down */
process.on('SIGINT', () => {
  console.info('\nGracefully shutting down from SIGINT (Ctrl-C)');
  process.exit();
});

/* render exceptions thrown in non-promies code */
process.on('uncaughtException', function (error) {
  console.error(`\nERROR: Uncaught Exception`);
  console.log(error);
});

/* render unhandled rejections */
process.on('unhandledRejection', function (error) {
  console.error(`\nERROR: Unhandled Rejection - ${error}`);
  console.log(error);
});
