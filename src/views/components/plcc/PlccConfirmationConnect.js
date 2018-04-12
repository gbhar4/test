/**
 * @module Plcc Response Connect
 * @author Agu
 */

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';
import {getCartOperator} from 'reduxStore/storeOperators/cartOperator.js';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {plccStoreView} from 'reduxStore/storeViews/plccStoreView.js';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {getPaymentCardsFormOperator} from 'reduxStore/storeOperators/formOperators/paymentCardsFormOperator.js';
import {getPlccOperator} from 'reduxStore/storeOperators/plccOperator.js';
import {getRoutingOperator} from 'reduxStore/storeOperators/routingOperator.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {PAGES} from 'routing/routes/pages.js';
import {matchPath} from 'react-router';

function mapStateToProps (state, ownProps, storeOperators) {
  let application = plccStoreView.getApplication(state);
  let summary = cartStoreView.getSummary(state);
  let savingAmount = application.savingAmount;
  let isGuest = userStoreView.isGuest(state);
  let isRemembered = userStoreView.isRemembered(state);
  let isCheckoutPage = !!matchPath(window.location.pathname, {path: PAGES.checkout.pathPattern});

  // FIXME: we shouldn't create functions in mapStateToProps, but there currently
  // is no other way to grab to store in containers and pass it to the factory
  // method of operators.
  const redirectToCart = () => storeOperators.routingOperator.gotoPage(PAGES.cart, null, true);

  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    globalSignalsOperator: storeOperators.globalSignalsOperator,
    isRedirectToCart: !ownProps.isModal && isGuest,
    onCheckoutClick: (!ownProps.isInstantCredit || isCheckoutPage)
      ? storeOperators.plccOperator.dismissPlccModal
      : (isGuest && !isRemembered)
        ? redirectToCart
        : storeOperators.cartOperator.startCheckout,
    onSavePlccToAccount: storeOperators.paymentCardsFormOperator.submitPlccApplicationToAccount,
    cardAlreadySaved: userStoreView.getUserIsPlcc(state),

    isGuest,
    isRemembered,
    firstName: application.address && application.address.firstName,
    couponCode: application.couponCode,
    creditLimit: application.creditLimit,
    isShowCheckoutButton: isCheckoutPage || (summary.itemsCount > 0 && (!ownProps.isApproved || savingAmount > 0)),
    isShowContinueShoppingLink: ownProps.isShowContinueShoppingLink && !isCheckoutPage,

    cardNumber: application.cardNumber,
    savingAmount: savingAmount,
    isShowViewAccountLink: !isCheckoutPage
  };
}

let PlccConfirmationConnect = connectPlusStoreOperators({
  globalSignalsOperator: getGlobalSignalsOperator,
  cartOperator: getCartOperator,
  paymentCardsFormOperator: getPaymentCardsFormOperator,
  plccOperator: getPlccOperator,
  routingOperator: getRoutingOperator
}, mapStateToProps);

export {PlccConfirmationConnect};
