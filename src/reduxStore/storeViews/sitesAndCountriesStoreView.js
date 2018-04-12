import {routingConstants} from 'routing/routingConstants.js';

const USA_VALUES = {
  currency: 'USD',
  currencySymbol: '$',
  countryCode: 'US',
  siteId: routingConstants.siteIds.us
};

export const sitesAndCountriesStoreView = {
  getCurrentCountryLanguages,
  getCountriesMap,
  getSitesTable,
  getCurrenciesMap,
  getCurrentCountry,
  getCurrentLanguage,
  getCurrentCurrency,
  getCountryImage,
  getIsBopis,
  getCurrentSiteId,
  getSiteIdForCountry,
  isRewardsEnabled,
  isAirMilesEnabled,
  getCurrentCurrencySymbol,
  getRopisEnabledFlag,
  getIsCanada,
  getIsBopisClearanceProductEnabled,
  getIsInternationalShipping,
  isUsSite
};

function getCurrentCountryLanguages (state) {
  return state.session.siteOptions.sitesTable[state.session.siteDetails.siteId].languages;
}

function getRopisEnabledFlag (state) {
  return state.session.siteDetails.isRopisEnabled;
}

function getCountriesMap (state) {
  return state.session.siteOptions.countriesMap;
}

function getSitesTable (state) {
  return state.session.siteOptions.sitesTable;
}

function getCurrenciesMap (state) {
  return state.session.siteOptions.currenciesMap;
}

function getCurrentCountry (state) {
  return state.session.siteDetails.country;
}

function getCurrentLanguage (state) {
  return state.session.siteDetails.language;
}

function getCurrentCurrency (state) {
  return state.session.siteDetails.currency;
}

function getCurrentCurrencySymbol (state) {
  // REVIEW: do we need a new map storing currencySymbols per currency value?
  let country = getCurrentCountry(state);

  if (country === 'US' || country === 'CA') {
    return '$';
  } else {
    return state.session.siteDetails.currency === USA_VALUES.currency ? USA_VALUES.currencySymbol : state.session.siteDetails.currency + ' ';
  }
}

function getCountryImage (state) {
  return '/wcsstore/GlobalSAS/images/tcp/international_shipping/flags/' + getCurrentCountry(state) + '.gif';
}

function getIsBopis (state) {
  return state.session.siteDetails.isBopisEnabled;
}

function getSiteIdForCountry (state, countryCode) {
  let currentCountry = state.session.siteOptions.countriesMap.find((country) => country.id === countryCode);
  return currentCountry ? currentCountry.siteId : routingConstants.siteIds.us;
}

function getCurrentSiteId (state) {
  return state.session.siteDetails.siteId;
}

function getIsBopisClearanceProductEnabled (state) {
  return state.session.siteDetails.isBopisClearanceProductEnabled;
}

function isRewardsEnabled (state) {
  return getCurrentCountry(state) === USA_VALUES.countryCode;
}

function isAirMilesEnabled (state) {
  return getIsCanada(state);
}

function getIsCanada (state) {
  return getCurrentSiteId(state) === routingConstants.siteIds.ca;
}

function isUsSite (state) {
  return getCurrentSiteId(state) === routingConstants.siteIds.us;
}

function getIsInternationalShipping (state) {
  return getCurrentCountry(state) !== 'US' && getCurrentCountry(state) !== 'CA';
}
