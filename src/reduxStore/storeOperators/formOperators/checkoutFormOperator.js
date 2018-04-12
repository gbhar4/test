import {logErrorAndServerThrow, getSubmissionError} from '../operatorHelper';
import {getAccountAbstractor} from 'service/accountServiceAbstractor';
// import {formValueSelector} from 'redux-form';

import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {getUserAbstractor} from 'service/userServiceAbstractor';

import {getCheckoutAbstractor} from 'service/checkoutServiceAbstractor';

import {getVendorAbstractors} from 'service/vendorServiceAbstractor.js';

import {addressesStoreView} from 'reduxStore/storeViews/addressesStoreView';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {paymentCardsStoreView} from 'reduxStore/storeViews/paymentCardsStoreView';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView';
import {userStoreView} from 'reduxStore/storeViews/userStoreView.js';

import {getCartOperator} from '../cartOperator';
import {getCheckoutOperator} from '../checkoutOperator';
import {getPickupOperator} from '../pickupOperator';
import {getAddressesOperator} from '../addressesOperator';
import {getPlccOperator} from '../plccOperator';
import {getUserOperator} from 'reduxStore/storeOperators/userOperator.js';
import {getCheckoutSignalsOperator} from 'reduxStore/storeOperators/uiSignals/checkoutSignalsOperator';
import {PAGES} from 'routing/routes/pages';

import {
  CHECKOUT_STAGES, getSetIsPaypalPaymentSettings, getSetIsPaypalPaymentInProgress, getSetIsBillingVisitedActn, getSetIsInactivePaymentActn
} from 'reduxStore/storeReducersAndActions/checkout/checkout';
import {getSetOrderConfirmationActn} from 'reduxStore/storeReducersAndActions/confirmation/confirmation';
import {routingStoreView} from 'reduxStore/storeViews/routing/routingStoreView.js';
import {getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator.js';
import {change as formChange} from 'redux-form';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView.js';
import {getSetIsLoadedActn as getSetIsPromosLoadedActn} from 'reduxStore/storeReducersAndActions/couponsAndPromos/couponsAndPromos';
import {getPaymentCardsOperator} from 'reduxStore/storeOperators/paymentCardsOperator.js';
import {RECOMMENDATIONS_SECTIONS, getProductsOperator} from 'reduxStore/storeOperators/productsOperator';

import {
  getSetAirmilesPromoIdActn,
  getSetAirmilesAccountActn
} from 'reduxStore/storeReducersAndActions/user/user';

let previous = null;
export function getCheckoutFormOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new CheckoutFormOperator(store);
  }
  return previous;
}

class CheckoutFormOperator {
  constructor (store) {
    this.store = store;
    bindAllClassMethodsToThis(this);
  }

