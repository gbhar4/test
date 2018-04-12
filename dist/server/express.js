/**
 * @author Constantin
 * @author Agu
 * Framework Config
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.app = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _cspPolicy = require('./config/cspPolicy.js');

var _serverBundle = require('./server-bundle.js');

var _envVariables = require('./config/envVariables');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

// enable gzip compression
app.use((0, _compression2.default)());

// middleware to expose HTTP cookies of incoming request to 'req.cookie'
app.use((0, _cookieParser2.default)());

// Security headers
app.set('x-powered-by', false);
app.use(_helmet2.default.frameguard({ action: 'sameorigin' }));
app.use(_helmet2.default.hsts({ force: true, maxAge: 10886400, includeSubDomains: true, preload: true })); // 90 days
app.use(_helmet2.default.noSniff());
app.use(_helmet2.default.xssFilter());
app.use(_helmet2.default.ieNoOpen());
app.use(_helmet2.default.contentSecurityPolicy(_cspPolicy.config));

// behind proxy
app.enable('trust proxy');

// add router
_serverBundle.Router.route(app, _envVariables.ENV_VARS);

exports.app = app;