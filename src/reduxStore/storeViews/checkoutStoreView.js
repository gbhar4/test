/** @module checkoutStoreView
 *
 * @author Ben
 */

import Immutable from 'seamless-immutable';
import {userStoreView} from 'reduxStore/storeViews/userStoreView.js';
import {addressesStoreView} from 'reduxStore/storeViews/addressesStoreView.js';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView.js';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';
import {CHECKOUT_STAGES} from 'reduxStore/storeReducersAndActions/checkout/checkout';
import {paymentCardsStoreView} from 'reduxStore/storeViews/paymentCardsStoreView.js';
import {ACCEPTED_CREDIT_CARDS} from 'reduxStore/storeReducersAndActions/paymentCards/paymentCards.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView.js';

// FIXME: im expecting this to be moved to the proper internationalization namespace
let MONTH_SHORT_FORMAT = Immutable({JAN: 'Jan',
  FEB: 'Feb',
  MAR: 'Mar',
  APR: 'Apr',
  MAY: 'May',
  JUN: 'Jun',
  JUL: 'Jul',
  AUG: 'Aug',
  SEP: 'Sep',
  OCT: 'Oct',
  NOV: 'Nov',
  DEC: 'Dec'});

export const checkoutStoreView = {
  getCheckoutStage,
  getIsReviewStage,
  getShippingMethods,
  getDefaultShippingMethod,
  getGiftWrapOptions,
  getDefaultGiftWrapOption,
  getPickupValues,
  getPickupAltValues,
  isPickupAlt,
  getShippingDestinationValues,
  getShippingFormValues,
  getBillingValues,
  getIsAddGiftCardEnabled,
  getGiftCards,
  getAvailableGiftCards,
  getCreditCardExpirationOptionMap,
  getShippingMethodValues,
  getGiftWrappingValues,
  getSelectedGiftWrapDetails,
  getSelectedShippingMethodDetails,
  isExpressCheckout,
  isLoading,
  getIsPaypalPaymentInProgress,
  getPaypalPaymentSettings,
  getIsPaypalMethodSelected,
  getIsPaymentDisabled,
  getIsAbandonPaypal,
  getIsShippingRequired,
  isCouponFormEnabled,
  getIsRemoveGiftCardEnabled,
  isGiftOptionsEnabled,
  getInitialPickupSectionValues,
  getInitialShippingSectionValues,
  getInitialBillingSectionValues,
  getInitialReviewSectionValues,
  getIsPLCCPaymentEnabled,
  getMaxGiftCards,
  getIsLoadingShippingMethods,
  getAlertMessage,
  getInitPayPalPayment,
  getIsInactivePayment,

  // for checkout there might be disabled options (like PLCC on CA) so we need to filter them out
  // FIXME: move this filtering to abstractor/reducer, we shouldn't filter on layout
  getDetailedCreditCardsBook,
  getCreditCardsBook,
  getDefaultPaymentMethod,
  getIsEditingSubform,
  getIsSkipPaypalEnabled,
  getIsBillingVisited,

  getInternationalCheckoutUrl,
  getInternationalCheckoutApiUrl,
  getInternationalCheckoutCommUrl
};

export {ACCEPTED_CREDIT_CARDS};

function getInitialPickupSectionValues (state) {
  let userContactInfo = userStoreView.getUserContactInfo(state);
  // values (if any) entered previously in the checkout process,
  // or reported as checkout defaults by backend
  let pickupValues = getPickupValues(state);

  return {
    pickUpContact: {
      firstName: pickupValues.firstName || userContactInfo.firstName,
      lastName: pickupValues.lastName || userContactInfo.lastName,
      emailAddress: pickupValues.emailAddress || userContactInfo.emailAddress,
      phoneNumber: pickupValues.phoneNumber || userContactInfo.phoneNumber
    },
    hasAlternatePickup: isPickupAlt(state),
    pickUpAlternate: isPickupAlt(state) ? getPickupAltValues(state) : {}
  };
}

