/**
 * @author Constantin
 * @author Agu
 */
'use strict';

const fs = require('fs');
const path = require('path');

const config = {
  appName: 'dtx-webserve',
  env: process.env.NODE_ENV ? process.env.NODE_ENV : 'dev',
  server: {
    proto: 'http',
    httpPort: 8080,
    httpsPort: 32480,
    httpsCerts: {
      key: fs.readFileSync(path.join(__dirname, 'tls-private.key'), 'ascii'),
      cert: fs.readFileSync(path.join(__dirname, 'tls-server.crt'), 'ascii')
    }
  },
  appdynamics: {
    controllerHostName: 'http://njiplappdyn.tcphq.tcpcorp.local.com',
    controllerPort: 8090,
    controllerSslEnabled: false,
    accountName: '465',
    accountAccessKey: 'xxxxxxxxxx',
    applicationName: 'dtx-webserver',
    tierName: 'dtx-webserver-cluster',
    nodeName: 'node'
  }
};

export {config};
