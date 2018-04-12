import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {userStoreView} from 'reduxStore/storeViews/userStoreView.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView.js';
import {routingConstants} from 'routing/routingConstants.js';
import {isClient} from 'routing/routingHelper';

export const vendorRoutingStoreView = {
  getHomepageURL,
  getCommunicationPreferencesURL,
  getDirectionsGoogleMapURL,
  getInternationalOrdersHistoryURL,
  getSpotlightReviewsUrl,
  getBazaarvoiceApiUrl
};

function getHomepageURL (state
    , siteId = sitesAndCountriesStoreView.getCurrentSiteId(state)
    , language = sitesAndCountriesStoreView.getCurrentLanguage(state)) {
  let assetsHost = routingInfoStoreView.getApiHelper(state).configOptions.assetHost;
  let redirectDomain = assetsHost.substr(8).replace('www.', ''); // on production we don't use es.www.childrensplace.com, it's es.childrensplace.com
  let prefixLanguage = redirectDomain.substr(0, 3) !== (language + '.'); // MP is re-writing our minified file, so we need to check the domain is not already what we need to use

  if (isClient()) {
    if (language === 'fr') {
      return '//' + (prefixLanguage ? language + '.' : '') + redirectDomain + (!redirectDomain.endsWith('/') ? '/' : '') + 'ca/home';
    } else if (language === 'es') {
      return '//' + (prefixLanguage ? language + '.' : '') + redirectDomain + (!redirectDomain.endsWith('/') ? '/' : '') + 'us/home';
    } else {
      return assetsHost + (!assetsHost.endsWith('/') ? '/' : '') + siteId + '/home';
    }
  } else {
    return '/' + siteId + '/home';
  }
}

function getCommunicationPreferencesURL (state) {
  let siteId = sitesAndCountriesStoreView.getCurrentSiteId(state);
  let language = sitesAndCountriesStoreView.getCurrentLanguage(state);
  let email = userStoreView.getUserEmail(state);
  let link = null;

  if (siteId === routingConstants.siteIds.ca) {
    if (language === 'fr') {
      link = 'https://pages.em.childrensplace.com/page.aspx?QS=3935619f7de112eff1fa0d2650ecee3202f26fd4cf89aa08';
    } else {
      link = 'https://pages.em.childrensplace.com/page.aspx?QS=3935619f7de112ef7c3d929c0bdb464e8557e3846e8d8bbd';
    }
  } else {
    link = 'https://pages.em.childrensplace.com/page.aspx?QS=3935619f7de112ef29d24932a368eea9b7a060f2b85f168e';
  }

  return `${link}&emailaddress=${email}`;
}

function getDirectionsGoogleMapURL (state, addressLine1, city, geographicalState, zipCode) {
  return `https://maps.google.com/maps?daddr=${addressLine1},%20${city},%20${geographicalState},%20${zipCode}`;
}

function getInternationalOrdersHistoryURL (state) {
  return 'https://services.fiftyone.com/tracking.srv';
}

function getSpotlightReviewsUrl (state) {
  return routingInfoStoreView.getApiHelper(state).configOptions.apiKeys.BAZAARVOICE_SPOTLIGHT;
}

function getBazaarvoiceApiUrl (state) {
  return routingInfoStoreView.getApiHelper(state).configOptions.apiKeys.BAZAARVOICE;
}
