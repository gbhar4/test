import Immutable from 'seamless-immutable';
import {routingConstants} from 'routing/routingConstants.js';

let defaultSiteDetailsStore = Immutable({
  isMobile: false,
  country: 'US',
  siteId: routingConstants.siteIds.us,
  language: 'en',
  currency: 'USD',
  isRopisEnabled: false,
  isBopisEnabled: false,
  isBopisClearanceProductEnabled: false,
  isRecapchaEnabled: true,
  isPrescreenFormEnabled: true,
  isWicFormEnabled: true,
  isCommunicationPreferencesEnabled: false,
  originSettings: { // These are set on the node server, in case the .env file is not on the server the paths will be relative
    JS_HOST_DOMAIN: '',
    CSS_HOST_DOMAIN: '',
    IMG_HOST_DOMAIN: ''
  }
});

export function siteDetailsReducer (siteDetails = defaultSiteDetailsStore, action) {
  switch (action.type) {
    case 'SESSION_SITEDETAILS_SET_ISMOBILE':
      return Immutable.merge(siteDetails, {isMobile: action.isMobile});
    case 'SESSION_SITEDETAILS_SET_IS_ROPIS_ENABLED':
      return Immutable.merge(siteDetails, {isRopisEnabled: action.isRopisEnabled});
    case 'SESSION_SITEDETAILS_SET_COUNTRY':
      return Immutable.merge(siteDetails, {country: action.countryCode});
    case 'SESSION_SITEDETAILS_SET_SITE':
      return Immutable.merge(siteDetails, {siteId: action.siteId});
    case 'SESSION_SITEDETAILS_SET_LANGUAGE':
      return Immutable.merge(siteDetails, {language: action.currentLanguage});
    case 'SESSION_SITEDETAILS_SET_CURRENT_CURRENCY':
      return Immutable.merge(siteDetails, {currency: action.currentCurrency});
    case 'SESSION_SITEDETAILS_SET_BOPIS_ENABLED':
      return Immutable.merge(siteDetails, {isBopisEnabled: action.isBopisEnabled});
    case 'SESSION_SITEDETAILS_SET_BOPIS_CLEARANCE_ENABLED':
      return Immutable.merge(siteDetails, {isBopisClearanceProductEnabled: action.isBopisClearanceProductEnabled});
    case 'GIFT_CARD_RECAPTCHA_ENABLED':
      return Immutable.merge(siteDetails, {isRecapchaEnabled: action.isRecapchaEnabled});
    case 'SESSION_SITEDETAILS_SET_WIC_ENABLED':
      return Immutable.merge(siteDetails, {isWicFormEnabled: action.isWicFormEnabled});
    case 'SESSION_SITEDETAILS_SET_PRESCREEN_ENABLED':
      return Immutable.merge(siteDetails, {isPrescreenFormEnabled: action.isPrescreenFormEnabled});
    case 'SESSION_SITEDETAILS_SET_COMMUNICATION_PREFERENCES':
      return Immutable.merge(siteDetails, {isCommunicationPreferencesEnabled: action.isCommunicationPreferencesEnabled});
    case 'SESSION_SITEDETAILS_SET_ORIGIN_SETTINGS':
      return Immutable.merge(siteDetails, { originSettings: action.settings });
    default:
      return siteDetails;
  }
}

export * from './actionCreators';
