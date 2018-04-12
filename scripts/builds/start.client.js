/**
 * @author Citro
 * Run this for local webpack server with live APIs that hit our backend server
 */

process.env.HTTPS = 'false';
process.env.REACT_APP_DEV_MODE = 'non-static';
process.env.NODE_ENV = 'development';
process.env.WATCH_MODE = 'true';
process.env.PORT = process.env.PORT || 9000;

// Build External CSS
require('child_process').fork('scripts/builds/build.css.js');

// Build Mobile CSS
require('child_process').fork('scripts/builds/build.mobile.js');

// Run Dev Server
require('child_process').fork('scripts/engines/start.js');
