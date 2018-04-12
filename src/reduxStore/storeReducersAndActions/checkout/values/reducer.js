/** @module
 * @summary reducer for checkout order values (i.e., values already set on backend for this order).
 *
 * @author Ben
 * @author Noam
 */
import Immutable from 'seamless-immutable';

const defaultValuesStore = Immutable({
  pickUpContact: {},
  pickUpAlternative: {},
  shipping: {},
  billing: {},
  giftWrap: {},
  giftCards: [] // FIXME: has to be moved into billing as a potential payment tender of many, I'm sorry. There's a limit of 5
});

export function orderValuesReducer (orderValues = defaultValuesStore, action) {
  switch (action.type) {
    case 'CHECKOUT_VALUES_SET_PICKUP':
      return Immutable.merge(orderValues, {pickUpContact: action.pickUpContact});
    case 'CHECKOUT_VALUES_SET_PICKUP_ALT':
      return Immutable.merge(orderValues, {pickUpAlternative: action.pickUpAlternative});
    case 'CHECKOUT_VALUES_SET_GIFTCARDS':
      return Immutable.merge(orderValues, {giftCards: action.giftCards});
    case 'CHECKOUT_VALUES_SET_SHIPPING':
      return Immutable.merge(orderValues, {shipping: action.shipping});
    case 'CHECKOUT_VALUES_SET_BILLING':
      return Immutable.merge(orderValues, {billing: action.billing});
    case 'CHECKOUT_VALUES_SET_SHIPPING_METHOD':
      return Immutable.setIn(orderValues, ['shipping', 'method'], action.method);
    case 'CHECKOUT_VALUES_SET_GIFT_WRAP':
      return Immutable.merge(orderValues, {giftWrap: action.giftWrap});
    default:
      return orderValues;
  }
}
