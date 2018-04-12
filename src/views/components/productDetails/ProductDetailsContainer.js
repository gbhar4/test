/** @module ProductDetailsContainer
 *
 * @author Miguel <malvarez@minutentag.com>
 * @author Ben
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {ProductDetails} from './ProductDetails.jsx';
import {productDetailsStoreView} from 'reduxStore/storeViews/productDetailsStoreView';
import {getProductsOperator} from 'reduxStore/storeOperators/productsOperator.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {getRoutingOperator} from 'reduxStore/storeOperators/routingOperator.js';

function mapStateToProps (state, ownProps, storeOperators) {

  return {
    isShowGoBack: productDetailsStoreView.getIsShowGoBackLinkInPdp(),
    onGoBack: storeOperators.routingOperator.goBack,
    breadcrumbs: productDetailsStoreView.getCurrentProductBreadcrumbs(state),
    productInfo: productDetailsStoreView.getCurrentProduct(state),
    currentColorProductId: productDetailsStoreView.getCurrentColorProductId(state),
    isMobile: routingInfoStoreView.getIsMobile(state)
  };
}

export let ProductDetailsContainer = connectPlusStoreOperators({
  productsOperator: getProductsOperator,
  routingOperator: getRoutingOperator
}, mapStateToProps)(ProductDetails);
