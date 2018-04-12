import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {ProductRecommendationsList} from './ProductRecommendationsList.jsx';
import {recommendationsStoreView} from 'reduxStore/storeViews/recommendationsStoreView';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {getProductsFormOperator} from 'reduxStore/storeOperators/formOperators/productsFormOperator.js';
import {quickViewStoreView} from 'reduxStore/storeViews/quickViewStoreView';
import {getQuickViewOperator} from 'reduxStore/storeOperators/quickViewOperator.js';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';

let mapStateToProps = function (state, ownProps, storeOperators) {
  let quickViewRequestInfo = quickViewStoreView.getQuickViewRequestInfo(state);

  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    products: !ownProps.isBundledProducts
      ? recommendationsStoreView.getAllRecommendations(state)
      : recommendationsStoreView.getAllOutfitRecommendations(state),
    maxVisibleProducts: ownProps.maxVisibleProducts,
    stepSize: ownProps.stepSize,

    onAddItemToFavorites: storeOperators.productsFormOperator.addToDefaultWishlist,
    showQuickViewForProductId: quickViewRequestInfo.showBopis ? '' : quickViewRequestInfo.requestorKey,
//    isShowBopisModal: quickViewRequestInfo.showBopis,
    onQuickViewOpenClick: storeOperators.quickViewOperator.loadQuickViewInfo,
//    onQuickBopisOpenClick: storeOperators.quickViewOperator.loadBopisQuickViewInfo,
//    isShowBopisButton: !sitesAndCountriesStoreView.getIsCanada(state)
    currencySymbol: sitesAndCountriesStoreView.getCurrentCurrencySymbol(state),
    recommendationsListTitle: ownProps.recommendationsListTitle || 'You May Also Like'
  };
};

export let ProductRecommendationsListContainer = connectPlusStoreOperators({
  productsFormOperator: getProductsFormOperator,
  quickViewOperator: getQuickViewOperator
}, mapStateToProps)(ProductRecommendationsList);
