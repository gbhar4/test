
/** WARRING!!
 *    NEVER USE THIS IN CLIENT SIDE CODE, THIS SHOULD ONLY EVER BE USED ON SERVER SIDE CODE/ SERVER-BUNDLE.
 *    A REACT.JS COMPONENT OR FILE USED BY IT SHOULD NEVER IMPORT THIS FILE!
 *  WARRING!!
 * @author Michael Citro
 * @summary We should only be using these env variables within our application. We should never access proccess.env directly.
 *          We set the .env varaibles withing our .env file and get them from here. This is a bridge for our NodeJs to our server-bundle.
 *          On a request these will be stored in the user's redux store. This is NOT the place for sensative config options, only options that
 *          we want to be avalable to us on the NODEjs side as well as the Client side.
 */
import dotenv from 'dotenv';

// NOTE: In production all servers have this folder were our infra team stores the .env file
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: './.env.development.local' });
  dotenv.load();
}
else {
  // NOTE: In production all servers have this folder were our infra team stores the .env file
  dotenv.config({ path: '../../../../data02/.env' });
}
/* Do not make const, this will be overwriten in the server-bundle.js when NodeJs starts up.
 * During build time these values will not be avalaible due to build server not having .env file.
 * We are build on local Jenkins not our remote NodeServers.
*/
export let ENV_VARS = {
  JS_HOST_DOMAIN: process.env.JS_HOST_DOMAIN || '',
  CSS_HOST_DOMAIN: process.env.CSS_HOST_DOMAIN || '',
  IMG_HOST_DOMAIN: process.env.IMG_HOST_DOMAIN || 'https://www.childrensplace.com',
  APP_D_NODE_NAME: process.env.APP_D_NODE_NAME || '',
  APP_D_APP_NAME: process.env.APP_D_APP_NAME || ''
};
