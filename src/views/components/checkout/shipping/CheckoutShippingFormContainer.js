/**
* @module CheckoutShippingFormContainer
* @author Ben
*/
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {CheckoutShippingForm} from './CheckoutShippingForm.jsx';
import {getCheckoutOperator} from 'reduxStore/storeOperators/checkoutOperator.js';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView.js';
import {getCheckoutSignalsOperator} from 'reduxStore/storeOperators/uiSignals/checkoutSignalsOperator';

let mapStateToProps = function (state, ownProps, storeOperators) {
  return {
    onStateZipOrLineChange: storeOperators.checkoutOperator.loadShipmentMethods,
    isGiftOptionsEnabled: checkoutStoreView.isGiftOptionsEnabled(state),
    // FIXME: do we need the next prop? shipping method defaults load anyway; review it
    isShippingMethodAvailable: checkoutStoreView.getShippingMethods(state).length > 0,
    initialValues: checkoutStoreView.getInitialShippingSectionValues(state),
    onEditModeChange: storeOperators.checkoutSignalsOperator.setIsEditingSubform
  };
};

let CheckoutShippingFormContainer = connectPlusStoreOperators(
  {checkoutOperator: getCheckoutOperator, checkoutSignalsOperator: getCheckoutSignalsOperator},
  mapStateToProps, undefined, undefined, {withRef: true}
)(CheckoutShippingForm);

export {CheckoutShippingFormContainer};
