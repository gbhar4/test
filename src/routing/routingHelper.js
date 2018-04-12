/** @module routingHelper
  * @author Ben
 */
import {routingConstants} from './routingConstants.js';

/**
 * @see ServerToClientRenderPatch.jsx - Do not use this to determine rendering of a component or part of a component. The server
 *  side and client side hydration should be the same. If this is needed use ServerToClientRenderPatch.jsx.
 */
export function isClient () {
  return typeof window !== 'undefined';
}

/**
 * @see ServerToClientRenderPatch.jsx - Do not use this to determine rendering of a component or part of a component. The server
 *  side and client side hydration should be the same. If this is needed use ServerToClientRenderPatch.jsx.
 */
export function isTouchClient () {
  return typeof window !== 'undefined' && !!('ontouchstart' in window);
}

export function isInternetExplorer () {
  if (!isClient()) {
    console.warn('WARNNING: You are using isInternetExplorer on the server side so this flag can not be trusted');
    return false;
  }

  let userAgent = window.navigator.userAgent;
  let isUserAgentIE = (userAgent.indexOf('MSIE ') > 0) || !!(userAgent.match(/Trident/) || userAgent.match(/rv:11/));
  let isAppNameIE = navigator.appName === 'Microsoft Internet Explorer';

  if (isUserAgentIE || isAppNameIE) {
    return true;
  }

  return false;
}

export function getLanguageFromDomain (domain) {
  let langCode = domain.substr(0, 3);
  if (langCode === 'es.' || langCode === 'en.' || langCode === 'fr.') {
    return langCode.substr(0, 2);
  } else {
    return 'en';
  }
}

export function getSiteIdFromPath (path) {
  // let match = matchPath(history.location.pathname, {path: '/:countryOrId/'});
  // let countryOrId = (match.params.countryOrId || '').toLowerCase();

  let siteId = 'us';
  // Canadian site only if we find '/ca/' or '/${routingConstants.sitesInfo.storeIdCA}/` in the current location's path
  let pathPrortions = path.split('/');
  for (let i = 1; i < pathPrortions.length - 1; i++) {      // skip portions before first and after last '/'
    if (pathPrortions[i].toLowerCase() === 'ca' || pathPrortions[i] === routingConstants.sitesInfo.storeIdCA) {
      siteId = 'ca';
      break;
    }
  }
  return siteId;
}
