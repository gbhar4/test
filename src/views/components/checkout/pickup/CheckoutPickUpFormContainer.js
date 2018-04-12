/**
* @module CheckoutPickUpFormContainer
* @author Ben
*/
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {CheckoutPickUpForm} from './CheckoutPickUpForm.jsx';
import {getCheckoutOperator} from 'reduxStore/storeOperators/checkoutOperator.js';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView.js';
import {getCheckoutSignalsOperator} from 'reduxStore/storeOperators/uiSignals/checkoutSignalsOperator';

let mapStateToProps = function (state, ownProps, storeOperators) {
  return {
    initialValues: checkoutStoreView.getInitialPickupSectionValues(state),
    onEditModeChange: storeOperators.checkoutSignalsOperator.setIsEditingSubform
  };
};

let CheckoutPickUpFormContainer = connectPlusStoreOperators(
  {checkoutOperator: getCheckoutOperator, checkoutSignalsOperator: getCheckoutSignalsOperator},
  mapStateToProps, undefined, undefined, {withRef: true}
)(CheckoutPickUpForm);

export {CheckoutPickUpFormContainer};
