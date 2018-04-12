/**
 * @author Citro
 * Run this for local webpack server with mock APIs that return a local json object.
 */

process.env.HTTPS = 'false';
process.env.REACT_APP_DEV_MODE = 'static';
process.env.NODE_ENV = 'development';
process.env.WATCH_MODE = 'true';
process.env.PORT = 9090;

// Build External CSS
require('child_process').fork('scripts/builds/build.css.js');

// Build Mobile CSS
require('child_process').fork('scripts/builds/build.mobile.js');

// Run Dev Server (builds Desktop CSS by Default)
require('child_process').fork('scripts/engines/start.js');
