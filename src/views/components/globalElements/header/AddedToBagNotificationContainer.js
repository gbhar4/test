/** @module AddedToBagNotificationContainer
 *
 * @author Miguel
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {AddedToBagNotification} from './AddedToBagNotification.jsx';
import {quickViewStoreView} from 'reduxStore/storeViews/quickViewStoreView';
import {getQuickViewOperator} from 'reduxStore/storeOperators/quickViewOperator';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView.js';
import {getCartOperator} from 'reduxStore/storeOperators/cartOperator.js';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {getCheckoutSignalsOperator} from 'reduxStore/storeOperators/uiSignals/checkoutSignalsOperator';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    isVisible: !!quickViewStoreView.getLastAddedToBagItem(state),
    currencySymbol: sitesAndCountriesStoreView.getCurrentCurrency(state),
    onClose: storeOperators.quickViewOperator.forgetLastAddedToBagItem,
    cartItem: quickViewStoreView.getLastAddedToBagItem(state),
    onRedirectToCheckout: storeOperators.cartOperator.startCheckout,
    isPayPalEnabled: cartStoreView.getIsPayPalEnabled(state),
    initPayPalPayment: checkoutStoreView.getInitPayPalPayment(state),
    setInitPayPalPayment: storeOperators.checkoutSignalsOperator.setInitPayPalPayment
  };
}

export let AddedToBagNotificationContainer = connectPlusStoreOperators({
  cartOperator: getCartOperator,
  quickViewOperator: getQuickViewOperator,
  checkoutSignalsOperator: getCheckoutSignalsOperator
}, mapStateToProps)(AddedToBagNotification);
