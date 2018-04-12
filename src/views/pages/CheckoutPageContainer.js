import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {CheckoutPage} from './CheckoutPage.jsx';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {getCheckoutSignalsOperator} from 'reduxStore/storeOperators/uiSignals/checkoutSignalsOperator';
import {getRoutingOperator} from 'reduxStore/storeOperators/routingOperator';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView';
import {CHECKOUT_STAGES} from 'reduxStore/storeReducersAndActions/checkout/checkout';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isBagEmpty: cartStoreView.getItemsCount(state) <= 0,
    gotoPage: storeOperators.routingOperator.gotoPage,
    isConfirmation: checkoutStoreView.getCheckoutStage(state) === CHECKOUT_STAGES.CONFIRMATION,
    onLocationChange: storeOperators.checkoutSignalsOperator.routeToStage,
    isLoading: generalStoreView.getIsLoading(state)
  };
}

export let CheckoutPageContainer = connectPlusStoreOperators({
  checkoutSignalsOperator: getCheckoutSignalsOperator,
  routingOperator: getRoutingOperator
}, mapStateToProps)(CheckoutPage);
