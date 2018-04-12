/**
 * @author Citro
 * Run this to have all builds output full file on changes. VERY helpfull when you are proxying a file for debugging
 */


process.env.NODE_ENV = 'development';
process.env.WATCH_MODE = 'true';
process.env.REACT_APP_DEV_MODE = 'non-static';

var child = require('child_process');

child.fork('scripts/builds/build.css.js');
child.fork('scripts/builds/build.server.js');
child.fork('scripts/builds/build.desktop.js');
child.fork('scripts/builds/build.mobile.js');
