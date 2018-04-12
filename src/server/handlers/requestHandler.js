/** @module requestHandler
 * @summary exposes request handler methods to handle server-side page requests
 *
 * @author Ben
 */
import {detectDevice} from '../util/detectDevice.js';
import {renderToString} from 'react-dom/server';
import {SERVER_PAGES, FANCY_404_PAGE_ID} from '../serverPages';
import {countryRedirectHandler} from './redirectHandlers.js';
import {getClearMutableActn} from 'reduxStore/storeReducersAndActions/mutable/mutable';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {get404Info} from '../util/ServerError';

// the names of the variables to use in res.locals for communication between the different middleware methods while serving a request
export const RES_LOCALS_FIELD_NAMES = {
  siteId: 'siteId',                               // the site id (key into routingConstants) --- created by countryRedirectHandler
  language: 'language',                           // the language code for the site (see routingConstants) --- created by countryRedirectHandler
  currency: 'currency',                           // the currency code for the site (see routingConstants) --- created by countryRedirectHandler
  pageId: 'pageId',                               // id of page being served (a key into SERVER_PAGES) --- created by beginHandle
  isMobile: 'isMobile',                           // flags if request came from a mobile device --- created by beginHandle
  store: 'store',                                 // the redux store --- created by page.getStoreMethod, destroyed by the end of getVariablesAndReactRender;
  variables: 'variables'                          // the template variables to be used by page.getHtmlMethod --- created by page.getVariablesMethod
};

export function getRequestHandlers (pageId) {
  let page = SERVER_PAGES[pageId];
  return [countryRedirectHandler, beginHandle.bind(null, pageId), page.getStoreMethod, getVariablesAndReactRender, sendResponse];
}

function beginHandle (pageId, req, res, next) {
  res.locals[RES_LOCALS_FIELD_NAMES.pageId] = pageId;
  res.locals[RES_LOCALS_FIELD_NAMES.isMobile] = detectDevice(req).deviceType === 'mobile';
  // console.log(pageId);
  next();
}

function getVariablesAndReactRender (req, res, next) {
  let {
    [RES_LOCALS_FIELD_NAMES.pageId]: pageId,
    [RES_LOCALS_FIELD_NAMES.isMobile]: isMobile,
    [RES_LOCALS_FIELD_NAMES.store]: store
  } = res.locals;
  let page = SERVER_PAGES[pageId];

  let variablesPromise = page.getVariablesMethod(store, req, pageId);       // we do this before the next line so that both can run in parallel
  let reactHtmlString = renderToString(page.renderMethod(store, pageId));
  variablesPromise.then((variables) => {
    // clear the mutable branch of the store (we do not need it anymore, and it may contain sensitive data)
    let apiKeys = routingInfoStoreView.getApiHelper(store.getState())._configOptions.apiKeys;
    store.dispatch(getClearMutableActn());

    res.locals[RES_LOCALS_FIELD_NAMES.variables] = {
      ...variables,
      apiKeys,
      state: store.getState(),
      isMobile,
      reactHtmlString
    };
    store = null;     // we no longer need this
    next();
  });
}

function sendResponse (req, res, next) {
  let {
    [RES_LOCALS_FIELD_NAMES.pageId]: pageId,
    [RES_LOCALS_FIELD_NAMES.variables]: variables
  } = res.locals;
  let page = SERVER_PAGES[pageId];
  let statusCode = 200;

  /* Note that the pageId is not a 1 to 1 mapping as to what page you are on, this is to know what component to mount.
   * if the server is going to throw a shelled 404 page then the pageId will always be FANCY_404_PAGE_ID but you still do not know what
   * page you are on.
  */
  if (pageId === FANCY_404_PAGE_ID) {
    statusCode = get404Info(req.originalUrl).statusCode;
  }

  res
  .set('X-Content-Type-Options', 'nosniff')
  .set('Cache-Control', statusCode === 200 ? 'max-age=3600' : 'no-cache')
  .status(statusCode)
  .send(page.getHtmlMethod(variables, pageId));
}