function getInitialShippingSectionValues (state) {
  // values (if any) entered previously in the checkout process,
  // or reported as checkout defaults by backend
  let shipToValues = getShippingDestinationValues(state);
  let shippingMethodValues = getShippingMethodValues(state);
  let giftWrapValues = getGiftWrappingValues(state);

  let currentCountry = sitesAndCountriesStoreView.getCurrentCountry(state);
  let defaultShippingMethod = getDefaultShippingMethod(state);
  // the default shipping address (or undefined if none or if not in currentCountry)
  let defaultOnFileAddress = addressesStoreView.getDefaultAddress(state, currentCountry, true);
  let defaultGiftWrapOption = getDefaultGiftWrapOption(state);

  let shipTo = {saveToAccount: true, address: {country: currentCountry}};
  if (!userStoreView.isGuest(state) && addressesStoreView.getAddressByKey(state, shipToValues.onFileAddressKey)) {
    // do not populate shipTo address details if address applied to order is already in address book --- addressKey is enough
    shipTo = {...shipTo, onFileAddressKey: shipToValues.onFileAddressKey};
  } else if (shipToValues.onFileAddressKey) {
    let {onFileAddressKey, onFileAddressId, ...otherValues} = shipToValues;     // eslint-disable-line no-unused-vars
    // address applied to order but not in book -> populate address fields, but discard the onFileAddressKey, onFileAddressId:
    // recall that the form expects the onFileAddressKey to be of an address in the book, which is not the case here.
    shipTo = {...shipTo, ...otherValues};
  } else {        // no address applied to order -> use default values for user
    let pickupValues = getPickupValues(state);

    shipTo = {
      address: {
        ...shipTo.address,
        firstName: pickupValues.firstName || '',
        lastName: pickupValues.lastName || ''
      },
      saveToAccount: shipTo.saveToAccount,
      phoneNumber: pickupValues.phoneNumber || userStoreView.getUserPhone(state),
      emailAddress: pickupValues.emailAddress || userStoreView.getUserEmail(state),
      onFileAddressKey: defaultOnFileAddress && defaultOnFileAddress.addressKey,
      emailSignup: shipToValues.emailSignup
    };
  }

  shipTo.setAsDefault = !defaultOnFileAddress;

  return {
    shipTo: shipTo,
    method: {
      shippingMethodId: defaultShippingMethod && defaultShippingMethod.id,
      ...shippingMethodValues  // if defined, this will override the above default values
    },
    giftWrap: {
      hasGiftWrapping: false,
      optionId: defaultGiftWrapOption && defaultGiftWrapOption.id,
      ...giftWrapValues  // if defined, this will override the above default values
    }
  };
}

