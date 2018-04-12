import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {getSubmissionError} from '../operatorHelper';
import {getAccountAbstractor} from 'service/accountServiceAbstractor';
import {getR3Abstractor} from 'service/R3ServiceAbstractor';
import {getGeneralOperator} from 'reduxStore/storeOperators/generalOperator.js';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';
import {getRoutingOperator} from 'reduxStore/storeOperators/routingOperator.js';
import {getPaymentCardsOperator} from 'reduxStore/storeOperators/paymentCardsOperator.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {paymentCardsStoreView} from 'reduxStore/storeViews/paymentCardsStoreView';
import {addressesStoreView} from 'reduxStore/storeViews/addressesStoreView.js';
import {plccStoreView} from 'reduxStore/storeViews/plccStoreView.js';
import {getAddressesOperator} from 'reduxStore/storeOperators/addressesOperator.js';
import {userStoreView} from 'reduxStore/storeViews/userStoreView.js';
import {getSetExistingCardBalanceActn} from 'reduxStore/storeReducersAndActions/paymentCards/paymentCards';
import {ACCEPTED_CREDIT_CARDS} from 'reduxStore/storeViews/checkoutStoreView.js';

import {
  getSetCheckoutLastLookUpGiftCardBalanceActn,
  getRemoveCardInBookActn
} from 'reduxStore/storeReducersAndActions/paymentCards/paymentCards';
import Immutable from 'seamless-immutable';

export const CONFIRM_MODAL_IDS = {
  CONFIRM_DELETE_GIFT_CARD: 'paymentCardsFormOperator_delete_gc',
  CONFIRM_DELETE_CREDIT_CARD: 'paymentCardsFormOperator_delete_cc'
};

const MESSAGES = Immutable({
  ADD_CREDIT_CARD_SUCCESS: 'Your account has been updated.',
  EDIT_CREDIT_CARD_SUCCESS: 'Your account has been updated.',
  ADD_GIFT_CARD_SUCCESS: 'Gift card successfully added to your account.',
  REMOVE_PAYMENT_CARD_SUCCESS: 'Your account has been updated.'
});

let previous = null;
export function getPaymentCardsFormOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new PaymentCardsFormOperator(store);
  }
  return previous;
}

class PaymentCardsFormOperator {
  constructor (store) {
    this.store = store;
    bindAllClassMethodsToThis(this);
  }

