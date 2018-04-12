import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {FullSizeImageWithQuickViewModal} from './FullSizeImageWithQuickViewModal.jsx';
import {productDetailsStoreView} from 'reduxStore/storeViews/productDetailsStoreView';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    productInfo: productDetailsStoreView.getCurrentProduct(state)
  };
}

let FullSizeImageWithQuickViewModalContainer = connectPlusStoreOperators(mapStateToProps)(FullSizeImageWithQuickViewModal);

export {FullSizeImageWithQuickViewModalContainer};
