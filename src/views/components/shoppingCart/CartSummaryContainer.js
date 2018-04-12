/**
 * @module CartSummaryContainer
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * Exports the container component for the CartSummary component, connecting
 * state to it's props.
 */

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {CartSummary} from './CartSummary.jsx';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView';
import {getCartOperator} from 'reduxStore/storeOperators/cartOperator.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    isPayPalEnabled: cartStoreView.getIsPayPalEnabled(state) && !checkoutStoreView.getIsPaymentDisabled(state),
    isClosenessQualifier: false,
    isTotalEstimated: cartStoreView.getIsTotalEstimated(state),
    onStartCheckout: storeOperators.cartOperator.startCheckout
  };
}

let CartSummaryContainer = connectPlusStoreOperators(
  {cartOperator: getCartOperator}, mapStateToProps
)(CartSummary);

export {CartSummaryContainer};
