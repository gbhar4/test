import {getSubmissionError} from '../operatorHelper';
import {getCartOperator} from '../cartOperator';
import {getSetIsUpdatingActn, getDeleteItemActn, getSetLastDeletedItemIdActn, getSetLastMovedToWishlistItemIdActn, setLastUpdatedItemId, getSetRecentlyRemovedCountActn} from 'reduxStore/storeReducersAndActions/cart/cart';
import {getCartAbstractor} from 'service/cartServiceAbstractor';
import {getProductsAbstractor} from 'service/productsServiceAbstractor';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {getUserOperator} from 'reduxStore/storeOperators/userOperator.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {getSkuId, getMapSliceForColor} from 'util/viewUtil/productsCommonUtils';
import {getStoresOperator} from 'reduxStore/storeOperators/storesOperator';
import {storesStoreView} from 'reduxStore/storeViews/storesStoreView.js';
import {getStoresFormOperator} from 'reduxStore/storeOperators/formOperators/storesFormOperator.js';
import {routingStoreView} from 'reduxStore/storeViews/routing/routingStoreView';
import {PAGES} from 'routing/routes/pages';

let previous = null;
export function getCartFormOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new CartFormOperator(store);
  }
  return previous;
}

class CartFormOperator {
  constructor (store) {
    this.store = store;
    bindAllClassMethodsToThis(this);
  }

