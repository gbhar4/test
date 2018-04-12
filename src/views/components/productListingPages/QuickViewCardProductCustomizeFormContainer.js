// import {PropTypes} from 'prop-types';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {CardProductCustomizeForm} from './CardProductCustomizeForm.jsx';
import {quickViewStoreView} from 'reduxStore/storeViews/quickViewStoreView';
import {getQuickViewOperator} from 'reduxStore/storeOperators/quickViewOperator.js';
import {getCartFormOperator} from 'reduxStore/storeOperators/formOperators/cartFormOperator.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';

function mapStateToProps (state, ownProps, storeOperators) {

  return {
    form: ownProps.form || 'quickviewAddToBagForm',
    productInfo: quickViewStoreView.getQuickViewProduct(state),
    onColorChange: storeOperators.quickViewOperator.setActiveProductColor,
    onSubmit: ownProps.onSubmit || storeOperators.cartFormOperator.submitAddItemToCart,
    onSubmitSuccess: ownProps.onSubmitSuccess || storeOperators.quickViewOperator.openAddedToBagNotification,
    onCloseClick: storeOperators.quickViewOperator.clearQuickViewRequest,
    initialValues: quickViewStoreView.getQuickViewFormInitialValues(state, ownProps.initialValues),
    isMobile: routingInfoStoreView.getIsMobile(state)
  };
}

export let QuickViewCardProductCustomizeFormContainer = connectPlusStoreOperators({
  cartFormOperator: getCartFormOperator,
  quickViewOperator: getQuickViewOperator
}, mapStateToProps)(CardProductCustomizeForm);
