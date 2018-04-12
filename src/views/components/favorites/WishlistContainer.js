/** @module WishlistContainer
 * @author Ben
 */

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {Wishlist} from './Wishlist.jsx';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';
import {getFavoritesFormOperator} from 'reduxStore/storeOperators/formOperators/favoritesFormOperator.js';
import {getQuickViewOperator} from 'reduxStore/storeOperators/quickViewOperator.js';
import {quickViewStoreView} from 'reduxStore/storeViews/quickViewStoreView';
import {getCartFormOperator} from 'reduxStore/storeOperators/formOperators/cartFormOperator.js';

function mapStateToProps (state, ownProps, storeOperators) {
  let quickViewRequestInfo = quickViewStoreView.getQuickViewRequestInfo(state);

  return {
    currencySymbol: sitesAndCountriesStoreView.getCurrentCurrencySymbol(state),

    onRemoveItem: storeOperators.favoritesFormOperator.submitDeleteWishlistItem,
    onEditItem: storeOperators.favoritesFormOperator.submitUpdateWishlistItem,
    onAddItemToBag: storeOperators.cartFormOperator.submitAddItemToCart,
    onAddItemToBagSuccess: storeOperators.quickViewOperator.openAddedToBagNotification,

    onQuickViewOpenClick: storeOperators.quickViewOperator.loadQuickViewInfo,
    showQuickViewForItemId: quickViewRequestInfo.showBopis ? '' : quickViewRequestInfo.requestorKey
//    onQuickBopisOpenClick: storeOperators.quickViewOperator.loadBopisQuickViewInfo,
//    isShowBopisModal: quickViewRequestInfo.showBopis
  };
}

export let WishlistContainer = connectPlusStoreOperators({
  favoritesFormOperator: getFavoritesFormOperator,
  cartFormOperator: getCartFormOperator,
  quickViewOperator: getQuickViewOperator
}, mapStateToProps)(Wishlist);
