/** @module paymentCardsStoreView
 *
 * @author Ben
 */
import {addressesStoreView} from './addressesStoreView';
import {ACCEPTED_CREDIT_CARDS, CREDIT_CARDS_BIN_RANGES} from 'reduxStore/storeReducersAndActions/paymentCards/paymentCards.js';

export const paymentCardsStoreView = {
  getCreditCardIcon,
  getCreditCardEndingNumbers,
  getDetailedCreditCardsBook,
  getDetailedCreditCardById,
  getCreditCardsBook,
  getDetailedGiftCardsBook,
  getDetailedGiftCardById,
  getDefaultPaymentMethod,
  getCreditCardType,
  getIsEditingCardExpirationRequired,
  getIsEditingCardCVVRequired,
  getCreditCardById,
  getLastGiftCardLookUpBalance,
  getCreditCardByAddressId
};

function getDetailedGiftCardsBook (state) {
  let detailedGCBook = [];

  state.paymentCards.creditCardsBook.filter((card) => card.cardType === 'GIFT CARD').map((gc) => {
    detailedGCBook.push({
      ...gc,
      cardEndingNumbers: (gc.cardNumber || '').substr(-4),
      imgPath: '/wcsstore/static/images/' + (gc.cardType || '').toLowerCase().replace(' ', '-') + '-small.png'
    });
  });

  return detailedGCBook;
}

function getDetailedGiftCardById (state, id) {
  return getDetailedGiftCardsBook(state).find((cc) => cc.onFileCardId === id);
}

function getDetailedCreditCardsBook (state) {
  // REVIEW: calculating derived data in here? looks like the correct place, but confirm just in case
  let detailedCCBook = [];
  let now = new Date();
  let nowYear = now.getFullYear();
  let nowMonth = now.getMonth() + 1;

  getCreditCardsBook(state).map((cc) => {
    // backend could send wrong id (not present on address book), so using default one in this case because we need a nickName for checkout
    // this || .getDefault may be removed once backend fixes their code.
    // Note: bug caused by this issue DT-20300
    let billingAddress = addressesStoreView.getAddressByAddressId(state, cc.billingAddressId) || addressesStoreView.getDefaultAddress(state) || {};
    let cardType = getCreditCardType(cc);
    detailedCCBook.push({
      ...cc,
      cardType: cardType,
      cardEndingNumbers: (cc.cardNumber || '').substr(-4),
      imgPath: '/wcsstore/static/images/' + (cardType || '').toLowerCase().replace(' ', '-') + '-small.png',
      isExpired: (cc.expYear < nowYear) || (cc.expYear === nowYear && cc.expMonth < nowMonth),

      address: {
        ...billingAddress.address
      },
      addressKey: billingAddress.addressKey,
      addressId: billingAddress.addressId,
      phoneNumber: billingAddress.phoneNumber,
      emailAddress: billingAddress.emailAddress
    });
  });

  return detailedCCBook;
}

function getIsEditingCardExpirationRequired (state, cardType) {
  try {
    return cardType ? cardType !== ACCEPTED_CREDIT_CARDS['PLACE CARD'] : state.checkout.values.billing.billing.isExpirationRequired;
  } catch (ex) {
    return cardType !== ACCEPTED_CREDIT_CARDS['PLACE CARD'];
  }
}

function getIsEditingCardCVVRequired (state, cardType) {
  try {
    // FIXME: state.checkout.values.billing.billing.isCVVRequired already checked that it is not a 'PLACE CARD'
    return cardType ? cardType !== ACCEPTED_CREDIT_CARDS['PLACE CARD'] : state.checkout.values.billing.billing.isCVVRequired;
  } catch (ex) {
    return cardType !== ACCEPTED_CREDIT_CARDS['PLACE CARD'];
  }
}

function getCreditCardType (cc) {
  if (!cc || (cc.cardNumber || '').length === 0) {
    return null;
  }

  // look up based on cardNumber
  for (let type in CREDIT_CARDS_BIN_RANGES) {
    for (let currentRange = 0, rangesCount = CREDIT_CARDS_BIN_RANGES[type].length; currentRange < rangesCount; currentRange++) {
      let from = CREDIT_CARDS_BIN_RANGES[type][currentRange].from;
      let to = CREDIT_CARDS_BIN_RANGES[type][currentRange].to;
      let prefixLength = from.toString().length;
      let prefix = (cc.cardNumber || '').substr(0, prefixLength);

      if (prefix >= from && prefix <= to) {
        return ACCEPTED_CREDIT_CARDS[type];
      }
    }
  }

  if (cc.cardType && cc.cardNumber.substr(0, 1) === '*') { // if not editing
    return cc.cardType.toUpperCase();
  }
}

function getCreditCardIcon (card) {
  return '/wcsstore/static/images/' + (getCreditCardType(card) || '').toLowerCase().replace(' ', '-') + '-small.png';
}

function getCreditCardEndingNumbers (card) {
  return (card.cardNumber || '').substr(-4);
}

function getDetailedCreditCardById (state, id) {
  return getDetailedCreditCardsBook(state).find((cc) => cc.onFileCardId === id);
}

function getCreditCardById (state, id) {
  return getCreditCardsBook(state).find((cc) => cc.onFileCardId === id);
}

function getCreditCardByAddressId (state, addressId) {
  return getCreditCardsBook(state).find((cc) => cc.billingAddressId === addressId);
}

function getCreditCardsBook (state) {
  return state.paymentCards.creditCardsBook.filter((card) => card.cardType !== 'GIFT CARD');
}

function getDefaultPaymentMethod (state) {
  return state.paymentCards.creditCardsBook && state.paymentCards.creditCardsBook ? state.paymentCards.creditCardsBook.find((card) => card.isDefault) : null;
}

function getLastGiftCardLookUpBalance (state) {
  return state.paymentCards.lastLookUpGiftCardBalance;
}
