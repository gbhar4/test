import {logErrorAndServerThrow} from './operatorHelper';
import {getAccountAbstractor} from 'service/accountServiceAbstractor';
import {getSetCreditCardsBookActn} from 'reduxStore/storeReducersAndActions/paymentCards/paymentCards';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';

let previous = null;
export function getPaymentCardsOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new PaymentCardsOperator(store);
  }
  return previous;
}

class PaymentCardsOperator {
  constructor (store) {
    this.store = store;

    bindAllClassMethodsToThis(this);
  }

  get accountServiceAbstractor () {
    return getAccountAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  loadCreditCardsOnAccount () {
    return this.accountServiceAbstractor.getCreditCards().then((res) => {
      this.store.dispatch(getSetCreditCardsBookActn(res));
    }).catch((err) => {
      logErrorAndServerThrow(this.store, 'loadCreditCardsOnAccount', err);
      throw err;
    });
  }

  // getCreditCardOnOrder () {
  //   return getPaymentsAppliedToOrder().then((res) => {
  //     return res.filter((card) => card.paymentInformation.cc_brand !== 'GC');
  //   }).catch((err) => {
  //     logErrorAndServerThrow(this.store, 'getCreditCardOnOrder', err);
  //   });
  // }
  //
  // getGiftCardsOnOrder () {
  //   return getPaymentsAppliedToOrder().then((res) => {
  //     // Backend stores giftcards the same way as credit cards but with this flag
  //     return res.filter((card) => card.paymentInformation.cc_brand === 'GC');
  //   }).catch((err) => {
  //     logErrorAndServerThrow(this.store, 'getGiftCardsOnOrder', err);
  //   });
  // }
}