function getInitialBillingSectionValues (state) {
  let currentBillingValues = checkoutStoreView.getBillingValues(state);
  let isPaypalPayment = paymentCardsStoreView.getCreditCardType(currentBillingValues.billing) === ACCEPTED_CREDIT_CARDS.PAYPAL;

  currentBillingValues = isPaypalPayment ? {} : checkoutStoreView.getBillingValues(state);

  // not the one on paymentCardsStoreView as PLCC might need to be ignored.
  // REVIEW: make paymentCardsStoreView a little better to prevent duplication of methods
  let defaultOnFileCard = getDefaultPaymentMethod(state);

  // DT-32243 - "Same As Shipping" checkbox should be checked by default
  let sameAsShipping = checkoutStoreView.getIsShippingRequired(state);
  let billingAddress = {sameAsShipping: sameAsShipping, country: sitesAndCountriesStoreView.getCurrentCountry(state)};
  // billing address details
  if (addressesStoreView.getAddressByKey(state, currentBillingValues.address && currentBillingValues.address.onFileAddressKey)) {
    // do not populate billingContact details if billing address is already in address book --- addressKey is enough
    // FIXME: for Guest user we're storing the address in the address book (why?!),
    // which makes guest billing get inside this condition and so we need to populate the address
    billingAddress = {
      ...billingAddress,
      onFileAddressKey: currentBillingValues.address.onFileAddressKey,
      ...currentBillingValues.address
    };
  } else if (currentBillingValues.address && currentBillingValues.address.onFileAddressKey) {
    let {onFileAddressKey, onFileAddressId, ...otherValues} = currentBillingValues.address;     // eslint-disable-line no-unused-vars
    // billing address applied to order but not in book -> populate address fields, but discard the onFileAddressKey, onFileAddressId:
    // recall that the form expects the onFileAddressKey to be of an address in the book, which is not the case here.
    billingAddress = {...billingAddress, ...otherValues};
  } else {        // no billing address applied to order -> use default values for user
    billingAddress = {
      ...billingAddress,
      ...currentBillingValues.address, // if user is guest we need the details
      sameAsShipping
    };
  }

  // card details
  let cardDetails = {expMonth: '', expYear: ''};

  // not the method on paymentCardsStoreView as PLCC might need to be ignored.
  // REVIEW: make paymentCardsStoreView a little better to prevent duplication of methods
  // FIXME: DT-32805: ticket for this, we need to clean this all up.
  // BUG: if we load a guest users on account credit card the billing page will not have billing info, condition enters into the first one.
  if (getCreditCardById(state, currentBillingValues.onFileCardId)) {
    cardDetails = {
      ...cardDetails,
      onFileCardId: currentBillingValues.onFileCardId
    };
  } else if (currentBillingValues.onFileCardId) {
    let {onFileCardId, ...otherValues} = currentBillingValues;     // eslint-disable-line no-unused-vars
    // card applied to order but not in card book -> populate card fields, but discard the onFileCardId:
    // recall that the form expects the onFileCardId to be of an card in the book, which is not the case here.
    cardDetails = {
      ...cardDetails,
      ...otherValues,
      ...otherValues.billing
    };
  } else {        // no card applied to order -> use default values for user
    cardDetails = {
      ...cardDetails,
      onFileCardId: ((!currentBillingValues.billing || !currentBillingValues.billing.cardNumber) && defaultOnFileCard && defaultOnFileCard.onFileCardId) || '', // new card does not have onFileCardId until after place order, so if the user comes back from review to billing we need to show 'add new' as preselected
      ...currentBillingValues.billing, // if user is guest we need card details
      address: billingAddress          // if user is guest we need card address details
    };
  }

  return {
    saveToAccount: true,
    address: billingAddress,
    paymentMethod: isPaypalPayment ? 'paypal' : (currentBillingValues.paymentMethod || 'creditCard'),
    ...cardDetails
  };
}

function getInitialReviewSectionValues (state) {
  return {
    hasAlternatePickup: isPickupAlt(state),
    pickUpAlternate: isPickupAlt(state) ? getPickupAltValues(state) : {},
    method: getShippingMethodValues(state),
    giftWrap: getGiftWrappingValues(state)
  };
}

function isExpressCheckout (state) {
  return userStoreView.isExpressEligible(state);
}

function isLoading (state) {
  return state.checkout.uiFlags.isLoading;
}

function getCheckoutStage (state) {
  return state.checkout.uiFlags.stage;
}

function isGiftOptionsEnabled (state) {
  return state.checkout.uiFlags.isGiftOptionsEnabled;
}

function getIsPLCCPaymentEnabled (state) {
  return state.checkout.uiFlags.isPLCCPaymentEnabled;
}

function getIsLoadingShippingMethods (state) {
  return state.checkout.uiFlags.isLoadingShippingMethods;
}

function getMaxGiftCards (state) {
  return state.checkout.uiFlags.maxGiftCards;
}

function isCouponFormEnabled (state) {
  return getCheckoutStage(state) !== CHECKOUT_STAGES.REVIEW || isExpressCheckout(state);
}

function getIsReviewStage (state) {
  return getCheckoutStage(state) === CHECKOUT_STAGES.REVIEW;
}

function getShippingMethodValues (state) {
  return state.checkout.values.shipping.method;
}

function getSelectedShippingMethodDetails (state) {
  let selectedShippingMethodId = getShippingMethodValues(state).shippingMethodId;
  return getShippingMethods(state).find((method) => method.id === selectedShippingMethodId);
}

function getShippingMethods (state) {
  return state.checkout.options.shippingMethods;
}

