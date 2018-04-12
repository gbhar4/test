/**
 * @author Constantin
 * @author Agu
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var fs = require('fs');
var path = require('path');

var config = {
  appName: 'dtx-webserve',
  env: process.env.NODE_ENV ? process.env.NODE_ENV : 'dev',
  server: {
    proto: 'https',
    httpPort: 8080,
    httpsPort: 8443,
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

exports.config = config;