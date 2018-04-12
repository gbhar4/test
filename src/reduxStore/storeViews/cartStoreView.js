import Immutable from 'seamless-immutable';
import {AVAILABILITY} from 'reduxStore/storeReducersAndActions/cart/cart.js';

export {AVAILABILITY};

export const SHIP_TO_TYPE = Immutable({
  HOME: 'ECOM',
  BOPIS: 'BOPIS'
});

export const cartStoreView = {
  getCurrentOrderId,
  getSummary,
  getItemsCount,
  getIsPayPalEnabled,
  getCartItems,
  getUnavailableCount,
  getOOSCount,
  getUnqualifiedCount,
  getLastUpdatedItemId,
  getLastMovedToWishlistItemId,
  getLastDeletedItemId,
  getIsTotalEstimated,
  getSubTotal,
  getGrandTotal,
  getItem,
  getIsMixedOrder,
  getIsOrderHasPickup,
  getIsOrderHasShipping,
  getEstimatedRewardsEarned,
  getEstimatedAirMiles,
  getIsEditingSomeItem,
  getUnqualifiedItemsIds,
  getUnavailableItemsIds,
  getOOSItemsIds,
  getRecentlyRemovedCount,
  getRewardToBeEarned,
  getPlaceCashSpotEnabled,
  getMostExpensiveItem,
  getIsShowingNotification
};

function getMostExpensiveItem (state) {
  let topItem = null;

  for (let item of state.cart.items) {
    if (!topItem || item.itemInfo.offerPrice > topItem.itemInfo.offerPrice) {
      topItem = item;
    }
  }

  return topItem;
}

function getIsEditingSomeItem (state) {
  return state.cart.items.findIndex((item) => item.itemStatus.isEditable) >= 0;
}

function getItem (state, itemId) {
  return state.cart.items.find((item) => item.itemInfo.itemId === itemId);
}

function getEstimatedRewardsEarned (state) {
  return state.cart.summary.estimatedRewards;
}

function getEstimatedAirMiles (state) {
  return state.cart.summary.estimatedAirMiles;
}

function getCurrentOrderId (state) {
  return state.cart.summary.orderId;
}

function getSummary (state) {
  return {
    ...state.cart.summary,
    orderBalanceTotal: state.cart.summary.grandTotal - state.cart.summary.giftCardsTotal
  };
}

function getItemsCount (state) {
  return state.cart.summary.itemsCount;
}

function getIsPayPalEnabled (state) {
  return state.cart.uiFlags.isPayPalEnabled;
}

function getCartItems (state) {
  // NOTE: Don't use this method to get the total items in the cart. Cart items may not be loaded but the count would be. get Items Count will have this info even if the cart was not loaded;
  return state.cart.items;
}

function getUnavailableCount (state) {
  return state.cart.items.reduce((count, item) => item.miscInfo.availability === AVAILABILITY.UNAVAILABLE ? count + 1 : count, 0);
}

function getOOSCount (state) {
  return state.cart.items.reduce((count, item) => item.miscInfo.availability === AVAILABILITY.SOLDOUT ? count + 1 : count, 0);
}

function getUnqualifiedCount (state) {
  return state.cart.items.reduce((count, item) => item.miscInfo.availability !== AVAILABILITY.OK ? count + 1 : count, 0);
}

/**  @return true if the order has both pickup (BOPIS) and ship to home items */
function getIsMixedOrder (state) {
  return getIsOrderHasPickup(state) && getIsOrderHasShipping(state);
}

/**  @return true if the order has a pickup (BOPIS) item */
function getIsOrderHasPickup (state) {
  // returns true if at least one item is bopis
  return state.cart.items.reduce((isPickup, item) => isPickup || !!item.miscInfo.store, false);
}

/**  @return true if the order has a ship-to-home item */
function getIsOrderHasShipping (state) {
  return state.cart.items.reduce((isShipToHome, item) => isShipToHome || !item.miscInfo.store, false);
}

function getLastUpdatedItemId (state) {
  return state.cart.uiFlags.lastItemUpdatedId;
}

function getLastMovedToWishlistItemId (state) {
  return state.cart.uiFlags.lastMovedToWishlistItemId;
}

function getLastDeletedItemId (state) {
  return state.cart.uiFlags.lastDeletedItemId;
}

function getIsTotalEstimated (state) {
  return state.cart.uiFlags.isTotalEstimated;
}

function getSubTotal (state) {
  return state.cart.summary.subTotal;
}

function getGrandTotal (state) {
  return state.cart.summary.grandTotal;
}

function getUnqualifiedItemsIds (state) {
  return state.cart.items.filter((item) => item.miscInfo.availability !== AVAILABILITY.OK).map((item) => item.itemInfo.itemId);
}

function getUnavailableItemsIds (state) {
  return state.cart.items.filter((item) => item.miscInfo.availability === AVAILABILITY.UNAVAILABLE).map((item) => item.itemInfo.itemId);
}

function getOOSItemsIds (state) {
  return state.cart.items.filter((item) => item.miscInfo.availability === AVAILABILITY.SOLDOUT).map((item) => item.itemInfo.itemId);
}

function getRecentlyRemovedCount (state) {
  return state.cart.uiFlags.recentlyRemovedItemsCount;
}

function getRewardToBeEarned (state) {
  return state.cart.summary.rewardsToBeEarned;
}

function getPlaceCashSpotEnabled (state) {
  return getRewardToBeEarned(state) > 0;
}

function getIsShowingNotification (state) {
  return !!state.cart.uiFlags.lastMovedToWishlistItemId || !!state.cart.uiFlags.lastDeletedItemId || !!state.cart.uiFlags.recentlyRemovedItemsCount;
}
