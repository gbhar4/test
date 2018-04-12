/**
 * @author Mike Citro
 * @author Ben
 */

import {logErrorAndServerThrow} from './operatorHelper';
import {getSetConfirmationModalCallbacks, getSetOpenModalIdActn, getSetIsLoadingActn,
  getSetEspotValueActn, ESPOT_TYPES, getSetEspotsTableActn}
  from 'reduxStore/storeReducersAndActions/general/general';
import {getLoadSitePromoAction} from 'reduxStore/storeReducersAndActions/couponsAndPromos/couponsAndPromos';
import {observeStore} from 'reduxStore/util/observeStore';
import {getGlobalComponentsAbstractor} from 'service/globalComponentsServiceAbstractor';
import {getSetAvailableCurrenciesActn, getSetAvailableCountriesActn,
  getSetIsRecapchaEnabledActn,
  getSetIsWicFormEnabledActn, getSetIsPrescreenFormEnabledActn,
  getSetCurrentSiteActn, getSetCurrentLanguageActn,
  getSetIsCommunicationPreferencesEnabled, getSetIsBopisClearanceProductEnabledActn}
  from 'reduxStore/storeReducersAndActions/session/session';
import {getCartAbstractor} from 'service/cartServiceAbstractor';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView';
import {getSetIsGiftOptionsEnabled, getSetMaxGiftCardsActn, getSetIsPLCCPaymentEnabledEnabledActn} from 'reduxStore/storeReducersAndActions/checkout/checkout';
import {getSetOrdersNotificationsThresholdActn} from 'reduxStore/storeReducersAndActions/user/user';
import {setNavigationTree, setFooterNavigationTree} from 'reduxStore/storeReducersAndActions/globalComponents/globalComponents';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {isClient} from 'routing/routingHelper';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {
  getSetFlashMessageActn,
  getSetFlashMessageExpiresNow,
  FLASH_TYPES
} from 'reduxStore/storeReducersAndActions/general/general.js';
import {getSetIsPayPalEnabledActn} from 'reduxStore/storeReducersAndActions/cart/cart.js';
import {getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator.js';
import {getRoutingOperator} from 'reduxStore/storeOperators/routingOperator.js';
import {PAGES} from 'routing/routes/pages.js';

let previous = null;
export function getGeneralOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new GeneralOperator(store);
  }
  return previous;
}

class GeneralOperator {
  constructor (store) {
    this.store = store;
    bindAllClassMethodsToThis(this);

    if (isClient()) {
      observeStore(
        this.store,
        (state) => ({
          siteId: sitesAndCountriesStoreView.getCurrentSiteId(state),
          isGuest: userStoreView.isGuest(state),
          isRemembered: userStoreView.isRemembered(state)
        }),
        (oldSlice, newSlice) => {
          // only reload footer if there was a change (not onload, onload triggers somewhere else)
          if (oldSlice && (oldSlice.isGuest !== newSlice.isGuest || oldSlice.isRemembered !== newSlice.isRemembered)) {
            this.loadFooterNavigation(newSlice.isGuest, newSlice.isRemembered).catch((err) => { logErrorAndServerThrow(store, 'loadFooterNavigation', err); });
          }
          if (oldSlice && oldSlice.isGuest !== newSlice.isGuest) {
            this.reloadEspots(oldSlice.isGuest, newSlice.isGuest);
          }
        },
        true
      );
    }
  }

