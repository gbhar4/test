/** @module
 * @summary reducer for checkout order options.
 *
 * @author Ben
 */
import Immutable from 'seamless-immutable';

const defaultOrderOptionsStore = Immutable({
  shippingMethods: [],
  giftWrapOptions: [],
  paypalPaymentSettings: null,
  internationalUrl: null
});

export function orderOptionsReducer (orderOptions = defaultOrderOptionsStore, action) {
  switch (action.type) {
    case 'CHECKOUT_ORDER_OPTIONS_SET_SHIPPING':
      return Immutable.merge(orderOptions, {shippingMethods: action.shippingMethods});
    case 'CHECKOUT_ORDER_OPTIONS_SET_GIFT_WRAP':
      return Immutable.merge(orderOptions, {giftWrapOptions: action.giftWrapOptions});
    case 'CHECKOUT_ORDER_OPTIONS_SET_PAYPAL_PAYMENT':
      return Immutable.merge(orderOptions, {paypalPaymentSettings: action.paypalPaymentSettings});
    case 'CHECKOUT_ORDER_OPTIONS_SET_INTL_URL':
      return Immutable.merge(orderOptions, {internationalUrl: action.internationalUrl});
    default:
      return orderOptions;
  }
}
