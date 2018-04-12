/** @module
 * @summary action crerators for manipulating checkout order options.
 *
 * @author Ben
 */

export function getSetShippingOptionsActn (shippingMethods) {
  return {
    shippingMethods: shippingMethods,
    type: 'CHECKOUT_ORDER_OPTIONS_SET_SHIPPING'
  };
}

export function getSetGiftWrapOptionsActn (giftWrapOptions) {
  return {
    giftWrapOptions: giftWrapOptions,
    type: 'CHECKOUT_ORDER_OPTIONS_SET_GIFT_WRAP'
  };
}

export function getSetIsPaypalPaymentSettings (paypalPaymentSettings) {
  return {
    paypalPaymentSettings: paypalPaymentSettings,
    type: 'CHECKOUT_ORDER_OPTIONS_SET_PAYPAL_PAYMENT'
  };
}

export function getSetIntlUrl (internationalUrl) {
  return {
    internationalUrl,
    type: 'CHECKOUT_ORDER_OPTIONS_SET_INTL_URL'
  };
}
