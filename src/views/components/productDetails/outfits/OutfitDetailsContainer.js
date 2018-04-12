/** @module OutfitDetailsContainer
 *
 * @author Ben
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {OutfitDetails} from './OutfitDetails.jsx';
import {productDetailsStoreView} from 'reduxStore/storeViews/productDetailsStoreView';
import {getQuickViewOperator} from 'reduxStore/storeOperators/quickViewOperator';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {getCartFormOperator} from 'reduxStore/storeOperators/formOperators/cartFormOperator.js';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {getRoutingOperator} from 'reduxStore/storeOperators/routingOperator.js';
import {getProductsOperator} from 'reduxStore/storeOperators/productsOperator';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    currencySymbol: sitesAndCountriesStoreView.getCurrentCurrencySymbol(state),
    onGoBack: storeOperators.routingOperator.goBack,
    outfit: productDetailsStoreView.getCurrentOutfit(state),
    isMobile: routingInfoStoreView.getIsMobile(state),
    onAddItemToBag: storeOperators.cartFormOperator.submitAddItemToCart,
    onSubmitSuccess: storeOperators.quickViewOperator.openAddedToBagNotification,
    onColorChange: storeOperators.productsOperator.setActiveOutfitProductColor
  };
}

export let OutfitDetailsContainer = connectPlusStoreOperators({
  cartFormOperator: getCartFormOperator,
  quickViewOperator: getQuickViewOperator,
  routingOperator: getRoutingOperator,
  productsOperator: getProductsOperator
}, mapStateToProps)(OutfitDetails);
