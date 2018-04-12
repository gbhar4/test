import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {routingInfoStoreView} from './routingInfoStoreView';
import {LOCATION_CREATE_METHODS_TABLE} from 'routing/routes/locationCreateMethods';

export const routingStoreView = {
  getCurrentPageId,
  isLinkToCurrentPage,
  isLinkAlreadyLoaded,
  getLocationFromPageInfo,
  getFullUrlForLocation,
  getRedirectBase,
  getPaypalErrorMessage
  // getAssetUrl
};

const ERRORS_MAP = require('service/WebAPIServiceAbstractors/errorMapping.json');

function getCurrentPageId (state) {
  return state.general.routing.currentPage;
}

function getPaypalErrorMessage (state) {
  let routingError = state.general.routing.errorCode;

  // REVIEW: do we want to flag types of errors differently? or preffix on error codes would do?
  if (routingError && routingError.substr(0, 6) === 'PAYPAL') {
    // || intentional so that we see we're missing an errorCode in errorMapping
    return ERRORS_MAP[routingError] ? ERRORS_MAP[routingError].errorMessage : routingError;
  } else {
    return null;
  }
}

/*
 * for use with the non-legacy pages only.
 * Note: do not confuse 'state' inside extraInfo with the redux store state that is the first parameter to this method.
 * The parameter siteId is optional, and defaults to the current one
 */
function getLocationFromPageInfo (state, destinationInfo, redirectBase = getRedirectBase(state)) {
  let {page, section, pathSuffix, ...extraInfo} = destinationInfo;
  let sectionPathPart = (section && section.pathPart) || '';
  if (sectionPathPart && pathSuffix) {
    sectionPathPart = sectionPathPart + '/' + pathSuffix;
  } else if (pathSuffix) {
    sectionPathPart = pathSuffix;
  }
  return LOCATION_CREATE_METHODS_TABLE[page.locationCreateMethodKey](state, redirectBase, page.pathPart, sectionPathPart, extraInfo);
}

function isLinkToCurrentPage (state, page) {
  return getCurrentPageId(state) === page.id;
}

function isLinkAlreadyLoaded (state, page) {
  return getCurrentPageId(state) === page.id && page.locallyServeNested;
}

function getFullUrlForLocation (state, location) {
  let {pathname, search, hash} = location;
  return routingInfoStoreView.getApiHelper(state).configOptions.assetHost + pathname + (search ? '?' + search : '') + (hash ? '#' + hash : '');
}

// function getAssetUrl (path) {
//   return routingInfoStoreView.getApiHelper(this.store.getState()).configOptions.assetHost + path;
// }

function getRedirectBase (state, siteId = sitesAndCountriesStoreView.getCurrentSiteId(state)) {
  // #if !STATIC2
  return '/' + siteId;
  // #endif

  // #if STATIC2
  return '/' + (routingInfoStoreView.getIsMobile(state) ? 'm.react.html' : 'd.react.html');   // eslint-disable-line no-unreachable
  // #endif
}
