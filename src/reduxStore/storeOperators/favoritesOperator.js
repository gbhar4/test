import {logErrorAndServerThrow} from './operatorHelper';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {getFavoritesAbstractors} from 'service/favoritesServiceAbstractor';
import {getVendorAbstractors, RECOMMENDATIONS_SECTIONS} from 'service/vendorServiceAbstractor';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {getSetWishlistsSummariesActn,
  getSetActiveWishlistActn,
  getSetIsWishlistReadOnlyActn,
  getSetSoldoutItemSuggestionActn
} from 'reduxStore/storeReducersAndActions/favorites/favorites';
import {userStoreView} from 'reduxStore/storeViews/userStoreView.js';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';
import {favoritesStoreView} from 'reduxStore/storeViews/favoritesStoreView.js';
import {getProductsOperator} from 'reduxStore/storeOperators/productsOperator.js';

let previous = null;
export function getFavoritesOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new FavoritesOperator(store);
  }
  return previous;
}

class FavoritesOperator {
  constructor (store) {
    this.store = store;
    bindAllClassMethodsToThis(this);
  }

  get favoritesAbstractors () {
    return getFavoritesAbstractors(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  get vendorAbstractors () {
    return getVendorAbstractors(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  loadWishlistsSummaries () {
    var userName = userStoreView.getUserContactInfo(this.store.getState()).firstName;

    return this.favoritesAbstractors.getUserWishLists(userName).then((wishlists) => {
      this.store.dispatch(getSetWishlistsSummariesActn(wishlists));
      return wishlists;
    }).catch((err) => logErrorAndServerThrow(this.store, 'loadWishlistsSummaries', err));
  }

  loadWishlistsSummariesAndDefault () {
    var userName = userStoreView.getUserContactInfo(this.store.getState()).firstName;
    var isCanada = sitesAndCountriesStoreView.getIsCanada(this.store.getState());
    let imageGenerator = getProductsOperator(this.store).getImgPath;

    return this.favoritesAbstractors.getUserWishLists(userName).then((wishlistSummaries) => {
      let defaultWishlist = wishlistSummaries.find((list) => list.isDefault);

      return this.favoritesAbstractors.getWishListbyId(defaultWishlist.id, userName, null, isCanada, imageGenerator).then((wishlistItems) => {
        this.store.dispatch([
          getSetWishlistsSummariesActn(wishlistSummaries),
          getSetActiveWishlistActn(wishlistItems)
        ]);

        return wishlistItems;
      });
    }).catch((err) => { logErrorAndServerThrow(this.store, 'loadWishlistsSummariesAndDefault', err); });
  }

  loadActiveWishlistByGuestKey (wishlistId, guestAccessKey) {
    var userName = userStoreView.getUserContactInfo(this.store.getState()).firstName;
    var isCanada = sitesAndCountriesStoreView.getIsCanada(this.store.getState());
    let imageGenerator = getProductsOperator(this.store).getImgPath;

    return this.favoritesAbstractors.getWishListbyId(wishlistId, userName, guestAccessKey, isCanada, imageGenerator).then((wishlistItems) => {
      this.store.dispatch([
        getSetIsWishlistReadOnlyActn(true),
        getSetActiveWishlistActn(wishlistItems)
      ]);
      return wishlistItems;
    }).catch((err) => logErrorAndServerThrow(this.store, 'loadActiveWishlistByGuestKey', err));
  }

  loadActiveWishlist (wishlistId) {
    var userName = userStoreView.getUserContactInfo(this.store.getState()).firstName;
    var isCanada = sitesAndCountriesStoreView.getIsCanada(this.store.getState());
    let imageGenerator = getProductsOperator(this.store).getImgPath;

    return this.favoritesAbstractors.getWishListbyId(wishlistId, userName, null, isCanada, imageGenerator).then((wishlistItems) => {
      this.store.dispatch(getSetActiveWishlistActn(wishlistItems));
      return wishlistItems;
    }).catch((err) => logErrorAndServerThrow(this.store, 'loadActiveWishlist', err));
  }

  loadWishlistsSummariesAndCurrent (wishlistId) {
    return Promise.all([this.loadActiveWishlist(wishlistId), this.loadWishlistsSummaries()]);
  }

  loadItemSuggestion (itemId) {
    let siteId = sitesAndCountriesStoreView.getCurrentSiteId(this.store.getState());
    let item = favoritesStoreView.getActiveWishlistItem(this.store.getState(), itemId);
    /* TODO: add a limit parameter to getProductRecommendations an use it here */
    return this.vendorAbstractors.getProductRecommendations(item.skuInfo.colorProductId,
      RECOMMENDATIONS_SECTIONS.FAVORITES, siteId).then((recommendations) => {
        recommendations.length > 0 && this.store.dispatch(getSetSoldoutItemSuggestionActn(recommendations[0], itemId));
      }).catch((err) => logErrorAndServerThrow(this.store, 'loadActiveWishlist', err));
  }

  clearItemSuggestion () {
    this.store.dispatch(getSetSoldoutItemSuggestionActn(null, null));
  }

}
