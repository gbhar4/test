/** @module FavoritesContainer
 * @author Ben, Agu
 */

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {Favorites} from './Favorites.jsx';
import {favoritesStoreView} from 'reduxStore/storeViews/favoritesStoreView';
import {getFavoritesOperator} from 'reduxStore/storeOperators/favoritesOperator.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {getFavoritesFormOperator} from 'reduxStore/storeOperators/formOperators/favoritesFormOperator.js';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isGuest: userStoreView.isGuest(state),
    isReadOnly: favoritesStoreView.getIsFavoritesReadOnly(state),
    wishListsSummaries: favoritesStoreView.getWishlistsSummaries(state),
    activeWishlist: favoritesStoreView.getActiveWishlist(state),
    activeWishlistCreatorName: 'connect to data', // used only for guest favorite read only mode
    isMobile: routingInfoStoreView.getIsMobile(state),

    onSelectWishlist: storeOperators.favoritesOperator.loadActiveWishlist,
    onCreateSubmit: storeOperators.favoritesFormOperator.submitCreateWishList,
    onEditSubmit: storeOperators.favoritesFormOperator.submitUpdateWishlist,
    onDeleteSubmit: storeOperators.favoritesFormOperator.submitDeleteWishlist
  };
}

let FavoritesContainer = connectPlusStoreOperators({
  favoritesOperator: getFavoritesOperator,
  favoritesFormOperator: getFavoritesFormOperator
}, mapStateToProps)(Favorites);

export {FavoritesContainer};
