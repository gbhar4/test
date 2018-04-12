/**
* @module CheckoutReviewFormContainer
* @author Agustin H. Andina Silva <asilva@minutentag.com>
*/
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {CheckoutReviewForm} from './CheckoutReviewForm.jsx';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView';
import {paymentCardsStoreView} from 'reduxStore/storeViews/paymentCardsStoreView';
import {getCheckoutOperator} from 'reduxStore/storeOperators/checkoutOperator.js';

let mapStateToProps = function (state, ownProps, storeOperators) {
  // we need to pass the cardType as prop for CVV validation
  let checkoutDetails = checkoutStoreView.getBillingValues(state);
  let cardType = paymentCardsStoreView.getCreditCardType(checkoutDetails.billing);

  return {
    orderContainsPickup: cartStoreView.getIsOrderHasPickup(state),
    orderContainsShipping: cartStoreView.getIsOrderHasShipping(state),
    orderRequiresPayment: !checkoutStoreView.getIsPaymentDisabled(state),
    cardType: cardType,
    appliedGiftCards: checkoutStoreView.getGiftCards(state),
    initialValues: checkoutStoreView.getInitialReviewSectionValues(state),
    onRedirectToBilling: storeOperators.checkoutOperator.redirectToBilling
  };
};

let CheckoutReviewFormContainer = connectPlusStoreOperators(
  {
    checkoutOperator: getCheckoutOperator
  },
  mapStateToProps, undefined, undefined, {withRef: true}
)(CheckoutReviewForm);

export {CheckoutReviewFormContainer};
