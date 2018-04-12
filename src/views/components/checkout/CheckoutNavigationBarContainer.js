/** @module CheckoutNavigationBarContainer
 *
 * @author Ben
 */
import {isSubmitting} from 'redux-form';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView.js';
import {CheckoutNavigationBar} from './CheckoutNavigationBar.jsx';
import {getCheckoutFormOperator} from 'reduxStore/storeOperators/formOperators/checkoutFormOperator.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isPaypalSelected: checkoutStoreView.getIsPaypalMethodSelected(state),
    isAbandonPayPalMethod: checkoutStoreView.getIsAbandonPaypal(state),
    disableNext: isSubmitting('checkoutPickup')(state) ||
      isSubmitting('checkoutShipping')(state) ||
      isSubmitting('checkoutBilling')(state) ||
      isSubmitting('checkoutReview')(state) ||
      checkoutStoreView.getIsLoadingShippingMethods(state) ||
      checkoutStoreView.getIsEditingSubform(state),

    onBackToPaypal: storeOperators.checkoutFormOperator.forcePaypalPaymentMethod,
    onChangeToCCPayment: storeOperators.checkoutFormOperator.forceCreditCardPaymentMethod
  };
}

let CheckoutNavigationBarContainer = connectPlusStoreOperators({
  checkoutFormOperator: getCheckoutFormOperator
}, mapStateToProps
)(CheckoutNavigationBar);

export {CheckoutNavigationBarContainer};
