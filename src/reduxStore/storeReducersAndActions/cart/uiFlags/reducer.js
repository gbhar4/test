import Immutable from 'seamless-immutable';

const defaultFlags = Immutable({
  isPayPalEnabled: false,
  lastItemUpdatedId: null,
  isTotalEstimated: true,
  isClosenessQualifier: false,
  recentlyRemovedItemsCount: 0,
  shouldRedirectBackTo: false
});

export function operationsReducer (flags = defaultFlags, action) {
  switch (action.type) {
    case 'CART_OPERATION_SET_IS_PAYPAL_ENABLED':
      return flags.set('isPayPalEnabled', action.isPayPalEnabled);
    case 'CART_OPERATION_SET_LAST_DELETED_ITEM_ID':
      return flags.set('lastDeletedItemId', action.lastDeletedItemId);
    case 'CART_OPERATION_SET_LAST_UPDATED_ITEM_ID':
      return flags.set('lastItemUpdatedId', action.lastItemUpdatedId);
    case 'CART_OPERATION_SET_LAST_MOVED_TO_WL_ITEM_ID':
      return flags.set('lastMovedToWishlistItemId', action.lastMovedToWishlistItemId);
    case 'CART_OPERATION_SET_IS_TOTAL_ESTIMATED':
      return flags.set('isTotalEstimated', action.isTotalEstimated);
    case 'CART_OPERATION_SET_RECENT_DELETED':
      return flags.set('recentDeleted', action.recentDeleted);
    case 'CART_OPERATION_SET_RECENT_MOVED_TO_WISHLIST':
      return flags.set('movedToWishlist', action.movedToWishlist);
    case 'CART_OPERATION_SET_IS_CLOSENESS_QUALIFIER':
      return flags.set('isClosenessQualifier', action.isClosenessQualifier);
    case 'CART_OPERATION_SET_RECENT_REMOVED_COUNT':
      return flags.set('recentlyRemovedItemsCount', action.count);
    default:
      return flags;
  }
}
