 /** @module
  * @summary action crerators for order values (i.e., values already set on backend for this order).
  *
  * @author Ben
  */

  export function getSetPickupValuesActn (pickup) {
    return {
      pickUpContact: pickup,
      type: 'CHECKOUT_VALUES_SET_PICKUP'
    };
  }

  export function getSetPickupAltValuesActn (pickup) {
    return {
      pickUpAlternative: pickup,
      type: 'CHECKOUT_VALUES_SET_PICKUP_ALT'
    };
  }

  export function getSetShippingValuesActn (shipping) {
    return {
      shipping: shipping,
      type: 'CHECKOUT_VALUES_SET_SHIPPING'
    };
  }

  export function getSetBillingValuesActn (billing) {
    return {
      billing: billing,
      type: 'CHECKOUT_VALUES_SET_BILLING'
    };
  }

  export function getSetShippingMethodValuesActn (method) {
    return {
      method: method,
      type: 'CHECKOUT_VALUES_SET_SHIPPING_METHOD'
    };
  }

  export function getSetGiftWrapValuesActn (giftWrap) {
    return {
      giftWrap: giftWrap,
      type: 'CHECKOUT_VALUES_SET_GIFT_WRAP'
    };
  }

  export function getSetGiftCardValuesActn (giftCards) {
    return {
      giftCards,
      type: 'CHECKOUT_VALUES_SET_GIFTCARDS'
    };
  }