function getDefaultShippingMethod (state) {
  return state.checkout.options.shippingMethods.find((method) => method.isDefault);
}

function getGiftWrappingValues (state) {
  return state.checkout.values.giftWrap;
}

function getGiftWrapOptions (state) {
  return state.checkout.options.giftWrapOptions;
}

function getDefaultGiftWrapOption (state) {
  return state.checkout.options.giftWrapOptions[0] && state.checkout.options.giftWrapOptions[0];
}

function getSelectedGiftWrapDetails (state) {
  let selectedGiftWrapValues = checkoutStoreView.getGiftWrappingValues(state);
  let selectedOptionData = checkoutStoreView.getGiftWrapOptions(state).find(
    (option) => option.id === selectedGiftWrapValues.optionId
  );
  return {...selectedGiftWrapValues, ...selectedOptionData};
}

function getPickupValues (state) {
  return state.checkout.values.pickUpContact;
}

function getPickupAltValues (state) {
  return state.checkout.values.pickUpAlternative;
}

function isPickupAlt (state) {
  return state.checkout.values.pickUpAlternative && !!state.checkout.values.pickUpAlternative.firstName;
}

function getShippingDestinationValues (state) {
  let {method, emailAddress, ...result} = state.checkout.values.shipping;     // eslint-disable-line no-unused-vars
  // For shipping address when user logged-in, override email address that of user.
  // When user is guest, keep the address he specified in shipping section.
  emailAddress = userStoreView.getUserEmail(state) || emailAddress;
  return {
    emailAddress,
    ...result
  };
}

function getShippingFormValues (state) {
  let shipping = state.form.checkoutShipping ? state.form.checkoutShipping.values.shipTo : {};

  if (shipping.onFileAddressKey) {
    return addressesStoreView.getAddressByKey(state, shipping.onFileAddressKey) || shipping;
  }

  return shipping;
}

function getBillingValues (state) {
  return state.checkout.values.billing;
}

function getIsAddGiftCardEnabled (state) {
  let activeStep = getCheckoutStage(state);
  return (activeStep !== CHECKOUT_STAGES.REVIEW || isExpressCheckout(state)) && !getIsPaymentDisabled(state) && getGiftCards(state).length < getMaxGiftCards(state);
}

function getIsRemoveGiftCardEnabled (state) {
  return getCheckoutStage(state) !== CHECKOUT_STAGES.REVIEW || isExpressCheckout(state);
}

function getGiftCards (state) {
  return state.checkout.values.giftCards || [];
}

// FIXME: standardize how we store account gift cards and checkout applied gift cards
function getAvailableGiftCards (state) {
  let giftCards = paymentCardsStoreView.getDetailedGiftCardsBook(state);
  let appliedGiftCards = getGiftCards(state);

  return giftCards.filter((availableGiftCard) => {
    return !appliedGiftCards.find((appliedGiftCard) => availableGiftCard.onFileCardId === appliedGiftCard.onFileCardId);
  });
}

function getCreditCardExpirationOptionMap () {
  let expMonthOptionsMap = [
    {id: '1', displayName: MONTH_SHORT_FORMAT.JAN},
    {id: '2', displayName: MONTH_SHORT_FORMAT.FEB},
    {id: '3', displayName: MONTH_SHORT_FORMAT.MAR},
    {id: '4', displayName: MONTH_SHORT_FORMAT.APR},
    {id: '5', displayName: MONTH_SHORT_FORMAT.MAY},
    {id: '6', displayName: MONTH_SHORT_FORMAT.JUN},
    {id: '7', displayName: MONTH_SHORT_FORMAT.JUL},
    {id: '8', displayName: MONTH_SHORT_FORMAT.AUG},
    {id: '9', displayName: MONTH_SHORT_FORMAT.SEP},
    {id: '10', displayName: MONTH_SHORT_FORMAT.OCT},
    {id: '11', displayName: MONTH_SHORT_FORMAT.NOV},
    {id: '12', displayName: MONTH_SHORT_FORMAT.DEC}];

  let expYearOptionsMap = [];
  let nowYear = (new Date()).getFullYear();

  for (let i = nowYear; i < nowYear + 11; i++) {
    expYearOptionsMap.push({id: i.toString(), displayName: i.toString()});
  }

  return {
    monthsMap: expMonthOptionsMap,
    yearsMap: expYearOptionsMap
  };
}

