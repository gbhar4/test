/** @module locationCreateMethods
 * @summary methods for creating Location objects (see reactr-router Location) for non-legacy pages.
 *
 * Mothods in this file are referred to by entries in the PAGES object in './pages.js'
 *
 * @author Ben
 */
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {PAGES} from 'routing/routes/pages.js';

export const LOCATION_CREATE_METHODS_TABLE = {
  defaultMethod: defaultCreator,
  checkoutLocationCreator: checkoutLocationCreator,
  defaultCreatorWithShop: defaultCreatorWithShop
};

/**
 * concatenates pagePathPart and sectionPathPart (with a slash in between) to create the path,
 * puts all queryValues as query parameters, then slaps on the hash.
 * @param  {object} storeState      The state of the redux store.
 * @param  {string} pathBase        The prefix of the path part of the url (e.g. '/us' or '/ca').
 * @param  {string} pagePathPart    The part of the path corresponding to the page (to follow the pathBase). E.g. 'bag'.
 *                                    Observe that a leading slash should not be used (it is inserted automatically).
 *                                    An ending slash is optional (and meaningful only if no sectionPathPart is used).
 * @param  {string} sectionPathPart (optional) The part of the path corresponding to the section (to follow the pagePathPart). E.g. 'bag'.
 *                                    Observe that a leading slash should not be used (it is inserted automatically).
 *                                    An ending slash is optional, and will have the obvious effect.
 * @param  {object} extraInfo       (optional) A simple object specifying the parts of the returned location that are not in the path.
 *                                    Has the following (optional) fields:
 *                                      queryValues: a simple object of key-value pairs that will be used to create the urtl's query string (in the natural way).
 *                                      hash: the hash portion of the location
 *                                      state: the state portion of the location.
 * @return {Object}                 The resulting Location.
 */
function defaultCreator (storeState, pathBase, pagePathPart, sectionPathPart, extraInfo) {
  let {queryValues, hash, state} = extraInfo;
  return {
    pathname: pathBase + '/' + pagePathPart + (!pagePathPart.endsWith('/') && sectionPathPart ? '/' : '') + (sectionPathPart || ''),
    search: getQueryString(queryValues),
    hash: hash,
    state: state
  };
}

/** Same as <code>defaultCreator</code> buyt adds '/shop' to the beginning of the path (before </code>pathBase</code>) */
function defaultCreatorWithShop (storeState, pathBase, pagePathPart, sectionPathPart, extraInfo) {
  return defaultCreator(storeState, '/shop' + (pathBase || ''), pagePathPart, sectionPathPart, extraInfo);
}

/**
 * Uses <code>defaultCreator</code> if the current country is US or CA; otherwise creates a location describing
 * a url for the 'Borders Free' third-party service.
 */
function checkoutLocationCreator (storeState, pathBase, pagePathPart, sectionPathPart, extraInfo) {
  let country = sitesAndCountriesStoreView.getCurrentCountry(storeState);

  if (country === 'US' || country === 'CA') {
    return defaultCreator(storeState, pathBase, PAGES.checkout.pathPart, sectionPathPart, extraInfo);
  } else {
    return defaultCreator(storeState, pathBase, PAGES.intlCheckout.pathPart, sectionPathPart, extraInfo);
  }
}

/**
 * Returns a url's queryString from an object of key value-pairs.
 */
function getQueryString (keyValuePairs = {}) {
  let params = [];
  for (let key of Object.keys(keyValuePairs)) {
    if (keyValuePairs[key] === null) {
      params.push(encodeURIComponent(key));
    } else {
      if (Array.isArray(keyValuePairs[key])) {
        for (let value of keyValuePairs[key]) {
          params.push([encodeURIComponent(key), '[]=', encodeURIComponent(value)].join(''));
        }
      } else {
        params.push([encodeURIComponent(key), '=', encodeURIComponent(keyValuePairs[key])].join(''));
      }
    }
  }
  return params.join('&');
}
