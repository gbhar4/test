/**
 * @author Citro
 * This is the script to run for a proper production build. It will set the build ID and attached
 * as a file extension as well as inject it into the app to pull in the right version.
 */

// Generate the right build ID
// process.env.REACT_APP_BUILD_ID = ''; // '.' + (new Date()).valueOf().toString();

var child = require('child_process');

// Run all builds in child threads
child.fork('scripts/builds/build.css.js');
child.fork('scripts/builds/build.server.js');
child.fork('scripts/builds/build.desktop.js');
child.fork('scripts/builds/build.mobile.js');
