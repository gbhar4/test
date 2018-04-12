import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {Product} from './Product.jsx';
import {getProductsOperator} from 'reduxStore/storeOperators/productsOperator';
import {getCartFormOperator} from 'reduxStore/storeOperators/formOperators/cartFormOperator';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {getQuickViewOperator} from 'reduxStore/storeOperators/quickViewOperator';
import {productDetailsStoreView} from 'reduxStore/storeViews/productDetailsStoreView';
import {recommendationsStoreView} from 'reduxStore/storeViews/recommendationsStoreView';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    onColorChange: storeOperators.productsOperator.setActiveProductColor,
    currencySymbol: sitesAndCountriesStoreView.getCurrentCurrencySymbol(state),
    onAddItemToBag: storeOperators.cartFormOperator.submitAddItemToCart,
    onAddItemToBagSuccess: storeOperators.quickViewOperator.openAddedToBagNotification,
    isInventoryLoaded: productDetailsStoreView.getIsInventoryLoaded(state),
    outfits: recommendationsStoreView.getAllOutfitRecommendations(state)
  };
}

export let ProductContainer = connectPlusStoreOperators({
  productsOperator: getProductsOperator,
  cartFormOperator: getCartFormOperator,
  quickViewOperator: getQuickViewOperator
}, mapStateToProps)(Product);
