/** @module
 * @summary action crerators for manipulating favorites related information.
 *
 * @author Ben
 */

 export function getSetWishlistsSummariesActn (wishlistsSummaries) {
   return {
     wishlistsSummaries: wishlistsSummaries,
     type: 'FAVORITES_SET_AVAILABLE_WISHLISTS'
   };
 }

 export function getSetActiveWishlistActn (activeWishlist) {
   return {
     activeWishlist: activeWishlist,
     type: 'FAVORITES_SET_ACTIVE_WISHLIST'
   };
 }

 export function getSetIsWishlistReadOnlyActn (isReadOnly) {
   return {
     isReadOnly,
     type: 'FAVORITES_SET_IS_READ_ONLY_WISHLIST'
   };
 }

 export function getSetSoldoutItemSuggestionActn (currentSuggestedProduct, suggestionSourceItemId) {
   return {
     currentSuggestedProduct,
     suggestionSourceItemId,
     type: 'FAVORITES_SET_SOLDOUT_ITEM_SUGGESTION'
   };
 }

 export function getSetDefaultWishListActn (wishList) {
   return {
     defaultWishList: wishList,
     type: 'FAVORITES_SET_DEFAULT_WISHLIST'
   };
 }

 export function getSetLastDeletedItemIdActn (lastDeletedItemId) {
   return {
     lastDeletedItemId,
     type: 'FAVORITES_SET_LAST_DELETED_ITEM_ID'
   };
 }