  get cartServiceAbstractor () {
    return getCartAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  get productsServiceAbstractor () {
    return getProductsAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  submitRemoveOOSItems () {
    let storeState = this.store.getState();

    let oosCount = cartStoreView.getOOSCount(storeState);
    if (oosCount <= 0) return Promise.resolve();      // nothing to do
    let oosItemsIds = cartStoreView.getOOSItemsIds(storeState);     // get id's of unavailable itmes
    return this.submitRemoveOOSOrUnavailableItems(oosCount, oosItemsIds);
  }

  submitRemoveUnavailableItems () {
    let storeState = this.store.getState();

    let unavailableCount = cartStoreView.getUnavailableCount(storeState);
    if (unavailableCount <= 0) return Promise.resolve();      // nothing to do
    let unavailableItemsIds = cartStoreView.getUnavailableItemsIds(storeState);     // get id's of unavailable itmes
    return this.submitRemoveOOSOrUnavailableItems(unavailableCount, unavailableItemsIds);
  }

  submitRemoveOOSOrUnavailableItems (count, itemsIds) {
    this.store.dispatch(itemsIds.map((itemId) => getSetIsUpdatingActn(itemId, true)));     // flag unavailable items as being updated
    return this.cartServiceAbstractor.removeItem(itemsIds)        // try to remove unavailable items
    .then(() => {
      this.reloadAffectedValues();      // reload cart, coupons, rewards, etc.

      this.store.dispatch(getSetRecentlyRemovedCountActn(count));
      setTimeout(() => {
        this.store.dispatch(getSetRecentlyRemovedCountActn(0));
      }, 3000);
    })
    .catch((err) => {
      // flag unavailable items as not being updated
      this.store.dispatch(itemsIds.map((itemId) => getSetIsUpdatingActn(itemId, true)));
      throw getSubmissionError(this.store, 'submitRemoveUnavailableItems', err);
    });
  }

  submitUpdateCartItem (itemId, newProductId, quantity) {
    // Note that we call the service even if the skuId and the quantity did not change.
    // This is in order to allow the backend to check availability against the current inventory.
    let item = cartStoreView.getItem(this.store.getState(), itemId);
    if (!item) throw new Error(`submitUpdateCartItem: item with id '${itemId}' not found`);

    this.store.dispatch(getSetIsUpdatingActn(itemId, true));
    return this.cartServiceAbstractor.updateItem(itemId, newProductId, quantity)
    .then(() => {
      this.reloadAffectedValues();      // reload cart, coupons, rewards, etc.

      this.store.dispatch(setLastUpdatedItemId(itemId));
      setTimeout(() => {
        this.store.dispatch(setLastUpdatedItemId(null));
      }, 3000);
    })
    .catch((err) => {
      this.store.dispatch(getSetIsUpdatingActn(itemId, false));
      throw getSubmissionError(this.store, 'submitUpdateCartItem', err);
    });
  }

  submitDeleteCartItem (itemId) {
    let item = cartStoreView.getItem(this.store.getState(), itemId);
    if (!item) throw new Error(`submitDeleteCartItem: item with id '${itemId}' not found`);
    this.store.dispatch(getSetIsUpdatingActn(itemId, true));
    return this.cartServiceAbstractor.removeItem(itemId)
    .then(() => {
      this.store.dispatch([
        getDeleteItemActn(itemId),
        getSetIsUpdatingActn(itemId, false),
        getSetLastDeletedItemIdActn(itemId)
      ]);

      setTimeout(() => {
        this.store.dispatch(getSetLastDeletedItemIdActn(null));
      }, 3000);

      this.reloadAffectedValues();      // reload cart, coupons, rewards, etc.
    })
    .catch((err) => {
      this.store.dispatch(getSetIsUpdatingActn(itemId, false));
      throw getSubmissionError(this.store, 'submitDeleteCartItem', err);
    });
  }

  submitMoveCartItemToWishlist (itemId) {
    let state = this.store.getState();
    let item = cartStoreView.getItem(state, itemId);
    let isGuest = userStoreView.isGuest(state);

    if (!item) throw new Error(`submitMoveCartItemToWishlist: item with id '${itemId}' not found`);

    if (isGuest) {
      return getGlobalSignalsOperator(this.store).openAuthLoginModal(() => this.submitMoveCartItemToWishlist(itemId));
    } else {
      this.store.dispatch(getSetIsUpdatingActn(itemId, true));
      return this.cartServiceAbstractor.addItemToDefaultWishlist(item.productInfo.skuId, item.itemInfo.quantity)
      .then((res) => this.cartServiceAbstractor.removeItem(itemId))
      .then(() => {
        this.store.dispatch([
          getSetIsUpdatingActn(itemId, false),
          getDeleteItemActn(itemId),
          getSetLastMovedToWishlistItemIdActn(itemId)
        ]);
        // TODO: reload wishlist if on wishlist page
        setTimeout(() => {
          this.store.dispatch(getSetLastMovedToWishlistItemIdActn(null));
        }, 3000);

        this.reloadAffectedValues();      // reload cart, coupons, rewards, etc.
      })
      .catch((err) => {
        this.store.dispatch(getSetIsUpdatingActn(itemId, false));
        throw getSubmissionError(this.store, 'moveCartItemToWishlist', err);
      });
    }
  }

  submitAddItemToCart (productInfoOrWishlistItem, formData) {
    let cartItemInfo = getCartItemInfo(productInfoOrWishlistItem, formData);
    // NOTE: in case adding to bag from wishlist, backend needs the wishlist item id
    // to keep track of "purchased" items from the wishlist.
    // Of course it doesn't make sense as the user could look for the same product on plp
    // and it wouldn't be counted when it should, but that's the requirement we got
    let wishlistItemId = formData.wishlistItemId || (productInfoOrWishlistItem.itemInfo && productInfoOrWishlistItem.itemInfo.itemId);
    return this.productsServiceAbstractor.addItemToCart(cartItemInfo.skuInfo.skuId, cartItemInfo.quantity, wishlistItemId)
    .then(() => {
      let isCart = routingStoreView.getCurrentPageId(this.store.getState()) === PAGES.cart.id;
      this.reloadAffectedValues(!isCart);

      return cartItemInfo;            // return info neeed to display successful adding notification
    })
    .catch((err) => {
      throw getSubmissionError(this.store, 'submitAddItemToCart', err);
    });
  }

  submitAddItemToPreferredStoreCart (productInfoOrWishlistItem, formData, preferredStoreId) {
    let cartItemInfo = getCartItemInfo(productInfoOrWishlistItem, formData);

    return getStoresFormOperator(this.store).isItemAvailableOnFavoriteStore(cartItemInfo.skuInfo.skuId, cartItemInfo.quantity).then((isSkuAvailableInStore) => {
      if (isSkuAvailableInStore) {
        return this.cartServiceAbstractor.addBopisItemToCart(preferredStoreId, cartItemInfo.skuInfo.skuId, cartItemInfo.quantity)
        .then(() => {
          this.reloadAffectedValues();
          return cartItemInfo;            // return info neeed to display successful adding notification
        });
      } else {
        // item is not available on the preferred store
        return null;
      }
    }).catch((err) => {
      throw getSubmissionError(this.store, 'submitAddItemToPreferredStoreCart', err);
    });
  }

  submitAddBopisItemToCart (formData) {
    return this.cartServiceAbstractor.addBopisItemToCart(formData.storeId, formData.skuId, formData.quantity)
    .then(() => {
      this.reloadAffectedValues();
      // if the selected store is different than the default store, the user's
      // default store may change depending on back-end different rules for
      // registered and guest users.
      let defaultStore = storesStoreView.getDefaultStore(this.store.getState());
      if (!defaultStore || formData.storeId !== defaultStore.basicInfo.id) {
        getStoresOperator(this.store).loadDefaultStore();
      }
    })
    .catch((err) => {
      throw getSubmissionError(this.store, 'submitAddBopisItemToCart', err);
    });
  }

  submitUpdateBopisItemInCart (formData, itemId) {
    let state = this.store.getState();
    let orderId = cartStoreView.getCurrentOrderId(state);
    let item = cartStoreView.getItem(state, itemId);
    let isItemShipToHome = !item.miscInfo.store;
    return this.cartServiceAbstractor.updateBopisItemInCart(orderId, itemId, isItemShipToHome,
      formData.storeId, formData.skuId, formData.quantity)
    .then(() => {
      this.reloadAffectedValues();
    })
    .catch((err) => {
      throw getSubmissionError(this.store, 'submitUpdateBopisItemInCart', err);
    });
  }

  reloadAffectedValues (loadCartCountOnly) {
    return Promise.all([
      // reload cart
      loadCartCountOnly ? getCartOperator(this.store).loadCartItemsCount() : getCartOperator(this.store).loadFullCartDetails(),
      // refresh coupons list (to reflect applied vs. available copuons) - cart content may affect eligibility of coupons
      getUserOperator(this.store).getAllAvailableCouponsAndPromos(),
      // reload rewards as cart content affects rewards potential
      getUserOperator(this.store).setRewardPointsData(),
      // refresh favorite store if something in cart was updated. DT-29883
      getStoresOperator(this.store).loadDefaultStore()
    ]);
  }
}

// -----------------------------------------

function getCartItemInfo (productInfoOrWishlistItem, customizationInfo) {
  if (productInfoOrWishlistItem.productInfo) {     // productInfoOrWishlistItem is a wishlistItem
    let {
      productInfo: {name, isGiftCard},
      skuInfo
    } = productInfoOrWishlistItem;
    return {isGiftCard, productName: name, skuInfo, quantity: 1};
  } else {                    // productInfoOrWishlistItem is a productInfo
    let {color, fit, size, quantity} = customizationInfo;
    let {name, colorFitsSizesMap, isGiftCard, imagesByColor} = productInfoOrWishlistItem;
    return {
      isGiftCard,
      productName: name,
      skuInfo: {
        skuId: getSkuId(colorFitsSizesMap, color, fit, size),
        imageUrl: imagesByColor[color].basicImageUrl || (imagesByColor[color].extraImages[0] || {}).iconSizeImageUrl,
        color: getMapSliceForColor(colorFitsSizesMap, color).color,
        fit,
        size
      },
      quantity
    };
  }
}