  get accountServiceAbstractor () {
    return getAccountAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  get paymentCardsServiceAbstractor () {
    return getR3Abstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  submitAddCreditCard (formData) {
    let storeState = this.store.getState();
    let cardType = paymentCardsStoreView.getCreditCardType(formData);
    let isEmptyAccount = paymentCardsStoreView.getDetailedCreditCardsBook(storeState).length === 0;
    let addressEntry;
    let {address} = formData;

    if (formData.address.onFileAddressKey) {
      addressEntry = addressesStoreView.getAddressByKey(storeState, formData.address.onFileAddressKey);
      address = addressEntry.address;
    } else {
      address.phoneNumber = userStoreView.getUserContactInfo(storeState).phoneNumber;
    }

    let paymentInfo = {
      ...formData,
      ...address,
      isDefault: formData.isDefault || isEmptyAccount,
      addressId: addressEntry ? addressEntry.addressId : null,
      cardType: cardType,
      saveToAccount: true
    };

    return this.accountServiceAbstractor.addCreditCardDetails(paymentInfo).then((res) => {
      let generalOperator = getGeneralOperator(this.store);
      let isGuest = userStoreView.isGuest(this.store.getState());
      generalOperator.flashSuccess(MESSAGES.ADD_CREDIT_CARD_SUCCESS);

      return Promise.all([
        getAddressesOperator(this.store).loadAddressesOnAccount(),
        getPaymentCardsOperator(this.store).loadCreditCardsOnAccount().then(() => {
          getRoutingOperator(this.store).pushLocation(MY_ACCOUNT_SECTIONS.paymentAndGiftCards);
        }),
        cardType === ACCEPTED_CREDIT_CARDS['PLACE CARD'] ? generalOperator.reloadEspots(isGuest, isGuest) : null
      ]);
    }).catch((err) => {
      throw getSubmissionError(this.store, 'submitAddCreditCard', err);
    });
  }

  submitEditCreditCardForCheckout (formData) {
    return this.submitEditCreditCardWithOptionalRedirect(formData, false);
  }

  submitEditCreditCard (formData) {
    return this.submitEditCreditCardWithOptionalRedirect(formData, true);
  }

  submitEditCreditCardWithOptionalRedirect (formData, redirectToAccount) {
    let storeState = this.store.getState();
    let cardType = paymentCardsStoreView.getCreditCardType(formData);
    let addressEntry;
    let {address} = formData;

    if (formData.address.onFileAddressKey) {
      addressEntry = addressesStoreView.getAddressByKey(storeState, formData.address.onFileAddressKey);
      address = addressEntry.address;
    }

    let paymentInfo = {
      ...formData,
      ...address,
      addressId: addressEntry ? addressEntry.addressId : null,
      creditCardId: formData.onFileCardId,
      cardType: cardType
    };

    return this.accountServiceAbstractor.updateCreditCardDetails(paymentInfo).then((res) => {
      let generalOperator = getGeneralOperator(this.store);
      let isGuest = userStoreView.isGuest(this.store.getState());
      generalOperator.flashSuccess(MESSAGES.EDIT_CREDIT_CARD_SUCCESS);
      return Promise.all([
        getAddressesOperator(this.store).loadAddressesOnAccount(),
        getPaymentCardsOperator(this.store).loadCreditCardsOnAccount().then(() => {
          if (redirectToAccount) {
            getRoutingOperator(this.store).pushLocation(MY_ACCOUNT_SECTIONS.paymentAndGiftCards);
          }
        }),
        cardType === ACCEPTED_CREDIT_CARDS['PLACE CARD'] ? generalOperator.reloadEspots(isGuest, isGuest) : null
      ]);
    }).catch((err) => {
      throw getSubmissionError(this.store, 'submitEditCreditCard', err);
    });
  }

  // FIXME: this operator is not correct (missing service)
  // There are scenarios where this method is needed but the application was not filled in yet
  // (registered user that already has a plcc account but not yet linked)
  // https://projects.invisionapp.com/share/KS94EORMB#/screens/201675120
  submitPlccApplicationToAccount () {
    let formData = plccStoreView.getApplication(this.store.getState()) || {};

    let storeState = this.store.getState();
    let addressEntry;
    let address = formData.address || {};

    if (address.onFileAddressKey) {
      addressEntry = addressesStoreView.getAddressByKey(storeState, formData.address.onFileAddressKey);
      address = addressEntry.address;
    }

    let paymentInfo = {
      ...formData,
      ...address,
      addressId: addressEntry && addressEntry.addressId,
      // creditCardId: formData.onFileCardId,
      nickName: address.onFileAddressKey || (new Date()).getTime().toString(),
      saveToAccount: true
    };

    return this.accountServiceAbstractor.addCreditCardDetails(paymentInfo).catch((err) => {
      throw getSubmissionError(this.store, 'submitEditCreditCard', err);
    });
  }

  submitSetAsDefaultCreditCard (cardData) {
    return this.accountServiceAbstractor.setCreditCardAsDefault({
      creditCardId: cardData.onFileCardId,
      isDefault: true
    }).then((res) => {
      let generalOperator = getGeneralOperator(this.store);
      generalOperator.flashSuccess(MESSAGES.EDIT_CREDIT_CARD_SUCCESS);
      return Promise.all([
        getAddressesOperator(this.store).loadAddressesOnAccount(),
        getPaymentCardsOperator(this.store).loadCreditCardsOnAccount().then(() => {
          getRoutingOperator(this.store).pushLocation(MY_ACCOUNT_SECTIONS.paymentAndGiftCards);
        })
      ]);
    }).catch((err) => {
      throw getSubmissionError(this.store, 'submitSetAsDefaultCreditCard', err);
    });
  }

  submitDeleteCreditCard (formData) {
    let generalOperator = getGeneralOperator(this.store);

    return new Promise((resolve, reject) => {
      generalOperator.openConfirmationModal(CONFIRM_MODAL_IDS.CONFIRM_DELETE_CREDIT_CARD).then(() => {
        this.paymentCardsServiceAbstractor.deleteCreditCardOnAccount(formData.onFileCardId).then((res) => {
          let isGuest = userStoreView.isGuest(this.store.getState());
          formData.cardType === ACCEPTED_CREDIT_CARDS['PLACE CARD'] && generalOperator.reloadEspots(isGuest, isGuest);

          this.store.dispatch(getRemoveCardInBookActn(formData.onFileCardId));
          resolve();
          generalOperator.flashSuccess(MESSAGES.REMOVE_PAYMENT_CARD_SUCCESS);
        }).catch((err) => {
          reject(getSubmissionError(this.store, 'deleteGiftCard', err));
        });
      }).catch(() => {
        // When the user cancels the confirmation modal we gracefully resolve our Promise
        resolve();
      });
    });
  }

  submitAddGiftCard (formData) {
    return this.paymentCardsServiceAbstractor.addGiftCardToAccount(formData.cardNumber, formData.cardPin, formData.recaptchaToken).then(() => {
      let generalOperator = getGeneralOperator(this.store);
      generalOperator.flashSuccess(MESSAGES.ADD_GIFT_CARD_SUCCESS);
      // FIXME: VERIFY if loadCreditCardsOnAccount returns both CC and GC info
      return getPaymentCardsOperator(this.store).loadCreditCardsOnAccount().then(() => {
        getRoutingOperator(this.store).pushLocation(MY_ACCOUNT_SECTIONS.paymentAndGiftCards);
      });
    }).catch((err) => {
      throw getSubmissionError(this.store, 'submitAddGiftCard', err);
    });
  }

  submitGetGiftCardBalance (formData) {
    return this.paymentCardsServiceAbstractor.getGiftCardBalance(formData.onFileCardId, formData.cardNumber, formData.cardPin, formData.recaptchaToken).then((res) => {
      if (formData.onFileCardId) {
        this.store.dispatch(getSetExistingCardBalanceActn(formData.onFileCardId, res.remainingBalance));
      } else {
        this.store.dispatch(getSetCheckoutLastLookUpGiftCardBalanceActn(res.remainingBalance));
      }
    }).catch((err) => {
      throw getSubmissionError(this.store, 'submitGetGiftCardBalance', err);
    });
  }

  clearGiftCardBalance () {
    this.store.dispatch(getSetCheckoutLastLookUpGiftCardBalanceActn(null));
  }

  closeGiftCardModal () {
    this.clearGiftCardBalance();
    getGeneralOperator(this.store).closeCustomModal();
  }

  submitDeleteGiftCard (formData) {
    let generalOperator = getGeneralOperator(this.store);

    return new Promise((resolve, reject) => {
      generalOperator.openConfirmationModal(CONFIRM_MODAL_IDS.CONFIRM_DELETE_GIFT_CARD).then(() => {
        this.paymentCardsServiceAbstractor.deleteGiftCardOnAccount(formData.onFileCardId).then((res) => {
          this.store.dispatch(getRemoveCardInBookActn(formData.onFileCardId));
          resolve();
          generalOperator.flashSuccess(MESSAGES.REMOVE_PAYMENT_CARD_SUCCESS);
        }).catch((err) => {
          reject(getSubmissionError(this.store, 'deleteGiftCard', err));
        });
      }).catch(() => {
        // When the user cancels the confirmation modal we gracefully resolve our Promise
        resolve();
      });
    });
  }
}
