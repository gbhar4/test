/**
 * @author Constantin
 * @author Agu
 * Framework Config
 */
'use strict';
import Express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import {config} from './config/cspPolicy.js';
import {Router} from './server-bundle.js';
import {ENV_VARS} from './config/envVariables';

const app = Express();

// enable gzip compression
app.use(compression());

// middleware to expose HTTP cookies of incoming request to 'req.cookie'
app.use(cookieParser());

// Security headers
app.set('x-powered-by', false);
app.use(helmet.frameguard({action: 'sameorigin'}));
app.use(helmet.hsts({force: true, maxAge: 10886400, includeSubDomains: true, preload: true})); // 90 days
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(helmet.ieNoOpen());
app.use(helmet.contentSecurityPolicy(config));

// behind proxy
app.enable('trust proxy');

// add router
Router.route(app, ENV_VARS);

export {app};
