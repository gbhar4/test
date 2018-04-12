import {getSubmissionError} from 'reduxStore/storeOperators/operatorHelper.js';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {getFavoritesAbstractors} from 'service/favoritesServiceAbstractor';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {favoritesStoreView} from 'reduxStore/storeViews/favoritesStoreView';
import {getFavoritesOperator} from '../favoritesOperator';
import {getCartAbstractor} from 'service/cartServiceAbstractor';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';
import {getSetLastDeletedItemIdActn} from 'reduxStore/storeReducersAndActions/favorites/favorites';

let previous = null;
export function getFavoritesFormOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new FavoritesFormOperator(store);
  }
  return previous;
}

class FavoritesFormOperator {
  constructor (store) {
    this.store = store;
    bindAllClassMethodsToThis(this);
  }

  get favoritesAbstractors () {
    return getFavoritesAbstractors(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  get cartServiceAbstractor () {
    return getCartAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  submitMoveItemToOtherWishlist (formData) {
    let activeWishlistId = favoritesStoreView.getActiveWishlistId(this.store.getState());
    let activeWishlistItem = favoritesStoreView.getActiveWishlistItem(this.store.getState(), formData.itemId);

    let args = {
      fromWishListId: activeWishlistId,
      toWishListId: formData.toWishListId,
      generalProductId: activeWishlistItem.productInfo.generalProductId,
      skuId: activeWishlistItem && activeWishlistItem.skuInfo.skuId,
      wishListItemId: formData.itemId,
      quantity: activeWishlistItem && activeWishlistItem.itemInfo.quantity,
      isProduct: !activeWishlistItem.skuInfo.size
    };

    return this.favoritesAbstractors.moveWishListItem(args)
      .then((res) => getFavoritesOperator(this.store).loadWishlistsSummariesAndCurrent(activeWishlistId))
      .catch((err) => {
        throw getSubmissionError(this.store, 'submitMoveItemToOtherWishlist', err);
      });
  }

  submitDeleteWishlistItem (formData) {
    let activeWishlistId = favoritesStoreView.getActiveWishlistId(this.store.getState());

    return this.favoritesAbstractors.deleteWishListItem(activeWishlistId, formData.itemId)
      .then((res) => {
        this.store.dispatch(getSetLastDeletedItemIdActn(formData.itemId));

        setTimeout(() => {
          this.store.dispatch(getSetLastDeletedItemIdActn(null));
        }, 3000);

        getFavoritesOperator(this.store).loadWishlistsSummariesAndCurrent(activeWishlistId)
      })
      .catch((err) => {
        throw getSubmissionError(this.store, 'submitDeleteWishlistItem', err);
      });
  }

  submitCreateWishList (formData) {
    return this.favoritesAbstractors.createWishList(formData.wishlistName, formData.setAsDefault)
      .then((res) => {
        getFavoritesOperator(this.store).loadWishlistsSummariesAndCurrent(res.id);
        return res;
      }).catch((err) => {
        throw getSubmissionError(this.store, 'submitCreateWishList', err);
      });
  }

  submitCreateWishListThenMoveItem (formData) {
    return this.favoritesAbstractors.createWishList(formData.wishlistName, formData.setAsDefault)
      .then((res) => this.submitMoveItemToOtherWishlist({
        toWishListId: res.id,
        itemId: formData.itemId
      })).catch((err) => {
        throw getSubmissionError(this.store, 'submitCreateWishListThenMoveItem', err);
      });
  }

  submitUpdateWishlist (formData) {
    return this.favoritesAbstractors.updateWishlistName(formData.wishlistId, formData.wishlistName, formData.setAsDefault)
    .then((res) => getFavoritesOperator(this.store).loadWishlistsSummariesAndCurrent(formData.wishlistId))
    .catch((err) => {
      throw getSubmissionError(this.store, 'submitUpdateWishlist', err);
    });
  }

  submitDeleteWishlist (wishlistId) {
    return this.favoritesAbstractors.deleteWishList(wishlistId)
      .then((res) => getFavoritesOperator(this.store).loadWishlistsSummariesAndDefault())
      .catch((err) => {
        throw getSubmissionError(this.store, 'submitDeleteWishlist', err);
      });
  }

  submitShareWishlistByEmail (formData) {
    let activeWishlistId = favoritesStoreView.getActiveWishlistId(this.store.getState());
    let {shareToEmailAddresses, shareFromEmailAddresses, shareSubject, shareMessage} = formData;

    return this.favoritesAbstractors.shareWishlistByEmail(activeWishlistId, shareFromEmailAddresses, shareToEmailAddresses.split(','), shareSubject, shareMessage)
      .catch((err) => {
        throw getSubmissionError(this.store, 'submitShareWishlistByEmail', err);
      });
  }

  /**
   *  NOTE: Backend and product said its ok to do this. They know that if we do a remove and
   *  add it will change the order of the items on the screen and they are fine with that.
  */
  submitUpdateWishlistItem (formData) {
    let activeWishlistId = favoritesStoreView.getActiveWishlistId(this.store.getState());
    let {itemId, newSkuId, quantity} = formData;

    /** NOTE: The addItemToWishlist us a bad API! If you send the ID of an item in your wishlist
     *        it will update the quantity but add the new amount. Due to this we need to first delete
     *        the item and add the new one. We need to delete first due to us never knowing if the one we are
     *        trying to submit is the same as the current item we have... yep
     */
    return this.favoritesAbstractors.deleteWishListItem(activeWishlistId, itemId)
      .then((res) => this.favoritesAbstractors.addItemToWishlist(activeWishlistId, newSkuId, quantity))
      .then((res) => getFavoritesOperator(this.store).loadWishlistsSummariesAndCurrent(activeWishlistId))
      .catch((err) => {
        throw getSubmissionError(this.store, 'submitUpdateWishlistItem', err);
      });
  }

  submitReplaceWishlistItem (itemId, colorProductId) {
    let activeWishlistId = favoritesStoreView.getActiveWishlistId(this.store.getState());
    return Promise.all([
      this.favoritesAbstractors.deleteWishListItem(activeWishlistId, itemId),
      this.favoritesAbstractors.addItemToWishlist(activeWishlistId, colorProductId, 1, true)
    ])
    .then(() => getFavoritesOperator(this.store).loadWishlistsSummariesAndCurrent(activeWishlistId))
    .catch((err) => {
      throw getSubmissionError(this.store, 'submitReplaceWishlistItem', err);
    });
  }

  // if this method rejects with an undefined then it means that the user is not loggewd in and dismissed the login dialog
  submitAddItemToDefaultWishlist (colorProductOrSkuId, quantity, isProduct) {
    let isGuest = userStoreView.isGuest(this.store.getState());

    if (isGuest) {
      return new Promise((resolve, reject) => {
        getGlobalSignalsOperator(this.store).openAuthLoginModal(
          () => {
            // call this method again, but now as logged in user, and pass on success or error result.
            this.submitAddItemToDefaultWishlist(colorProductOrSkuId, quantity, isProduct)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
          },
          () => reject()      // eslint-disable-line prefer-promise-reject-errors
        );
      });
    } else {
      return this.favoritesAbstractors.addItemToWishlist('', colorProductOrSkuId, quantity, isProduct)
      .catch((err) => {
        throw getSubmissionError(this.store, 'submitAddItemToDefaultWishlist', err);
      });
    }
  }

}
