import {logErrorAndServerThrow} from './operatorHelper';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
//
import {getAddressesOperator} from 'reduxStore/storeOperators/addressesOperator';
import {getCartOperator} from 'reduxStore/storeOperators/cartOperator';
import {getPaymentCardsOperator} from 'reduxStore/storeOperators/paymentCardsOperator';
import {getCheckoutSignalsOperator} from 'reduxStore/storeOperators/uiSignals/checkoutSignalsOperator';
import {getGeneralOperator} from 'reduxStore/storeOperators/generalOperator';
import {getUserOperator} from 'reduxStore/storeOperators/userOperator';
import {getPlccOperator} from 'reduxStore/storeOperators/plccOperator.js';
//
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView';
// import {addressesStoreView} from 'reduxStore/storeViews/addressesStoreView';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
//
import {PAGES} from 'routing/routes/pages';
import {getRoutingOperator} from 'reduxStore/storeOperators/routingOperator';
import {DRAWER_IDS} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';
import {HOME_PAGE_SECTIONS} from 'routing/routes/homePageRoutes';

import {
  getSetGiftWrapOptionsActn, getSetPickupValuesActn, getSetPickupAltValuesActn, getSetIsLoadingShippingMethodsActn,
  getSetShippingValuesActn, getSetBillingValuesActn, getSetGiftWrapValuesActn, getSetShippingOptionsActn,
  getSetIntlUrl
} from 'reduxStore/storeReducersAndActions/checkout/checkout';
import {getSetAlertMessageActn, getSetIsInactivePaymentActn} from 'reduxStore/storeReducersAndActions/checkout/uiFlags/actionCreators';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView';

import {getVendorAbstractors} from 'service/vendorServiceAbstractor.js';
import {getCartAbstractor} from 'service/cartServiceAbstractor';
import {getCheckoutAbstractor} from 'service/checkoutServiceAbstractor';
import { getProductsOperator } from 'reduxStore/storeOperators/productsOperator.js';
import {setIsExpressEligible} from 'reduxStore/storeReducersAndActions/user/user';
import queryString from 'query-string';

// ------------------------------

let previous = null;
export function getCheckoutOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new CheckoutOperator(store);
  }
  return previous;
}

class CheckoutOperator {
  constructor (store) {
    this.store = store;

    bindAllClassMethodsToThis(this);
  }

