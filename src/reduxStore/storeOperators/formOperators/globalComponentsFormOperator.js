import {getSetCurrentCountryActn, getSetCurrentCurrencyActn} from 'reduxStore/storeReducersAndActions/session/session';
import {getUserAbstractor} from 'service/userServiceAbstractor';
import {
  setNewsLetterSignUpConfirming as newsLetterConfirming,
  setNewsLetterSignUpUpdating as newsLetterUpdating,
  setCountrySelectorVisible,
  setSearchSuggestions
} from 'reduxStore/storeReducersAndActions/globalComponents/globalComponents';
import {getGlobalComponentsAbstractor} from 'service/globalComponentsServiceAbstractor';
import {logErrorAndServerThrow, getSubmissionError} from '../operatorHelper';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {getRoutingOperator} from 'reduxStore/storeOperators/routingOperator.js';
import {getGeneralOperator} from 'reduxStore/storeOperators/generalOperator.js';
import {PAGES} from 'routing/routes/pages.js';

const EMPTY_ARRAY = [];

let previous = null;
let getGlobalComponentsFormOperator = function (store) {
  if (!previous || previous.store !== store) {
    previous = new GlobalComponentsFormOperator(store);
  }
  return previous;
};

class GlobalComponentsFormOperator {
  constructor (store) {
    this.store = store;
    // create this-bound varsions of all methods of this class whoes name that start with 'submit'
    bindAllClassMethodsToThis(this, 'submit');
  }

  get userServiceAbstractor () {
    return getUserAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  get globalComponentsServiceAbstractor () {
    return getGlobalComponentsAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  submitNewsLetterSignup (formData) {
    // If for some reason form validations misses this
    if (!formData.emailAddress) return;

    this.store.dispatch(newsLetterUpdating(true));

    return this.userServiceAbstractor.validateAndSubmitEmailSignup(formData.emailAddress).then((res) => {
      this.store.dispatch([newsLetterUpdating(false), newsLetterConfirming(true)]);

      // hide the success notification after 5 seconds
      setTimeout(() => {
        this.store.dispatch([newsLetterUpdating(false), newsLetterConfirming(false)]);
      }, 5000);

      return res;
    }).catch((err) => {
      this.store.dispatch([newsLetterUpdating(false), newsLetterConfirming(false)]);
      throw getSubmissionError(this.store, 'newsLetterSignupFromSubmit', err);
    });
  }

  submitOrderForTracking (formData) {
    return submitOrderForTracking(this.store, formData.orderNumber, formData.emailAddress, this.globalComponentsServiceAbstractor);
  }

  submitReservationForTracking (formData) {
    return submitReservationForTracking(this.store, formData.orderNumber, formData.emailAddress, this.globalComponentsServiceAbstractor);
  }

  submitGetSearchSuggestions (term, maxResults) {
    return getSearchSuggestions(this.store, term, maxResults, this.globalComponentsServiceAbstractor);
  }

  submitKeywordSearch (term) {
    this.store.dispatch(setSearchSuggestions(EMPTY_ARRAY));    // clear the old suggestions
    getRoutingOperator(this.store).gotoPage(PAGES.search, { pathSuffix: term });
  }

  submitCountrySelection (formData) {
    let currencies = sitesAndCountriesStoreView.getCurrenciesMap(this.store.getState());
    let currencyInfo = currencies.find((currency) => currency.id === formData.currency);

    let oldCountryCode = sitesAndCountriesStoreView.getCurrentCountry(this.store.getState());
    let newCountryCode = formData.country;
    let oldLanguageCode = getModifiedLanguageCode(sitesAndCountriesStoreView.getCurrentLanguage(this.store.getState()));
    let newLanguageCode = getModifiedLanguageCode(formData.language);

    let requestData = {
      newLanguageCode: newLanguageCode,
      newCountryCode: newCountryCode,
      newCurrencyCode: formData.currency,
      // following lines contain useless info that backend insists that we send back
      oldCountryCode: oldCountryCode,
      oldLanguageCode: oldLanguageCode,
      exchangeRate: currencyInfo.exchangevalue,
      merchantMargin: currencyInfo.merchantMargin,
      quoteId: currencyInfo.quoteId,
      exchangeRoundMethod: currencyInfo.exchangeRoundMethod
    };

    return this.userServiceAbstractor.updateShippingCountry(requestData).then((res) => {
      let state = this.store.getState();
      let newSiteId = sitesAndCountriesStoreView.getSiteIdForCountry(state, newCountryCode);
      // when the language or siteId change redirect the user to the homepage of the corresponding site.

      if (window.MP && MP.switchLanguage) { // eslint-disable-line no-undef
        try {
          MP.init(); // eslint-disable-line no-undef
          MP.switchLanguage(newLanguageCode.substr(0, 2), newCountryCode.toUpperCase(), oldCountryCode.toUpperCase()); // eslint-disable-line no-undef
        } catch (h) {}
      }

      this.store.dispatch([
        setCountrySelectorVisible(false),
        getSetCurrentCountryActn(formData.country),
        getSetCurrentCurrencyActn(formData.currency)
      ]);

      if (newCountryCode !== oldCountryCode || newSiteId !== sitesAndCountriesStoreView.getCurrentSiteId(state)) {
        getGeneralOperator(this.store).setCurrentSite(newSiteId);
        getRoutingOperator(this.store).gotoPage(PAGES.homePage, null, true);
      }
    }).catch((err) => {
      throw getSubmissionError(this.store, 'submitCountrySelectionForm', err);
    });
  }

}

export {getGlobalComponentsFormOperator};

// translates an ISO-639-1 language code into TCP backend code
function getModifiedLanguageCode (code) {
  switch (code) {
    case 'en':
      return 'en_US';
    case 'es':
      return 'es_ES';
    case 'fr':
      return 'fr_FR';
    default:
      return code;
  }
}

function getSearchSuggestions (store, term, maxResults, globalComponentsServiceAbstractor) {
  if (term.length <= 2) {     // do not ask for suggestions for short search terms
    store.dispatch(setSearchSuggestions(EMPTY_ARRAY));
    return Promise.resolve();
  }

  return globalComponentsServiceAbstractor.getAutoSuggestions(term, maxResults, true).then((res) => {
    store.dispatch(setSearchSuggestions(res));
  }).catch((err) => {
    logErrorAndServerThrow(store, 'setSearchSuggestions', err);
  });
}

function submitOrderForTracking (store, orderId, emailAddress, globalComponentsServiceAbstractor) {
  return globalComponentsServiceAbstractor.trackOrder(orderId, emailAddress).then(() => {
    getRoutingOperator(store).gotoPage(PAGES.guestOrderDetails, {pathSuffix: `${orderId}/${emailAddress}`});
  }).catch((err) => {
    throw getSubmissionError(store, 'submitOrderForTracking', err);
  });
}

function submitReservationForTracking (store, reservationId, emailAddress, globalComponentsServiceAbstractor) {
  return globalComponentsServiceAbstractor.trackReservation(reservationId, emailAddress).then(() => {
    getRoutingOperator(store).gotoPage(PAGES.guestReservationDetails, {pathSuffix: `${reservationId}/${emailAddress}`});
  }).catch((err) => {
    throw getSubmissionError(store, 'submitReservationForTracking', err);
  });
}