  get globalComponentsServiceAbstractor () {
    return getGlobalComponentsAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  get cartServiceAbstractor () {
    return getCartAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  setCurrentSite (siteId) {
    return this.store.dispatch(getSetCurrentSiteActn(siteId));
  }

  setCurrentLanguage (language) {
    return this.store.dispatch(getSetCurrentLanguageActn(language));
  }

  closeConfirmationModal () {
    this.store.dispatch([
      getSetOpenModalIdActn(''),
      // the next call is simply to allow garbage collection to reclaim the old data
      getSetConfirmationModalCallbacks(null, null)
    ]);
  }

  openCustomModal (modalId) {
    return this.store.dispatch(getSetOpenModalIdActn(modalId));
  }

  closeCustomModal () {
    return this.store.dispatch(getSetOpenModalIdActn(''));
  }

  openConfirmationModal (modalId, okCallback, cancelCallback) {
    return new Promise((resolve, reject) => {
      this.store.dispatch([
        getSetConfirmationModalCallbacks(
          // submit modal callback: resolve with the value of the submit method
          () => {
            this.closeConfirmationModal();
            resolve(okCallback && okCallback());
          },
          // dismiss modal callback: indicate submit failed (with no error) due to user cancelling it
          () => {
            this.closeConfirmationModal();
            reject(cancelCallback && cancelCallback());
          }
        ),
        getSetOpenModalIdActn(modalId)
      ]);
    });
  }

  setIsLoading (isLoading) {
    return this.store.dispatch(getSetIsLoadingActn(isLoading));
  }

  getReverseNamesTable (espotsTable) {
    let isMobile = routingInfoStoreView.getIsMobile(this.store.getState());
    let reverseNamesTable = Object.create(null);
    for (let name of Object.keys(espotsTable)) {
      if ((espotsTable[name].isMobileOnly && !isMobile) || (espotsTable[name].isDesktopOnly && isMobile)) {
        continue;     // skip espot if not specified for this device
      }
      reverseNamesTable[espotsTable[name].nameOnServer] = name;
    }

    return reverseNamesTable;
  }

  loadEspots (espotsTable) {
    this.store.dispatch(getSetEspotsTableActn(espotsTable));
    return this.setEspotsValues(this.getReverseNamesTable(espotsTable));
  }

  loadSearchEspots (espotsTable, searchTerm) {
    this.store.dispatch(getSetEspotsTableActn(espotsTable));
    return this.setEspotsValues(this.getReverseNamesTable(espotsTable), searchTerm);
  }

  setEspotsValues (reverseNamesTable, searchTerm) {
    let type = userStoreView.isGuest(this.store.getState())
      ? ESPOT_TYPES.GUEST : ESPOT_TYPES.REGISTERED;
    let namesOnServer = Object.keys(reverseNamesTable);
    let isMobile = routingInfoStoreView.getIsMobile(this.store.getState());

    return this.globalComponentsServiceAbstractor.getMultiEspots(namesOnServer, isMobile, searchTerm).then((res) => {
      for (let espot of res) {
        // FIXME: everywhere: change maketingText to htmlMarkup
        this.store.dispatch(getSetEspotValueActn(reverseNamesTable[espot.espotName], espot.maketingText, type));
      }
    }).catch((err) => logErrorAndServerThrow(this.store, 'setEspotsValues', err));
  }

  loadEspotAndExtraInfo (espotsTable) {
    this.store.dispatch(getSetEspotsTableActn(espotsTable));
    return this.setEspotsAndExtraInfoValues(this.getReverseNamesTable(espotsTable));
  }

  setEspotsAndExtraInfoValues (reverseNamesTable) {
    let type = userStoreView.isGuest(this.store.getState())
      ? ESPOT_TYPES.GUEST : ESPOT_TYPES.REGISTERED;
    let namesOnServer = Object.keys(reverseNamesTable);
    let isMobile = routingInfoStoreView.getIsMobile(this.store.getState());

    return this.globalComponentsServiceAbstractor.getMultiEspotsAndExtraInfo(namesOnServer, isMobile).then((res) => {
      for (let espot of res) {
        // FIXME: everywhere: change maketingText to htmlMarkup
        this.store.dispatch(getSetEspotValueActn(reverseNamesTable[espot.espotName], espot.maketingText, type, {
          title: espot.seoTitle,
          longDescription: espot.seoMeta
          // shortDescription: espot.shortDesc // not needed (for now)
        }));
      }
    }).catch((err) => logErrorAndServerThrow(this.store, 'setEspotsAndExtraInfoValues', err));
  }

  loadKillSwitches () {
    return this.globalComponentsServiceAbstractor.getApplicationKillSwitches().then((switches) => {
      let isMobile = routingInfoStoreView.getIsMobile(this.store.getState());

      return this.store.dispatch([
        // getSetIsBopisEnabledActn(switches.isBopisEnabled), // trusting the one in getProfile
        // getSetIsRopisEnabledActn(switches.isRopisEnabled), // trusting the one in getProfile
        getSetIsBopisClearanceProductEnabledActn(switches.isBopisClearanceProductEnabled),
        getSetIsGiftOptionsEnabled(switches.isGiftOptionsEnabled),
        getSetMaxGiftCardsActn(switches.maxGiftCards),
        getSetIsPLCCPaymentEnabledEnabledActn(switches.isPLCCPaymentEnabled),
        getSetIsRecapchaEnabledActn(switches.isRecapchaEnabled),
        getSetOrdersNotificationsThresholdActn(switches.ordersNotificationsThreshold),
        getSetIsWicFormEnabledActn((!isMobile && switches.isWICEnabled) || (isMobile && switches.isWICMobileEnabled)),
        getSetIsPrescreenFormEnabledActn((!isMobile && switches.isOLPSEnabled) || (isMobile && switches.isOLPSMobileEnabled)),
        getSetIsCommunicationPreferencesEnabled(switches.isCommunicationPreferencesEnabled),
        getSetIsPayPalEnabledActn(switches.isPaypalEnabled) // DT-32633: Need to ensure that PayPal killswitch is updated in app in the begining.
      ]);
    }).catch((err) => logErrorAndServerThrow(this.store, 'loadKillSwitches', err));
  }

  loadSitePromotions () {
    return this.cartServiceAbstractor.getSitePromotions().then((res) => {
      this.store.dispatch(getLoadSitePromoAction(res));
    }).catch((err) => logErrorAndServerThrow(this.store, 'loadSitePromotions', err));
  }

  setCountryAndCurrenciesMap () {
    return this.globalComponentsServiceAbstractor.getCountriesList().then((res) => {
      this.store.dispatch([
        getSetAvailableCurrenciesActn(res.currenciesMap),
        getSetAvailableCountriesActn(res.countriesMap)
      ]);
    }).catch((err) => logErrorAndServerThrow(this.store, 'setCountryAndCurrenciesMap', err));
  }

  reloadEspots (oldIsGuest, newIsGuest) {
    if (typeof oldIsGuest === 'undefined') {
      return;       // do nothing on initial callback from store - this is not a login or logout
    }
    let espots = generalStoreView.getAllEspots(this.store.getState());
    let reverseNamesTableToLoad = Object.create(null);
    for (let name of Object.keys(espots)) {
      if (espots[name][ESPOT_TYPES.GUEST] !== espots[name][ESPOT_TYPES.REGISTERED]) {
        reverseNamesTableToLoad[espots[name].nameOnServer] = name;
      }
    }
    this.setEspotsValues(reverseNamesTableToLoad).catch(
      (err) => logErrorAndServerThrow(this.store, 'reloadEspots', err)
    );
  }

  loadFooterNavigation (isGuest = userStoreView.isGuest(this.store.getState()), isRemembered = userStoreView.isRemembered(this.store.getState())) {
    return this.globalComponentsServiceAbstractor.getFooterLinks(isGuest, isRemembered).then((res) => {
      this.store.dispatch(setFooterNavigationTree(res));
    });
  }

  loadHeaderNavigationTree () {
    return this.globalComponentsServiceAbstractor.getNavigationTree().then((res) => {
      this.store.dispatch(setNavigationTree(res));

      // load all the espots in the tree.
      let espotsNamesTable = Object.create(null);
      for (let l1 of res) {
        if (l1.primaryEspot) espotsNamesTable[l1.primaryEspot] = l1.primaryEspot;
        if (l1.secondaryEspot) espotsNamesTable[l1.secondaryEspot] = l1.secondaryEspot;
      }
      if (Object.keys(espotsNamesTable).length > 0) {
        this.setEspotsValues(espotsNamesTable);
      }
    }).catch((err) => logErrorAndServerThrow(this.store, 'loadHeaderNavigationTree', err));
  }

  flashSuccess (message) {
    let history = routingInfoStoreView.getHistory(this.store.getState());
    this.store.dispatch(getSetFlashMessageActn(message, FLASH_TYPES.SUCCESS, history.location.pathname));
  }

  flashError (message) {
    let history = routingInfoStoreView.getHistory(this.store.getState());
    this.store.dispatch(getSetFlashMessageActn(message, FLASH_TYPES.ERROR, history.location.pathname));
  }

  clearFlashMessage () {
    this.store.dispatch(getSetFlashMessageActn(null));
  }

  evalFlashMessageExpiration (match, location, history) {
    let state = this.store.getState();
    let flashMessage = generalStoreView.getFlashMessage(state);

    if (flashMessage === null) {
      return;
    }

    let flashExpiresNow = generalStoreView.getFlashMessageExpiresNow(state);
    if (!flashExpiresNow) {
      this.store.dispatch(getSetFlashMessageExpiresNow(true));
    } else {
      this.store.dispatch(getSetFlashMessageActn(null));
    }
  }

  closeDrawersAndGoToAccountOverview () {
    getGlobalSignalsOperator(this.store).closeDrawers();
    getRoutingOperator(this.store).pushLocation(PAGES.myAccount);
  }
}