function getIsPaypalPaymentInProgress (state) {
  return state.checkout.uiFlags.isPaypalPaymentInProgress;
}

function getPaypalPaymentSettings (state) {
  return state.checkout.options.paypalPaymentSettings;
}

function getIsPaypalMethodSelected (state) {
  // not the form value, the stored value
  try {
    return state.form.checkoutBilling.values.paymentMethod === 'paypal' && !getIsPaymentDisabled(state);
  } catch (ex) {
    // nothing stored, so not paypal
    return false;
  }
}

// user may skip paypal payment if paypal was already selected
function getIsSkipPaypalEnabled (state) {
  return state.checkout.values.billing.paymentMethod === 'paypal';
}

// FIXME: hacky
function getIsAbandonPaypal (state) {
  try {
    return state.checkout.values.billing.paymentMethod === 'paypal' && state.form.checkoutBilling.values.paymentMethod !== 'paypal';
  } catch (ex) {
    // nothing stored, so not paypal
    return false;
  }
}

function getIsPaymentDisabled (state) {
  let grandTotal = state.cart.summary.grandTotal;
  let giftCardsTotal = state.cart.summary.giftCardsTotal;
  return grandTotal <= giftCardsTotal;
}

function getIsShippingRequired (state) {
  return cartStoreView.getIsOrderHasShipping(state);
}

function getCreditCardsBook (state) {
  let creditCardsBook = paymentCardsStoreView.getCreditCardsBook(state);

  if (creditCardsBook && creditCardsBook.length && !getIsPLCCPaymentEnabled(state)) {
    return creditCardsBook.filter((card) => card.cardType !== ACCEPTED_CREDIT_CARDS['PLACE CARD']);
  } else {
    return creditCardsBook;
  }
}

function getDetailedCreditCardsBook (state) {
  let creditCardsBook = paymentCardsStoreView.getDetailedCreditCardsBook(state);

  if (creditCardsBook && creditCardsBook.length && !getIsPLCCPaymentEnabled(state)) {
    return creditCardsBook.filter((card) => card.cardType !== ACCEPTED_CREDIT_CARDS['PLACE CARD']);
  } else {
    return creditCardsBook;
  }
}

function getDefaultPaymentMethod (state) {
  let creditCardsBook = getCreditCardsBook(state);
  let defaultCard = (creditCardsBook && creditCardsBook.length) ? creditCardsBook.find((card) => card.isDefault) : null;

  if (!defaultCard && creditCardsBook && creditCardsBook.length) {
    defaultCard = creditCardsBook[0];
  }

  return defaultCard;
}

function getCreditCardById (state, id) {
  let creditCardsBook = getCreditCardsBook(state);
  return (creditCardsBook && creditCardsBook.length) ? creditCardsBook.find((card) => card.onFileCardId === id) : null;
}

function getIsEditingSubform (state) {
  return state.checkout.uiFlags.isEditingSubform;
}

function getIsBillingVisited (state) {
  return state.checkout.uiFlags.isBillingVisited;
}

function getInternationalCheckoutUrl (state) {
  return state.checkout.options.internationalUrl;
}

function getInternationalCheckoutApiUrl (state) {
  return routingInfoStoreView.getApiHelper(state).configOptions.apiKeys.BORDERS_FREE;
}

function getInternationalCheckoutCommUrl (state) {
  return routingInfoStoreView.getApiHelper(state).configOptions.apiKeys.BORDERS_FREE_COMM;
}

function getAlertMessage (state) {
  return state.checkout.uiFlags.alertMessage;
}

function getInitPayPalPayment (state) {
  return state.checkout.uiFlags.initPayPalPayment;
}

function getIsInactivePayment (state) {
  return state.checkout.uiFlags.isInactivePayment;
}
