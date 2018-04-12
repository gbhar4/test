/**
* @module BillingReviewSectionContainer
* @author Agustin H. Andina Silva <asilva@minutentag.com>
*/

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {BillingReviewSection} from './BillingReviewSection.jsx';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {paymentCardsStoreView} from 'reduxStore/storeViews/paymentCardsStoreView.js';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView.js';

const mapStateToProps = function (state) {
  let billingValues = checkoutStoreView.getBillingValues(state);
  let card = billingValues.billing;
  let isRequireCVV = card && checkoutStoreView.isExpressCheckout(state) &&
    paymentCardsStoreView.getIsEditingCardCVVRequired(state) && !checkoutStoreView.getIsBillingVisited(state);

  return {
    cvvFormEnabled: isRequireCVV && !userStoreView.isGuest(state),
    billingAddress: billingValues.address,
    paymentMethod: card ? {
      cardType: paymentCardsStoreView.getCreditCardType(card),
      icon: paymentCardsStoreView.getCreditCardIcon(card),
      message: 'ending in ' + paymentCardsStoreView.getCreditCardEndingNumbers(card)
    } : null
  };
};

export let BillingReviewSectionContainer = connectPlusStoreOperators(mapStateToProps)(BillingReviewSection);
