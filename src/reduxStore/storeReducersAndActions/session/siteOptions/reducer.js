import Immutable from 'seamless-immutable';
import {routingConstants} from 'routing/routingConstants.js';

let defaultSiteOptionsStore = Immutable({
  countriesMap: [],
  sitesTable: {
    [routingConstants.siteIds.us]: {
      languages: [
        {
          id: 'en',
          displayName: 'English'
        }, {
          id: 'es',
          displayName: 'Spanish'
        }
      ]
    },
    [routingConstants.siteIds.ca]: {
      languages: [
        {
          id: 'en',
          displayName: 'English'
        }, {
          id: 'fr',
          displayName: 'French'
        }
      ]
    }
  },
  currenciesMap: []
});

export const siteOptionsReducer = function (siteOptions = defaultSiteOptionsStore, action) {
  switch (action.type) {
    case 'SESSION_SITEOPTIONS_SET_AVAILABLE_SITES':
      return Immutable.merge(siteOptions, {sitesTable: action.sitesTable});
    case 'SESSION_SITEOPTIONS_SET_AVAILABLE_CURRENCY':
      return Immutable.merge(siteOptions, {currenciesMap: action.availableCurrency});
    case 'SESSION_SITEOPTIONS_SET_AVAILABLE_COUNTRIES':
      return Immutable.merge(siteOptions, {countriesMap: action.availableCountries});
    default:
      return siteOptions;
  }
};
