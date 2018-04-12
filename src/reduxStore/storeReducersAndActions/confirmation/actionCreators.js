/** @module
 * @summary action crerators for manipulating order confirmation related information.
 *
 * @author NM
 */

export function getSetOrderConfirmationActn (orderConfirmation) {
  return {
    orderConfirmation: orderConfirmation,
    type: 'CONFIRMATION_SET_ORDER_CONFIRMATION'
  };
}