  get vendorServiceAbstractors () {
    return getVendorAbstractors(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  get cartServiceAbstractor () {
    return getCartAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  get checkoutServiceAbstractor () {
    return getCheckoutAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  loadInternationalSettings () {
    return this.checkoutServiceAbstractor.getInternationCheckoutSettings().then((res) => {
      this.store.dispatch(getSetIntlUrl(res.checkoutUrl));
    });
  }

  // FIXME: phase functionality out of here to the different sections' load methods
  loadStartupData (isPaypalPostBack) {
    let checkoutSignalsOperator = getCheckoutSignalsOperator(this.store);
    let generalOperator = getGeneralOperator(this.store);
    let storeState = this.store.getState();

    if (userStoreView.isRemembered(storeState)) {
      getRoutingOperator(this.store).gotoPage(HOME_PAGE_SECTIONS[DRAWER_IDS.LOGIN]);
      return Promise.reject(new Error('Remembered user must login/logout before checkout'));
    }

    let pendingPromises = [
      this.loadGiftWrappingOptions()
    ];

    let loadCartAndCheckoutDetails = () => {
      return this.loadUpdatedCheckoutValues().then(loadSelectedOrDefaultShippingMethods);
    };

    let loadSelectedOrDefaultShippingMethods = () => {
      // We need the shipping methods to load AFTER the cart details
      // in case there are already prefilled shipping details
      // (such in paypal postback)
      let storeState = this.store.getState();
      if (checkoutStoreView.getIsShippingRequired(storeState)) {
        let shippingAddress = checkoutStoreView.getShippingDestinationValues(storeState).address;

        if (!shippingAddress.country || !shippingAddress.state || !shippingAddress.zipCode) {
          // if some data is missing request defaults (new user would have preselected country and zipcode, but not state but service needs all 3 of them)
          return loadShipmentMethods(this.store, {country: '', state: '', zipCode: ''}, {state: true, zipCode: true}, true, this.checkoutServiceAbstractor);
        } else {
          return loadShipmentMethods(this.store, {
            country: shippingAddress.country,
            state: shippingAddress.state,
            zipCode: shippingAddress.zipCode,
            addressLine1: shippingAddress.addressLine1,
            addressLine2: shippingAddress.addressLine2
          }, {
            state: true,
            zipCode: true
          }, true, this.checkoutServiceAbstractor);
        }
      } else {
        return Promise.resolve();
      }
    };

    let displayPreScreenModal = (res) => {
      return getPlccOperator(this.store).optionalPlccOfferModal(res.plccEligible, res.prescreenCode).then(() => {
        return this.loadUpdatedCheckoutValues();
      });
    };

    let loadExpressCheckout = () => {
      // On shipping we taking into acocunt if this is a gift or not. On express checkout we pre-screen no matter what, even though the user may have a gift order
      let shouldPreScreenUser = generalStoreView.getIsPrescreenFormEnabled(storeState) && !userStoreView.getUserIsPlcc(storeState);

      return this.checkoutServiceAbstractor.startExpressCheckout(shouldPreScreenUser)
        .then((preScreenInfo) => {
          /* Doing displayPreScreenModal in parallel. The only issue i can see here is if loadCartAndCheckoutDetails is not resolved by the
           * time the user navigates to the form we can not pre-set the address. If this ever does become an issue then we can just push this out
           * and do it after the other api resolves. Doing it this way should make the page seem more responsive however.
          */
          displayPreScreenModal(preScreenInfo);
          return loadCartAndCheckoutDetails();
        })
        .catch(() => {
          this.store.dispatch(setIsExpressEligible(false));
          return loadCartAndCheckoutDetails();
        });
    };

    if (!isPaypalPostBack && checkoutStoreView.isExpressCheckout(storeState)) {
      pendingPromises.push(loadExpressCheckout());
    } else {
      pendingPromises.push(loadCartAndCheckoutDetails());
    }

    if (!userStoreView.isGuest(storeState)) {
      pendingPromises.push(getPaymentCardsOperator(this.store).loadCreditCardsOnAccount());
      pendingPromises.push(getAddressesOperator(this.store).loadAddressesOnAccount());
    }

    return Promise.all(pendingPromises)
    .then(() => {
      let storeState = this.store.getState();

      if (isPaypalPostBack || checkoutStoreView.isExpressCheckout(storeState)) {
        checkoutSignalsOperator.openReviewSectionForm(true);
        generalOperator.setIsLoading(false);
      } else if (cartStoreView.getIsOrderHasPickup(storeState)) {
        checkoutSignalsOperator.openPickupSectionForm(true);
        generalOperator.setIsLoading(false);
      } else {
        checkoutSignalsOperator.openShippingSectionForm(true);
        generalOperator.setIsLoading(false);
      }
    })
    .catch((err) => {
      logErrorAndServerThrow(this.store, 'CheckoutOperator.loadStartupData', err);
      generalOperator.setIsLoading(false);
    });
  }

  initCheckout () {
    let queryObject = queryString.parse(location.search); // eslint-disable-line no-undef
    let isPaypalPostBack = ((queryObject.PaReq || queryObject.PaRes) && queryObject.MD); // put somewhere in the store onload to prevent checking for this this way

    if (isPaypalPostBack) {       // are we coming back from the paypal site
      return this.vendorServiceAbstractors.paypalAuthorization(
        queryObject.tcpOrderId,
        queryObject.centinelCallingPage || queryObject.callingPage,
        queryObject.PaReq || queryObject.PaRes,
        queryObject.MD
      ).then((res) => {
        return this.loadStartupData(true);
      }).catch((err) => {
        if (err.errorCodes !== 'PAYPAL_CC_ERROR_CODE_AUTHENTICATION_USER_CANCELED') {
          getRoutingOperator(this.store).gotoPage(PAGES.cart, {
            queryValues: {
              error: err.errorCodes
            }
          }, true);
        } else {
          getRoutingOperator(this.store).gotoPage(PAGES.cart, null, true);
        }

        throw err;
      });
    } else {      // not coming back from paypal (i.e., standard checkout process should start)
      return this.loadStartupData(false);
    }
  }

  setBillingAddressSameAsShipping (change) {
    let shippingAddress = checkoutStoreView.getShippingDestinationValues(this.store.getState()).address;
    change('address.firstName', shippingAddress.firstName);
    change('address.lastName', shippingAddress.lastName);
    change('address.addressLine1', shippingAddress.addressLine1);
    change('address.addressLine2', shippingAddress.addressLine2);
    change('address.city', shippingAddress.city);
    change('address.state', shippingAddress.state);
    change('address.zipCode', shippingAddress.zipCode);
    change('address.country', shippingAddress.country);
  }

  loadGiftWrappingOptions () {
    return loadGiftWrappingOptions(this.store, this.checkoutServiceAbstractor);
  }

  loadShipmentMethods (miniAddress, changeFlags, throwError) {
    return loadShipmentMethods(this.store, miniAddress, changeFlags, throwError, this.checkoutServiceAbstractor);
  }

  loadUpdatedCheckoutValues (isUpdateRewards, isTaxCalculation, isCartNotRequired) {
    let imageGenerator = getProductsOperator(this.store).getImgPath;

    // we shouldn't block the user when loading promos, so not pushing to pendingPromises
    getUserOperator(this.store).getAllAvailableCouponsAndPromos()
      .catch((err) => { logErrorAndServerThrow(this.store, 'getAllAvailableCouponsAndPromos', err); });

    return Promise.all([
      // FIXME: no need to load rewards on initial load (getting the user details does that)
      isUpdateRewards ? getUserOperator(this.store).setRewardPointsData() : Promise.resolve(),
      this.cartServiceAbstractor.getCurrentOrder(null, isTaxCalculation, isCartNotRequired, imageGenerator).then((res) => { this.storeUpdatedCheckoutValues(res, isCartNotRequired); })
    ]);
  }

  storeUpdatedCheckoutValues (res, isCartNotRequired) {
    let cartActions = getCartOperator(this.store).setCartInfo(res, !isCartNotRequired, true); // setCartInfo(cartInfo, isSetCartItems, shouldExportActions)
    let resCheckoutValues = res.checkout;
    let actions = [
      resCheckoutValues.pickUpContact && getSetPickupValuesActn(resCheckoutValues.pickUpContact),
      resCheckoutValues.pickUpAlternative && getSetPickupAltValuesActn(resCheckoutValues.pickUpAlternative),
      resCheckoutValues.shipping && getSetShippingValuesActn(resCheckoutValues.shipping),
      resCheckoutValues.giftWrap && getSetGiftWrapValuesActn(
        {hasGiftWrapping: !!resCheckoutValues.giftWrap.optionId, ...resCheckoutValues.giftWrap}
      ),
      resCheckoutValues.billing && getSetBillingValuesActn(resCheckoutValues.billing)
    ];
    this.store.dispatch([...actions, ...cartActions]);
  }

  clearAlertMessage () {
    this.store.dispatch(getSetAlertMessageActn(null));
  }

  redirectToBilling () {
    let checkoutSignalsOperator = getCheckoutSignalsOperator(this.store);
    this.store.dispatch(getSetIsInactivePaymentActn(true));
    checkoutSignalsOperator.openBillingSectionForm(true);
  }
}

// accepts in miniAddress containing the current country, state, zipCode, addressLine1, addressLine2
// and an object flagging which of these may have changed causing this method to be called.
// Note: this is an ugly hack for an ugly requirement
let oldHasPOB = {};
function loadShipmentMethods (store, miniAddress, changhedFlags, throwError, checkoutServiceAbstractor) {
  // Note: this convoluted logic is due to BE. If address lines do not contain a pobox then
  // in the US we should only respond to state changes, and in Canada only to zipcode changes.
  // And we also have to react to any change if switching from having to not having a pobox, or a change
  // in address lines if currently has a pobox
  let newHasPOB = hasPOBox(miniAddress.addressLine1, miniAddress.addressLine2);
  if (!(oldHasPOB !== newHasPOB || (newHasPOB && (changhedFlags.addressLine1 || changhedFlags.addressLine2))) &&
    ((miniAddress.country === 'US' && !changhedFlags.state) ||       // zipCode changed, but not state
      (miniAddress.country === 'CA' && !changhedFlags.zipCode))) {   // state changed, but not zipCode
    return Promise.resolve();       // shipping methods are the same as we already have
  }
  oldHasPOB = newHasPOB;

  store.dispatch(getSetIsLoadingShippingMethodsActn(true));
  return checkoutServiceAbstractor.getShippingMethods(miniAddress.state, miniAddress.zipCode, miniAddress.addressLine1, miniAddress.addressLine2)
    .then((res) => {
      store.dispatch([getSetShippingOptionsActn(res), getSetIsLoadingShippingMethodsActn(false)]);
    }).catch((err) => {
      logErrorAndServerThrow(store, 'CheckoutOperator.loadShipmentMethods', err);
      store.dispatch(getSetIsLoadingShippingMethodsActn(false));
      if (throwError) { throw err; }
    });
}

function hasPOBox (addressLine1 = '', addressLine2 = '') {
  let value = addressLine1 + '#' + addressLine2;        // some delimiter that will not allow them to match only if concatenated
  // REVIEW: got the regex from: https://gist.github.com/gregferrell/7494667 seems to cover most use cases; not in the mood to write it from scratch
  return value.search(/\bbox(?:\b$|([\s|-]+)?[0-9]+)|(p[-.\s]*o[-.\s]*|(post office|post)\s)b(\.|ox|in)?\b|(^p[.]?(o|b)[.]?$)/igm) >= 0;
}

function loadGiftWrappingOptions (store, checkoutServiceAbstractor) {
  return checkoutServiceAbstractor.getGiftWrappingOptions().then((res) => {
    store.dispatch(getSetGiftWrapOptionsActn(res));
  }).catch((err) => {
    logErrorAndServerThrow(store, 'CheckoutOperator.loadGiftWrappingOptions', err);
    throw err;
  });
}
