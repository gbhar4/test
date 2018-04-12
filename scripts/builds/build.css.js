/**
 * @author Citro
 * Never run this file directly unless for development. for production builds it should only
 * be engadged from the build.all.js file so it can have a proper timestamp build ID for 
 * production asset versioning
 */

 // Set proper env values then trigger build
process.env.BUILD_TYPE = 'css';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.WATCH_MODE = process.env.WATCH_MODE || 'false';

// on build complete emit message
require('child_process')
  .fork('scripts/engines/build.js')
  .on('message', (message) => {
    process.send && process.send(message);
  });
