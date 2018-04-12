// TODO: rename actions to start with get and end with actions
export function setRecentDeleted (recentDeleted) {
  return {
    recentDeleted: recentDeleted,
    type: 'CART_OPERATION_SET_RECENT_DELETED'
  };
}

export function setMovedToWishlist (movedToWishlist) {
  return {
    movedToWishlist: movedToWishlist,
    type: 'CART_OPERATION_SET_RECENT_MOVED_TO_WISHLIST'
  };
}

export function getSetIsPayPalEnabledActn (isPayPalEnabled) {
  return {
    isPayPalEnabled,
    type: 'CART_OPERATION_SET_IS_PAYPAL_ENABLED'
  };
}

export function setLastUpdatedItemId (lastItemUpdatedId) {
  return {
    lastItemUpdatedId: lastItemUpdatedId,
    type: 'CART_OPERATION_SET_LAST_UPDATED_ITEM_ID'
  };
}

export function getSetLastDeletedItemIdActn (lastDeletedItemId) {
  return {
    lastDeletedItemId,
    type: 'CART_OPERATION_SET_LAST_DELETED_ITEM_ID'
  };
}

export function getSetLastMovedToWishlistItemIdActn (lastMovedToWishlistItemId) {
  return {
    lastMovedToWishlistItemId,
    type: 'CART_OPERATION_SET_LAST_MOVED_TO_WL_ITEM_ID'
  };
}

export function getSetIsTotalEstimatedAction (isTotalEstimated) {
  return {
    isTotalEstimated: isTotalEstimated,
    type: 'CART_OPERATION_SET_IS_TOTAL_ESTIMATED'
  };
}

export function getSetIsClosenessQualifierAction (isClosenessQualifier) {
  return {
    isClosenessQualifier: isClosenessQualifier,
    type: 'CART_OPERATION_SET_IS_CLOSENESS_QUALIFIER'
  };
}

export function getSetRecentlyRemovedCountActn (count) {
  return {
    count: count,
    type: 'CART_OPERATION_SET_RECENT_REMOVED_COUNT'
  };
}
