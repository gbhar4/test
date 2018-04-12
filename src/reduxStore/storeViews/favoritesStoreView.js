/** @module favoritesStoreView
 *
 * @author Ben
 */
import {AVAILABILITY} from 'reduxStore/storeReducersAndActions/cart/cart';
import Immutable from 'seamless-immutable';

export const NO_FILTER_ID = 'ALL';

export const WISHLIST_FILTERS = {
  [NO_FILTER_ID]: {
    displayName: 'All',
    filterMethod: (item) => true
  },
  AVAILABLE: {
    displayName: 'Available',
    filterMethod: (item) => item.itemInfo.availability === AVAILABILITY.OK
  },
  SOLDOUT: {
    displayName: 'Sold Out',
    filterMethod: (item) => item.itemInfo.availability === AVAILABILITY.SOLDOUT
  },
  PURCHASED: {
    displayName: 'Purchased',
    filterMethod: (item) => item.quantityPurchased > 0
  }
};

export const WISHLIST_SORTS = {
  UNSORTED: {
    displayName: 'RECENTLY ADDED',
    sortMethod: null
  },
  PRICE_ASCENDING: {
    displayName: 'Price: Low to High',
    sortMethod: (item1, item2) => item1.productInfo.offerPrice - item2.productInfo.offerPrice
  },
  PRICE_DESCENDING: {
    displayName: 'Price: High to Low',
    sortMethod: (item1, item2) => item2.productInfo.offerPrice - item1.productInfo.offerPrice
  },
  CLEARANCE: {
    displayName: 'Clearance',
    sortMethod: (item1, item2) => (item1.miscInfo.clearanceItem ? 0 : 1) - (item2.miscInfo.clearanceItem ? 0 : 1)
  },
  NEW_ARRIVAL: {
    displayName: 'New Arrivals',
    sortMethod: (item1, item2) => (item1.miscInfo.newArrivalItem ? 0 : 1) - (item2.miscInfo.newArrivalItem ? 0 : 1)
  }
};

export function getVisibleWishlistItems (items, filterId, sortId) {
  let filteredItems = Immutable.asMutable(items).filter(WISHLIST_FILTERS[filterId].filterMethod);
  let sortMethod = WISHLIST_SORTS[sortId].sortMethod;
  return sortMethod ? filteredItems.sort(sortMethod) : filteredItems;
}

export function getNonEmptyFiltersList (items) {
  return Object.keys(WISHLIST_FILTERS).map(key => ({
    id: key,
    displayName: WISHLIST_FILTERS[key].displayName,
    disabled: items.findIndex(WISHLIST_FILTERS[key].filterMethod) < 0
  }));
}

const sortsList = Object.keys(WISHLIST_SORTS).map(key => ({id: key, displayName: WISHLIST_SORTS[key].displayName}));

export function getSortsList () {
  return sortsList;
}

export const favoritesStoreView = {
  getIsFavoritesReadOnly,
  getWishlistsSummaries,
  getActiveWishlist,
  getActiveWishlistId,
  getActiveWishlistItem,
  getCurrentSuggestedProduct,
  getCurrentSuggestionSourceItemId,
  getMostExpensiveItem,
  getLastDeletedItemId,
  getDefaultWishlistItemIds
};

function getDefaultWishlistItemIds (state) {
  return state.favorites.defaultWishList;
}

function getMostExpensiveItem (state) {
  let topItem = null;
  let itemList = getActiveWishlist(state).items;

  for (let item of itemList) {
    if (!topItem || item.productInfo.offerPrice > topItem.productInfo.offerPrice) {
      topItem = item;
    }
  }

  return topItem;
}

function getIsFavoritesReadOnly (state) {
  // REVIEW: maybe not the best place for such a flag
  return state.favorites.isReadOnly;
}

function getWishlistsSummaries (state) {
  return state.favorites.wishlistsSummaries;
}

function getActiveWishlist (state) {
  return state.favorites.activeWishlist;
}

function getActiveWishlistId (state) {
  return state.favorites.activeWishlist && state.favorites.activeWishlist.id;
}

function getActiveWishlistItem (state, itemId) {
  return state.favorites.activeWishlist.items.find((item) => item.itemInfo.itemId === itemId);
}

function getCurrentSuggestedProduct (state) {
  return state.favorites.currentSuggestedProduct;
}

function getCurrentSuggestionSourceItemId (state) {
  return state.favorites.currentSuggestionSourceItemId;
}

function getLastDeletedItemId (state) {
  return state.favorites.lastDeletedItemId;
}
