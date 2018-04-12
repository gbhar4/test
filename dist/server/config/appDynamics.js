'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.appDynamics = undefined;

var _envVariables = require('./envVariables');

var _appdynamics = require('appdynamics');

var _appdynamics2 = _interopRequireDefault(_appdynamics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var APP_D_NODE_NAME = _envVariables.ENV_VARS.APP_D_NODE_NAME,
    APP_D_APP_NAME = _envVariables.ENV_VARS.APP_D_APP_NAME;


if (APP_D_NODE_NAME && APP_D_APP_NAME) {
  /* Init App Dynamics For This Server */
  _appdynamics2.default.profile({
    controllerHostName: 'childrensplace.saas.appdynamics.com',
    controllerPort: 443,

    // If SSL, be sure to enable the next line
    controllerSslEnabled: true,
    accountName: 'childrensplace',
    accountAccessKey: 'j4m20qg7nbm1',
    applicationName: APP_D_APP_NAME,
    tierName: 'NODEJS_Tier',
    nodeName: APP_D_NODE_NAME,
    proxyAutoLaunchDisabled: true,
    proxyCtrlDir: '/tmp/appd/proxy_ctrl_dir'

  });

  console.log('App Dynamics Re-Initialized on [' + Date().toString() + '] with config variables:');
  console.log('nodeName = ' + APP_D_NODE_NAME);
  console.log('applicationName = ' + APP_D_APP_NAME);
} else {
  console.log('App Dynamics NOT! Initialized [' + Date().toString() + ']');
}

exports.appDynamics = _appdynamics2.default;