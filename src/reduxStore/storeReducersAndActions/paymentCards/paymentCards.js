/** @module
 * @summary reducer for credit cards and gift cards related information.
 *
 */

import Immutable from 'seamless-immutable';

const defaultCardsStore = Immutable({
  creditCardsBook: [],
  lastLookUpGiftCardBalance: null
});

export function paymentCardsReducer (cardsStore = defaultCardsStore, action) {
  switch (action.type) {
    case 'ACCOUNT_SET_CREDIT_CARDS_BOOK':
      return Immutable.merge(cardsStore, {creditCardsBook: action.creditCardsBook});
    case 'ACCOUNT_FLAGS_SET_LAST_GIFTCARD_BALANCE':
      return Immutable.merge(cardsStore, {lastLookUpGiftCardBalance: action.lastLookUpGiftCardBalance});
    case 'ACCOUNT_REMOVE_CARD_IN_BOOK':
      return Immutable.merge(cardsStore, {creditCardsBook: cardsStore.creditCardsBook.filter((card) => { return card.onFileCardId !== action.onFileCardId; })});
    case 'ACCOUNT_SET_CARD_BALANCE_IN_BOOK':
      return Immutable.merge(cardsStore, {creditCardsBook: cardsStore.creditCardsBook.map((card) =>
        card.onFileCardId !== action.onFileCardId ? card : {...card, balance: action.newBalance}
      )});
    default:
      return cardsStore;
  }
}

export const ACCEPTED_CREDIT_CARDS = Immutable({
  'PLACE CARD': 'PLACE CARD',
  VISA: 'VISA',
  AMEX: 'AMEX',
  MC: 'MC',
  DISC: 'DISC',
  PAYPAL: 'PAYPAL'
});

// Note: indexed by cardType value of a card
export const ACCEPTED_CREDIT_CARDS_COPY = Immutable({
  'PLACE CARD': 'My Place reward Credit Card',
  Visa: 'Visa',
  Amex: 'American Express',
  MC: 'MasterCard',
  DISC: 'Discover',
  PAYPAL: 'Paypal'
});

export const CREDIT_CARDS_BIN_RANGES = {
  'PLACE CARD': [{from: 578097, to: 578097}],
  'VISA': [{from: 400000, to: 499999}],
  'AMEX': [
    {from: 340000, to: 349999},
    {from: 370000, to: 379999}
  ],
  'MC': [
    {from: 510000, to: 559999},
    {from: 222100, to: 272099}
  ],
  'DISC': [
    {from: 601100, to: 601109},
    {from: 601120, to: 601149},
    {from: 601174, to: 601199},
    {from: 644000, to: 659999},
    {from: 352800, to: 358999},
    {from: 300000, to: 309999},
    {from: 352000, to: 369999},
    {from: 380000, to: 399999},
    {from: 940000, to: 959999},
    {from: 389000, to: 389999},
    {from: 900000, to: 999999},
    {from: 622126, to: 622925},
    {from: 624000, to: 626999},
    {from: 628200, to: 628899}
  ]
};

export * from './actionCreators';
