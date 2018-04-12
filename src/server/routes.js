/**
 * @author Agu
 * Router
 */
import {SERVER_PAGES, FANCY_404_PAGE_ID, LEGACY_HEADER_PAGE_ID, LEGACY_FOOTER_PAGE_ID} from './serverPages';
import {getRequestHandlers} from './handlers/requestHandler';
import {PAGES} from 'routing/routes/pages';
import {errorLogger, errorHandlerFallback} from './handlers/errorHandlers.js';
import {ENV_VARS} from './config/envVariables'; // This is not the same Object that will be on our NodeJs Server, This will be Empty initally.

/* This is the entry point for our server bundle, The app from this point on will not have access to node .env variables */
export function route (app, envVariables) {

  /* Intake envVariables from the node server that is initalizing this server-bundle
  *  and replace the local object that the bundle was bundled with. 
  *  Please refer to envVariables.js on why we are needing to do it this way
  */
  for (const key in envVariables) {
    ENV_VARS[key] = envVariables[key];
  }

  for (let pageId of Object.keys(SERVER_PAGES)) {
    let {routingInfo, sections} = SERVER_PAGES[pageId];
    if (routingInfo) {
      app.get(routingInfo.rootPathPattern || routingInfo.pathPattern, getRequestHandlers(pageId));
    }

    if (sections) {
      for (let sectionKey of Object.keys(sections)) {
        app.get(sections[sectionKey].pathPattern, getRequestHandlers(pageId));

        let {subSections} = sections[sectionKey];
        if (subSections) {
          for (let subSectionKey of Object.keys(subSections)) {
            app.get(subSections[subSectionKey].pathPattern, getRequestHandlers(pageId));
          }
        }
      }
    }
  }

  app.get('/:siteId/global/header', getRequestHandlers(LEGACY_HEADER_PAGE_ID));
  app.get('/:siteId/global/footer', getRequestHandlers(LEGACY_FOOTER_PAGE_ID));
  app.post('/:siteId/checkout/review', getRequestHandlers(PAGES.checkout.id));    // to handle PayPal redirect

  // DEVELOPMENT ROUTES
  if (process.env.NODE_ENV === 'development') {
    // Allow Node server to make API calls
    // FIXME: MAKE SURE WEBPACK IS NOT RUNNING IN DEV MODE!!
    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    // This is for local dev only to serve as a proxy to our local assets
    app.get('/wcsstore/static/*', function (req, res) {
      let file = req.url.replace('/wcsstore/static/', 'dist/client/');
      res.sendfile(file, __dirname);
    });
  }

  app.use('/:siteId?', errorLogger, getRequestHandlers(FANCY_404_PAGE_ID), errorHandlerFallback);    // error handler plus fallback for all routes above

  app.use('/:siteId?', getRequestHandlers(FANCY_404_PAGE_ID), errorHandlerFallback);      // redirect any other route to 404 page (of the correct site)
}
