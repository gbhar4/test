import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {FavoriteButton} from './FavoriteButton.jsx';
import {getProductsFormOperator} from 'reduxStore/storeOperators/formOperators/productsFormOperator.js';
import {favoritesStoreView} from 'reduxStore/storeViews/favoritesStoreView.js';

function mapStateToProps (state, ownProps, storeOperators) {
  let favoritesDefaultWishList = favoritesStoreView.getDefaultWishlistItemIds(state);
  let isProductInFavorites = favoritesDefaultWishList[ownProps.colorProductId] ? favoritesDefaultWishList[ownProps.colorProductId].isInDefaultWishlist : false;

  return {
    isProductInFavorites: isProductInFavorites,
    isActiveHoverMessage: ownProps.isActiveHoverMessage && !isProductInFavorites,
    onAddItemToFavorites: storeOperators.productsFormOperator.addToDefaultWishlistAndReloadCount
  };
}

export let FavoriteButtonContainer = connectPlusStoreOperators({
  productsFormOperator: getProductsFormOperator
}, mapStateToProps)(FavoriteButton);
