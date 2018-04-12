/**
 * @module CheckoutProgressListConnect
 * @author Agustin H. Andina Silva <asilva@minutentag.com>
 * Exports the container component for the CheckoutProgressIndicator component,
 * connecting state to it's props.
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView';
import {getCheckoutSignalsOperator} from 'reduxStore/storeOperators/uiSignals/checkoutSignalsOperator';

const mapStateToProps = function (state, ownProps, storeOperators) {
  return {
    activeStage: checkoutStoreView.getCheckoutStage(state),
    moveToCheckoutStage: storeOperators.checkoutSignalsOperator.moveToStage,
    availableStages: storeOperators.checkoutSignalsOperator.getAvailableStages()
  };
};

let CheckoutProgressIndicatorConnect = connectPlusStoreOperators({
  checkoutSignalsOperator: getCheckoutSignalsOperator
}, mapStateToProps);

export {CheckoutProgressIndicatorConnect};
