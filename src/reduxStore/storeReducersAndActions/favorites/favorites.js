/** @module
 * @summary reducer for favorites related information.
 *
 * @author Ben
 */
import Immutable from 'seamless-immutable';

const defaultFavoritesStore = Immutable({
  wishlistsSummaries: [],            // [{id, displayName, isDefault, itemsCount, shareableLink}]
  activeWishlist: null,              // {id, displayName, isDefault, items}
  isReadOnly: false,                  // indicates the user is on shared wishlist (REVIEW: move to UIFlags?)
  currentSuggestedProduct: null,      // holds the product being suggested in place of a soldout wishlist item
  currentSuggestionSourceItemId: null, // holds the id of the soldout wishlist item for which a product is being suggested
  lastDeletedItemId: null,
  defaultWishList: {}
});

export const STATUS = Immutable({
  PURCHASED: 'PURCHASED',
  SUGGESTED: 'SUGGESTED'
});

export function favoritesReducer (favorites = defaultFavoritesStore, action) {
  switch (action.type) {
    case 'FAVORITES_SET_AVAILABLE_WISHLISTS':
      return Immutable.merge(favorites, {wishlistsSummaries: action.wishlistsSummaries});
    case 'FAVORITES_SET_ACTIVE_WISHLIST':
      return Immutable.merge(favorites, {activeWishlist: action.activeWishlist});
    case 'FAVORITES_SET_IS_READ_ONLY_WISHLIST':
      return Immutable.merge(favorites, {isReadOnly: action.isReadOnly});
    case 'FAVORITES_SET_SOLDOUT_ITEM_SUGGESTION':
      return Immutable.merge(favorites, {
        currentSuggestedProduct: action.currentSuggestedProduct,
        currentSuggestionSourceItemId: action.suggestionSourceItemId
      });
    case 'FAVORITES_SET_DEFAULT_WISHLIST':
      return Immutable.set(favorites, 'defaultWishList', action.defaultWishList);
    case 'FAVORITES_SET_LAST_DELETED_ITEM_ID':
      return Immutable.merge(favorites, {lastDeletedItemId: action.lastDeletedItemId});
    default:
      return favorites;
  }
}

export * from './actionCreators';
