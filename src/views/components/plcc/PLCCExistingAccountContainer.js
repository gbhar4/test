/**
 * @module Plcc Existing Account Connect
 * @author Agu
 */

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';
import {getCartOperator} from 'reduxStore/storeOperators/cartOperator.js';
import {getPaymentCardsFormOperator} from 'reduxStore/storeOperators/formOperators/paymentCardsFormOperator.js';
import {getPlccOperator} from 'reduxStore/storeOperators/plccOperator.js';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {CreditCardExisting} from './CreditCardExisting.jsx';
import {getRoutingOperator} from 'reduxStore/storeOperators/routingOperator.js';
import {PAGES} from 'routing/routes/pages.js';
import {matchPath} from 'react-router';

function mapStateToProps (state, ownProps, storeOperators) {
  let isGuest = userStoreView.isGuest(state);
  let isRemembered = userStoreView.isRemembered(state);
  let summary = cartStoreView.getSummary(state);
  let isCheckoutPage = !!matchPath(window.location.pathname, {path: PAGES.checkout.pathPattern});

  // FIXME: we shouldn't create functions in mapStateToProps, but there currently
  // is no other way to grab to store in containers and pass it to the factory
  // method of operators.
  const redirectToCart = () => storeOperators.routingOperator.gotoPage(PAGES.cart, null, true);

  return {
    onCheckoutClick: (!ownProps.isInstantCredit || isCheckoutPage)
      ? storeOperators.plccOperator.dismissPlccModal
      : (isGuest && !isRemembered)
        ? redirectToCart
        : storeOperators.cartOperator.startCheckout,
    onSavePlccToAccount: storeOperators.paymentCardsFormOperator.submitPlccApplicationToAccount,
    cardNumber: userStoreView.getUserPlccCardNumber(state),
    isShowCheckoutButton: summary.itemsCount > 0,
    isShowContinueShoppingLink: ownProps.isShowContinueShoppingLink,
    isGuest,
    isRemembered,
    cardAlreadySaved: userStoreView.getUserIsPlcc(state),
    isShowViewAccountLink: !isCheckoutPage
  };
}

let PLCCExistingAccountContainer = connectPlusStoreOperators({
  globalSignalsOperator: getGlobalSignalsOperator,
  cartOperator: getCartOperator,
  paymentCardsFormOperator: getPaymentCardsFormOperator,
  plccOperator: getPlccOperator,
  routingOperator: getRoutingOperator
}, mapStateToProps)(CreditCardExisting);

export {PLCCExistingAccountContainer};
