import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {BopisModalContainer} from 'views/components/bopis/BopisModalContainer';
import {getQuickViewOperator} from 'reduxStore/storeOperators/quickViewOperator.js';
import {quickViewStoreView} from 'reduxStore/storeViews/quickViewStoreView';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    productInfo: quickViewStoreView.getQuickViewProduct(state),
    initialValues: quickViewStoreView.getQuickViewFormInitialValues(state, ownProps.initialValues),
    onCloseClick: storeOperators.quickViewOperator.clearQuickViewRequest,
    requestorKey: quickViewStoreView.getQuickViewRequestInfo(state).requestorKey
  };
}

export let BopisModalContainerQuick = connectPlusStoreOperators({
  quickViewOperator: getQuickViewOperator
}, mapStateToProps)(BopisModalContainer);
