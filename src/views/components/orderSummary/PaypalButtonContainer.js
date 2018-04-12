/**
 * @module PaypalButtonContainer
 * @author Florencia Acosta <facosta@minutentag.com>
 */

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {PaypalButton} from './PaypalButton.jsx';
import {getCartOperator} from 'reduxStore/storeOperators/cartOperator.js';
import {getCheckoutFormOperator} from 'reduxStore/storeOperators/formOperators/checkoutFormOperator.js';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView.js';
import {routingStoreView} from 'reduxStore/storeViews/routing/routingStoreView.js';
import {PAGES} from 'routing/routes/pages';
import {matchPath} from 'react-router';
import {isClient} from 'routing/routingHelper';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {getCheckoutSignalsOperator} from 'reduxStore/storeOperators/uiSignals/checkoutSignalsOperator';

function mapStateToProps (state, ownProps, storeOperators) {
  let isCheckouPage = isClient() && !!matchPath(document.location.pathname, {path: PAGES.checkout.pathPattern});

  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    onStartPaypalPaypal: storeOperators.cartOperator.startPaypalCheckout,
    onClose: ownProps.onClose || (() => null),
    error: routingStoreView.getPaypalErrorMessage(state),
    isPaypalModalOpened: checkoutStoreView.getIsPaypalPaymentInProgress(state),
    paypalModalSettings: checkoutStoreView.getPaypalPaymentSettings(state),
    onAbandonPaypal: storeOperators.checkoutFormOperator.abandonPaypalCheckout,
    isSkipPaymentEnabled: ownProps.isSkipPaymentEnabled && isCheckouPage && checkoutStoreView.getIsSkipPaypalEnabled(state),
    skipPaypalPayment: storeOperators.checkoutFormOperator.skipPaypalPayment,
    isAddToBagModal: ownProps.isAddToBagModal,
    setInitPayPalPayment: storeOperators.checkoutSignalsOperator.setInitPayPalPayment
  };
}

const PaypalButtonContainer = connectPlusStoreOperators({
  cartOperator: getCartOperator,
  checkoutFormOperator: getCheckoutFormOperator,
  checkoutSignalsOperator: getCheckoutSignalsOperator
}, mapStateToProps)(PaypalButton);

export {PaypalButtonContainer};
