/**
 * @module ProductsGridContainer
 * @author Gabriel Gomez
 */

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {ProductsGrid} from './ProductsGrid.jsx';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';
import {productListingStoreView} from 'reduxStore/storeViews/productListingStoreView.js';
import {getProductsOperator} from 'reduxStore/storeOperators/productsOperator';
import {getProductsFormOperator} from 'reduxStore/storeOperators/formOperators/productsFormOperator';
import {getQuickViewOperator} from 'reduxStore/storeOperators/quickViewOperator';
import {recommendationsStoreView} from 'reduxStore/storeViews/recommendationsStoreView';
import {quickViewStoreView} from 'reduxStore/storeViews/quickViewStoreView';

const mapStateToProps = function (state, ownProps, storeOperators) {
  let outfits = recommendationsStoreView.getAllOutfitRecommendations(state);
  let quickViewRequestInfo = quickViewStoreView.getQuickViewRequestInfo(state);

  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    currencySymbol: sitesAndCountriesStoreView.getCurrentCurrencySymbol(state),
    productsBlocks: productListingStoreView.getLoadedProductsPages(state),
    outfits: outfits,
    onLoadMoreProducts: storeOperators.productsOperator.getProductsListingMoreProducts,
    onCustomLoadMoreProducts: storeOperators.productsOperator.getCustomProductsListingMoreProducts,
    onAddItemToFavorites: storeOperators.productsFormOperator.addToDefaultWishlist,
    isShowFilters: !outfits.length,
    isShowCategoryGrouping: productListingStoreView.getIsShowCategoryGrouping(state),
    showQuickViewForProductId: quickViewRequestInfo.showBopis ? '' : quickViewRequestInfo.requestorKey,
    isShowBopisModal: quickViewRequestInfo.showBopis,
    onQuickViewOpenClick: storeOperators.quickViewOperator.loadQuickViewInfo,
    isBopisEnabled: sitesAndCountriesStoreView.getIsBopis(state),
    onQuickBopisOpenClick: storeOperators.quickViewOperator.loadBopisQuickViewInfo,
    onColorChange: storeOperators.productsOperator.getListingProductExtraColorInfo,
    uniqueGridBlockId: productListingStoreView.getUniqueGridBlockId(state)
  };
};

export let ProductsGridContainer = connectPlusStoreOperators({
  productsOperator: getProductsOperator,
  productsFormOperator: getProductsFormOperator,
  quickViewOperator: getQuickViewOperator
}, mapStateToProps)(ProductsGrid);
ProductsGridContainer.displayName = 'ProductsGridContainer';