  get accountServiceAbstractor () {
    return getAccountAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  get userServiceAbstractor () {
    return getUserAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  get vendorServiceAbstractors () {
    return getVendorAbstractors(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  get checkoutServiceAbstractor () {
    return getCheckoutAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  submitAirmilesData (formData) {
    let state = this.store.getState();
    let orderId = cartStoreView.getCurrentOrderId(state);
    let {promoId, accountNumber} = formData;

    return this.checkoutServiceAbstractor.updateAirMilesInfo(orderId, promoId, accountNumber).then(() => {
      this.store.dispatch([
        getSetAirmilesPromoIdActn(promoId),
        getSetAirmilesAccountActn(accountNumber)
      ]);
    });
  }

  forcePaypalPaymentMethod () {
    this.store.dispatch(formChange('checkoutBilling', 'paymentMethod', 'paypal'));
  }

  forceCreditCardPaymentMethod () {
    this.store.dispatch(formChange('checkoutBilling', 'paymentMethod', 'creditCard'));
  }

  submitOrderForProcessing (formData) {
    // TODO: as per ben we are not going to send the orderId;
    let state = this.store.getState();
    let orderId = cartStoreView.getCurrentOrderId(state);

    let _submitOrderForProcessing = () => {
      // return reviewOrder().then((res) => {
      return this.checkoutServiceAbstractor.submitOrder(orderId).then((r) => {
        let cartItems = cartStoreView.getCartItems(state);
        let vendorId = cartItems.length && cartItems[0].miscInfo.vendorColorDisplayId;

        this.store.dispatch([
          getSetIsPromosLoadedActn(false), // invalidate coupons cache so that the next time drawer opens we show new promos
          getSetOrderConfirmationActn(r)
        ]);

        getCheckoutSignalsOperator(this.store).moveToStage(CHECKOUT_STAGES.CONFIRMATION);
        getCartOperator(this.store).clearCart();
        getProductsOperator(this.store).loadProductRecommendations(RECOMMENDATIONS_SECTIONS.CHECKOUT, vendorId);
      });
    };

    let pendingPromises = [];
    if (checkoutStoreView.isExpressCheckout(state)) {       // if express checkout
      let {billing, hasAlternatePickup, pickUpAlternate} = formData; // /* giftWrap, disabled */

      if (hasAlternatePickup) {     // user specified an alternate pickup person
        pendingPromises.push(getPickupOperator(this.store).addContact(
          // the main pickup person info comes from the values already in the form
          {...checkoutStoreView.getPickupValues(state),
            alternateEmail: pickUpAlternate.emailAddress,
            alternateFirstName: pickUpAlternate.firstName,
            alternateLastName: pickUpAlternate.lastName
          }
        ));
      }

      let giftWrapPromise = Promise.resolve();

      /* NOTE: DT-19417: Gift Wrapping option no longer available for Express User on review page (backend does not support it)
       * I guess this needs to be re-enabled once backend fixes the services.
      if (giftWrap && giftWrap.hasGiftWrapping) {       // user specified gift wrapping
        // pendingPromises.push(this.checkoutServiceAbstractor.addGiftWrappingOption(giftWrap.message, giftWrap.optionId));
        giftWrapPromise = this.checkoutServiceAbstractor.addGiftWrappingOption(giftWrap.message, giftWrap.optionId);
      } else if (checkoutStoreView.getGiftWrappingValues(state).optionId) {
        // pendingPromises.push(this.checkoutServiceAbstractor.removeGiftWrappingOption()); // remove existing gift wrap (if any)
        giftWrapPromise = this.checkoutServiceAbstractor.removeGiftWrappingOption();
      }
      */

      if (billing && billing.cvv) {      // PLCC does not require CVV -> billing = null. User entered a cvv for a credit card
        // submit CVV
        let billingDetails = checkoutStoreView.getBillingValues(state);
        pendingPromises.push(giftWrapPromise.then(() => {
          return this.checkoutServiceAbstractor.updatePaymentOnOrder({
            // for some odd reason backend want this info
            orderGrandTotal: cartStoreView.getGrandTotal(state),
            monthExpire: billingDetails.billing.expMonth,
            yearExpire: billingDetails.billing.expYear,
            cardType: billingDetails.billing.cardType,
            cardNumber: billingDetails.billing.cardNumber,
            paymentId: billingDetails.paymentId,
            cvv: billing.cvv      // the cvv entered by the user
          });
        }));
      }
    }

    return Promise.all(pendingPromises)
    .then(() => _submitOrderForProcessing())
    .catch((err) => { throw getSubmissionError(this.store, 'submitExpressCheckoutSection', err); });
  }

  initPaypalCheckout () {
    let state = this.store.getState();
    let isRememberedUser = userStoreView.isRemembered(state);

    // change in requirement because of lack of backend support
    // for registered user we need to force the user to login
    if (isRememberedUser) {
      return new Promise((resolve, reject) => {
        getGlobalSignalsOperator(this.store).openAuthLoginModal(() => {
          // callback for on successfull login
          this.initPaypalCheckout().then(resolve).catch(reject);
        });
      });
    }

    let orderId = cartStoreView.getCurrentOrderId(state);
    let fromPage = routingStoreView.getCurrentPageId(state) !== PAGES.checkout.id ? 'AjaxOrderItemDisplayView' : 'OrderBillingView';

    return this.vendorServiceAbstractors.startPaypalCheckout(orderId, fromPage).then((res) => {
      this.store.dispatch([
        getSetIsPaypalPaymentSettings(res),
        getSetIsPaypalPaymentInProgress(true)
      ]);
    }).catch((err) => {
      throw getSubmissionError(this.store, 'startPaypalCheckout', err);
    });
  }

  abandonPaypalCheckout () {
    this.store.dispatch([
      getSetIsPaypalPaymentSettings(null),
      getSetIsPaypalPaymentInProgress(false)
    ]);
  }

  submitOrderForReview () {
    return this.checkoutServiceAbstractor.reviewOrder();
  }

  applyGiftCardToOrder (formData) {
    return applyGiftCardToOrder(this.store, formData, this.checkoutServiceAbstractor);
  }

  applyExistingGiftCardToOrder (cardId) {
    let storeState = this.store.getState();
    let giftCard = paymentCardsStoreView.getDetailedGiftCardById(storeState, cardId);

    let requestData = {
      creditCardId: giftCard.onFileCardId,
      billingAddressId: giftCard.billingAddressId,
      orderGrandTotal: cartStoreView.getGrandTotal(storeState),
      cardNumber: giftCard.cardNumber,
      cardPin: giftCard.cardPin,
      balance: giftCard.balance
    };

    return this.checkoutServiceAbstractor.addGiftCardPaymentToOrder(requestData).then(() => {
      return getCheckoutOperator(this.store).loadUpdatedCheckoutValues(false, false, true);
    }).catch((err) => {
      throw getSubmissionError(this.store, 'startPaypalCheckout', err);
    });
  }

  removeGiftCardFromOrder (paymentId) {
    return removeGiftCardFromOrder(this.store, paymentId, this.checkoutServiceAbstractor);
  }

  submitPickupSection (formData) {
    let pickupOperator = getPickupOperator(this.store);
    let storeState = this.store.getState();

    let pendingPromises = [];
    if (formData.pickUpContact.emailSignup && formData.pickUpContact.emailAddress) {
      pendingPromises.push(this.userServiceAbstractor.validateAndSubmitEmailSignup(formData.pickUpContact.emailAddress));
    }
    pendingPromises.push(pickupOperator.addContact({
      firstName: formData.pickUpContact.firstName,
      lastName: formData.pickUpContact.lastName,
      phoneNumber: formData.pickUpContact.phoneNumber,
      emailAddress: formData.pickUpContact.emailAddress || (!userStoreView.isGuest(storeState) ? userStoreView.getUserEmail(storeState) : ''),
      alternateEmail: (formData.hasAlternatePickup && formData.pickUpAlternate) ? formData.pickUpAlternate.emailAddress : '',
      alternateFirstName: (formData.hasAlternatePickup && formData.pickUpAlternate) ? formData.pickUpAlternate.firstName : '',
      alternateLastName: (formData.hasAlternatePickup && formData.pickUpAlternate) ? formData.pickUpAlternate.lastName : ''
    }));

    return Promise.all(pendingPromises)
    .then(() => {
      return getCheckoutOperator(this.store).loadUpdatedCheckoutValues(false, true, true);
    }).catch((err) => {
      throw getSubmissionError(this.store, 'submitPickupSection', err);
    });
  }

  submitShippingMethod (shippingMethodId) {
    // silent method, if it fails, it would not notify the user
    // (as a 2nd attempt will happen on the full submit)
    return submitShippingMethod(this.store, shippingMethodId, this.checkoutServiceAbstractor);
  }

  submitShippingSection (formData) {
    if (formData.shipTo.onFileAddressKey) {
      return submitShippingSection(this.store, this.checkoutServiceAbstractor, this.userServiceAbstractor, formData);
    } else {
      return getAddressesOperator(this.store).submitWithOptionalVerifyAddressModal(
        'checkoutShipping', 'shipTo', formData, submitShippingSection.bind(null, this.store, this.checkoutServiceAbstractor, this.userServiceAbstractor));
    }
  }

  submitBillingSection (formData) {
    return submitBillingSection(this.store, formData, this.isAddressValidationDisabled, this.checkoutServiceAbstractor, this.accountServiceAbstractor);
  }

  skipPaypalPayment () {
    // DT-19032: if user already selected paypal and the store already has all the paypal data,
    // we can move to review without going thru paypal again
    // REVIEW: I guess we need a more generic approach to identify when a step may be skipped.
    getCheckoutSignalsOperator(this.store).moveToStage(CHECKOUT_STAGES.REVIEW);
  }

  // FIXME: proxy to accountFormOperator, it's not part of checkout (except for the "same as shipping" checkbox)
  submitNewAccountCard (formData) {
    return submitNewAccountCard(this.store, formData);
  }
}

function submitShippingSection (store, checkoutServiceAbstractor, userServiceAbstractor, formData) {
  let {giftWrap, method,
    shipTo: {onFileAddressKey, address, setAsDefault, phoneNumber, emailAddress, saveToAccount, emailSignup}
  } = formData;
  let storeState = store.getState();

  if (!emailAddress || !userStoreView.isGuest(storeState)) {
    // on registered user entering a new address the email field is not visible -> emailAddress = null
    emailAddress = userStoreView.getUserEmail(storeState);
  }

  let pendingPromises = [
    // add the requested gift wrap options
    giftWrap.hasGiftWrapping && checkoutServiceAbstractor.addGiftWrappingOption(giftWrap.message, giftWrap.optionId),
    // remove old gift wrap option (if any)
    !giftWrap.hasGiftWrapping && checkoutStoreView.getGiftWrappingValues(storeState).optionId && checkoutServiceAbstractor.removeGiftWrappingOption(),
    // sign up to receive meil newsletter
    emailSignup && emailAddress && userServiceAbstractor.validateAndSubmitEmailSignup(emailAddress)
  ];

  let addressesOperator = getAddressesOperator(store);
  let addOrEditAddressPromise;
  if (userStoreView.isGuest(storeState)) {
    let oldShippingDestination = checkoutStoreView.getShippingDestinationValues(storeState);
    if (!oldShippingDestination.onFileAddressKey) {     // guest user that is using a new address
      addOrEditAddressPromise = addressesOperator.addAddress({address, phoneNumber, emailAddress}, {}, false);
    } else {        // guest user is editing a previously entered shipping address
      addOrEditAddressPromise = addressesOperator.updateAddress(
        {address, phoneNumber, emailAddress, addressKey: oldShippingDestination.onFileAddressKey}, {}, false
      );
    }
  } else {          // registered user
    if (onFileAddressKey) {      // registered user using an existing on file address
      // no need to add or edit an address, so addOrEditAddressPromise immediately resolves
      // to a value that simulates adding or editing an address that returns the selected adddress id
      let selectedAddressBookEntry = addressesStoreView.getAddressByKey(store.getState(), onFileAddressKey);
      addOrEditAddressPromise = Promise.resolve({addressId: selectedAddressBookEntry.addressId});
    } else {      // registered user that has entered a new address (null value in the addresses dropdown)
      let oldShippingDestination = checkoutStoreView.getShippingDestinationValues(storeState);

      // Note: refer to comments in addressesOperator.addAddress on why addressKey is required in here
      let oldSelectedAddressBookEntry = addressesStoreView.getAddressByKey(store.getState(), oldShippingDestination.onFileAddressKey);
      addOrEditAddressPromise = addressesOperator.addAddress(
        {address, phoneNumber, emailAddress, addressKey: !oldSelectedAddressBookEntry ? oldShippingDestination.onFileAddressKey : null},
        {isDefault: setAsDefault, saveToAccount: saveToAccount},
        true      // add to address book inside redux-store
      );
    }
  }

  return Promise.all(pendingPromises)
  .then(() => {
    return addOrEditAddressPromise
    .then((res) => {
      return checkoutServiceAbstractor.setShippingMethodAndAddressId(method.shippingMethodId, res.addressId, generalStoreView.getIsPrescreenFormEnabled(storeState) && !giftWrap.hasGiftWrapping && !userStoreView.getUserIsPlcc(storeState));
    })
    .then((res) => {
      return getPlccOperator(store).optionalPlccOfferModal(res.plccEligible, res.prescreenCode).then(() => {
        // REVIEW: the true indicates to load the reward data for user.
        // But how can the reward points change here?
        return getCheckoutOperator(store).loadUpdatedCheckoutValues(true, false, true);
      });
    });
  })
  .catch((err) => {
    throw getSubmissionError(store, 'submitShippingSection', err);
  });
}

// This is used as an onChange event when the user selects a new radio button shipping method
function submitShippingMethod (store, shippingMethodId, checkoutServiceAbstractor) {
  let state = store.getState();
  let valuesDestinationAddressId = checkoutStoreView.getShippingDestinationValues(state).onFileAddressId;
  let valuesShippingMethod = checkoutStoreView.getShippingMethodValues(state);

  if (!valuesShippingMethod) {
    return; // nothing to do, nothing on the form yet (or bopis only)
  }

  let valuesShippingMethodId = valuesShippingMethod.shippingMethodId;

  if (shippingMethodId === valuesShippingMethodId) return;     // nothing to do --- already applied to order

  // FIXME: why do we call this only if we have addresid? don't we want to always update ledger?
  if (shippingMethodId && valuesDestinationAddressId) {
    checkoutServiceAbstractor.setShippingMethodAndAddressId(shippingMethodId, valuesDestinationAddressId, false)
    .then((res) => {
      return getPlccOperator(store).optionalPlccOfferModal(res.plccEligible, res.prescreenCode).then(() => {
        return getCheckoutOperator(store).loadUpdatedCheckoutValues(false, false, true);
      });
    });
  }
}

// ---------------- NOTE: code below this line needs refactoring/rewriting  ---------- //

function removeGiftCardFromOrder (store, paymentId, checkoutServiceAbstractor) {
  return checkoutServiceAbstractor.removeGiftCard(paymentId).then((res) => {
    return getCheckoutOperator(store).loadUpdatedCheckoutValues(false, false, true);
  }).catch((err) => {
    logErrorAndServerThrow(store, 'removeGiftCardFromOrder', err);
  });
}

function applyGiftCardToOrder (store, formData, checkoutServiceAbstractor) {
  let requestData = {
    giftcardAccountNumber: formData.cardNumber,
    giftcardPin: formData.cardPin,
    billingAddressId: null,                // TODO: storeview.getCurrentBillingOnOrder - - - - MIGHT NOT BE AVAILABLE, WHY DOES IT NEED IT? WHERE IS THE CAPTCHA VALUE?
    recaptchaToken: formData.recaptchaToken,
    saveToAccount: formData.saveToAccount
  };

  return checkoutServiceAbstractor.addGiftCard(requestData).then((res) => {
    return Promise.all([
      getPaymentCardsOperator(store).loadCreditCardsOnAccount(),
      getCheckoutOperator(store).loadUpdatedCheckoutValues(false, false, true)
    ]);
  }).catch((err) => {
    throw getSubmissionError(store, 'applyGiftCardToOrder', err);
  });
}

// FIXME: refactor this code to work the same was as submitShippingSection
function submitBillingSectionSuccess (store, formData, checkoutServiceAbstractor, accountServiceAbstractor) {

  let submitPaymentInformation = (res) => {
    if (formData.onFileCardId) {
      let cardDetails = paymentCardsStoreView.getDetailedCreditCardById(store.getState(), formData.onFileCardId);

      let requestData = {
        onFileCardId: formData.onFileCardId,
        cardNumber: cardDetails.cardNumber,
        billingAddressId: cardDetails.billingAddressId,
        cardType: cardDetails.cardType,
        cvv: formData.cvv,
        monthExpire: cardDetails.expMonth,
        yearExpire: cardDetails.expYear,
        orderGrandTotal: cartStoreView.getGrandTotal(store.getState()),
        setAsDefault: formData.setAsDefault || cardDetails.isDefault,
        saveToAccount: !userStoreView.isGuest(store.getState()), // it's already on the account? why is this needed?
        applyToOrder: true
      };

      // FIXME: we need to store the details of the selected card and selected
      // address book entry, but like this it is pretty ugly. needs major cleanup
      return checkoutServiceAbstractor.addPaymentToOrder(requestData).then((res) => {
        // FIXME: uncomment this when billing mellisa is enabled
        // store.dispatch([
        //   getClearAddressPendingSuggestion(),
        //   getSetCheckoutStageActn('review')
        // ]);
        updatePaymentToActiveOnSubmitBilling(store);
        getUserOperator(store).setRewardPointsData();
        return getCheckoutOperator(store).loadUpdatedCheckoutValues(false, true, true); // REVIEW: backend wants an additional parameter ONLY when user moves from billing to review (DT-26588)

        // FIXME: change flag from estimated to non-estimated
      });
    } else {
      let cardType = paymentCardsStoreView.getCreditCardType(formData);
      let checkoutDetails = checkoutStoreView.getBillingValues(store.getState());
      let editingCardType = checkoutDetails.billing ? paymentCardsStoreView.getCreditCardType(checkoutDetails.billing) : '';

      let requestData = {
        cardNumber: formData.cardNumber,
        billingAddressId: res.addressId,
        cardType: (cardType || editingCardType),
        cvv: formData.cvv,
        monthExpire: formData.expMonth,
        yearExpire: formData.expYear,
        orderGrandTotal: cartStoreView.getGrandTotal(store.getState()),
        setAsDefault: formData.setAsDefault,
        saveToAccount: !userStoreView.isGuest(store.getState()) && formData.saveToAccount,
        applyToOrder: true
      };

      let addOrEditPaymentToOrder = checkoutServiceAbstractor.addPaymentToOrder;

      // if it's a new card (no '*' in it) then we still need to call the addPayment instead of updatePayment service
      if (checkoutDetails.paymentId && formData.cardNumber && formData.cardNumber.substr(0, 1) === '*') {
        requestData.paymentId = checkoutDetails.paymentId;
        addOrEditPaymentToOrder = checkoutServiceAbstractor.updatePaymentOnOrder;
      }

      return addOrEditPaymentToOrder(requestData).then((res) => {
        updatePaymentToActiveOnSubmitBilling(store);
        getUserOperator(store).setRewardPointsData();
        return getCheckoutOperator(store).loadUpdatedCheckoutValues(false, true, true);
        // FIXME: change flag from estimated to non-estimated
      });
    }
  };

  store.dispatch(getSetIsBillingVisitedActn(true));       // flag that billing section was visited by the user

  // nothing to do (gift cards cover total) - move to review
  let storeState = store.getState();
  if (checkoutStoreView.getIsPaymentDisabled(storeState)) {
    return true;
  }

  if (formData.address.sameAsShipping) {
    let shippingDetails = checkoutStoreView.getShippingDestinationValues(storeState);

    return accountServiceAbstractor.applyBillingAddress({
      addressKey: shippingDetails.onFileAddressKey,
      addressId: shippingDetails.onFileAddressId
    }).then(submitPaymentInformation).catch((err) => {
      throw getSubmissionError(store, 'submitBillingSection', err);
    });
  } else if (formData.onFileCardId) {
    let storeState = store.getState();
    let cardDetails = paymentCardsStoreView.getDetailedCreditCardById(storeState, formData.onFileCardId);

    return accountServiceAbstractor.applyBillingAddress({
      addressKey: cardDetails.addressKey,
      addressId: cardDetails.addressId || cardDetails.billingAddressId
    }).then(submitPaymentInformation).catch((err) => {
      throw getSubmissionError(store, 'submitBillingSection', err);
    });
  } else if (formData.address.onFileAddressKey && !userStoreView.isGuest(storeState)) {
    // return submitPaymentInformation({addressId: formData.address.onFileAddressKey});
    let existingAddress = addressesStoreView.getAddressByKey(storeState, formData.address.onFileAddressKey);
    let addressId = existingAddress
      ? existingAddress.addressId
      : checkoutStoreView.getShippingDestinationValues(storeState).onFileAddressId;
    return accountServiceAbstractor.applyBillingAddress({
      addressKey: formData.address.onFileAddressKey,
      addressId: addressId
    }).then(submitPaymentInformation).catch((err) => {
      throw getSubmissionError(store, 'submitBillingSection', err);
    });
  } else if (formData.address.onFileAddressKey && userStoreView.isGuest(storeState)) {
    // send update
    let existingAddress = addressesStoreView.getAddressByKey(storeState, formData.address.onFileAddressKey);
    let addressId = existingAddress
      ? existingAddress.addressId
      : checkoutStoreView.getShippingDestinationValues(storeState).onFileAddressId;

    return getAddressesOperator(store).updateAddress({
      address: formData.address,
      phoneNumber: formData.phoneNumber,
      addressKey: formData.address.onFileAddressKey,
      addressId: addressId
    }, {
      isDefault: formData.isDefault,
      saveToAccount: false,
      applyToOrder: true
    }, false).then(submitPaymentInformation).catch((err) => {
      throw getSubmissionError(store, 'submitBillingSection', err);
    });
  } else {
    return getAddressesOperator(store).addAddress({
      address: formData.address,
      phoneNumber: formData.phoneNumber
    }, {
      isDefault: formData.isDefault,
      saveToAccount: !userStoreView.isGuest(storeState) && formData.saveToAccount,
      applyToOrder: true
    }, true).then(submitPaymentInformation).catch((err) => {
      throw getSubmissionError(store, 'submitBillingSection', err);
    });
  }
}

function submitBillingSection (store, formData, isAddressValidationDisabled, checkoutServiceAbstractor, accountServiceAbstractor) {
  return submitBillingSectionSuccess(store, formData, checkoutServiceAbstractor, accountServiceAbstractor);

  // FIXME: uncomment this when billing mellisa is enabled
  // let {billing: {address}} = formData;
  // if (isAddressValidationDisabled || address.sameAsShipping || formData.onFileCardId) {
  //   return submitBillingSectionSuccess(store, formData);
  // }
  //
  // return getSuggestedAddress(address).then((res) => {
  //   if (isAddressDiff(address, res)) {
  //     store.dispatch([
  //       getSaveFormDataForSubmitActn(formData),
  //       getSetAddressPendingSuggestionActn(address),
  //       getSetAddressSuggestionsActn({...address, ...res})
  //     ]);
  //     // FIXME: needs to be handled in another way, this is a patch to stop form from progressing
  //     throw {_error: 'Please Verify Your Address'};
  //   } else {
  //     return submitBillingSectionSuccess(store, formData);
  //   }
  // });
}

function submitNewAccountCard (store, formData) {
  store.dispatch([
    formChange('checkoutBilling', 'onFileCardId', ''),
    formChange('checkoutBilling', 'cardNumber', formData.cardNumber),
    formChange('checkoutBilling', 'expMonth', formData.expMonth),
    formChange('checkoutBilling', 'expYear', formData.expYear),
    formChange('checkoutBilling', 'cvv', formData.cvv),
    formChange('checkoutBilling', 'saveToAccount', formData.saveToAccount),
    formChange('checkoutBilling', 'setAsDefault', formData.setAsDefault),
    formChange('checkoutBilling', 'address.onFileAddressKey', formData.address.onFileAddressKey)
  ]);

  return Promise.resolve();
}

function updatePaymentToActiveOnSubmitBilling (store) {
  if (checkoutStoreView.getIsInactivePayment(store.getState())) {
    store.dispatch(getSetIsInactivePaymentActn(false));
  }
}
