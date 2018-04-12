process.env.WATCH_MODE = 'true';
process.env.NODE_ENV = 'development';
process.env.REACT_APP_DEV_MODE = 'node-server';

// Generate the right build ID
// process.env.REACT_APP_BUILD_ID = '.test';

var child = require('child_process');

var cssBuild = child.fork('scripts/builds/build.css.js');
var serverBuild = child.fork('scripts/builds/build.server.js');
var desktopBuild = child.fork('scripts/builds/build.desktop.js');
var mobileBuild = child.fork('scripts/builds/build.mobile.js');

// serverBuild.on('message', (m) => {
//   var nodemon = require('nodemon')({
//     script: 'dist/server/server.js'
//   });

//   nodemon.on('start', function () {
//     console.log(`Node Monitoring has started`);
//   }).on('quit', function () {
//     cssBuild.kill('SIGINT');
//     serverBuild.kill('SIGINT');
//     desktopBuild.kill('SIGINT');
//     mobileBuild.kill('SIGINT');
//     console.log('Node Monitoring has stopped');
//     process.exit();
//   }).on('restart', function (files) {
//     console.log('App restarted due to: ', files);
//   });
// });
