/**
 * @author Citro
 */

 // Set proper env values then trigger build
process.env.BUILD_TYPE = 'server';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.WATCH_MODE = process.env.WATCH_MODE || 'false';

// on build complete emit message
require('child_process')
  .fork('scripts/engines/build.js')
  .on('message', (message) => {
    process.send && process.send(message);
  });
