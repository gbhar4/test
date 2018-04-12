/** @module
 * @summary reducer for order confirmation related information.
 *
 * @author NM
 */

import Immutable from 'seamless-immutable';

const defaultOrderConfirmationStore = Immutable({
  orderConfirmation: {
    emailAddress: '',
    summary: {
      itemsTotal: 0,
      itemsCount: 0,
      savingsTotal: 0,
      taxTotal: 0,
      shippingTotal: 0,
      estimatedRewards: 0,
      subTotal: 0,
      grandTotal: 0
    },

    orderDetails: {
      date: null,
      orderNumber: null,
      trackingLink: ''
    },

    rewardedPoints: 0
  }
});

export function orderConfirmationReducer (confirmation = defaultOrderConfirmationStore, action) {
  switch (action.type) {
    case 'CONFIRMATION_SET_ORDER_CONFIRMATION':
      return Immutable.merge(confirmation, {orderConfirmation: action.orderConfirmation});
    default:
      return confirmation;
  }
}

export * from './actionCreators';
