/**
* @module FavoritesDynamicAbstractors
* @author Michael Citro
*/
import {endpoints} from './endpoints.js';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {ServiceResponseError} from 'service/ServiceResponseError';
import {AVAILABILITY} from 'reduxStore/storeReducersAndActions/cart/cart';
import {parseBoolean} from '../apiUtil';
import {getExtraImages} from 'service/WebAPIServiceAbstractors/productsDynamicAbstractor.js';

let previous = null;
const FAKE_WISHLIST_ID = 'fake_sv2a9';

export function getFavoritesAbstractors (apiHelper) {
  if (!previous || previous.apiHelper !== apiHelper) {
    previous = new FavoritesDynamicAbstractors(apiHelper);
  }
  return previous;
}

class FavoritesDynamicAbstractors {
  constructor (apiHelper) {
    this.apiHelper = apiHelper;

    // create this-bound varsions of all methods of this class
    bindAllClassMethodsToThis(this);
  }

  /**
   * @function getSharableLink
   * @see https://childrensplace.atlassian.net/wiki/display/DT/TCP+API+Specifications?preview=/44072969/69075593/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_shareWishList_v1.docx
  */
  getSharableLink (wishlistId) {
    let payload = {
      header: {
        externalId: wishlistId,
        type: 'link'
      },
      webService: endpoints.shareWishListForUser
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      return {link: res.body.status.copyLink};
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function shareWishlistByEmail
   * @param {string} wishlistId - The is of the wishlist you would like to share
   * @param {string} from - The current users email address
   * @param {array<string>} to - An array of strings, each string being an email address
   * @param {string} message - A string message to be sent
   * @see https://childrensplace.atlassian.net/wiki/display/DT/TCP+API+Specifications?preview=/44072969/69075593/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_shareWishList_v1.docx
  */
  shareWishlistByEmail (wishlistId, from, to, subject, message) {
    let payload = {
      header: {
        externalId: wishlistId,
        type: 'email'
      },
      body: {
        recipientEmail: to.map((email) => ({email: (email || '').trim()})),
        senderEmail: from,
        subject: subject,
        message: message
      },
      webService: endpoints.shareWishListForUser
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      return {success: true};
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function deleteWishList
   * @param {string} wishlistId - The is of the wishlist you would like to share
   * @see https://childrensplace.atlassian.net/wiki/display/DT/TCP+API+Specifications?preview=/44072969/69011822/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_deleteWishList_v1.docx
  */
  deleteWishList (wishlistId) {
    let payload = {
      header: {
        externalId: wishlistId
      },
      webService: endpoints.deleteWishListForUser
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      return {success: true};
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function deleteWishListItem
   * @param {string} wishlistId - id of the wishlist you would like to share
   * @param {string} itemId - id of the item you want to remove
   * @see https://childrensplace.atlassian.net/wiki/display/DT/TCP+API+Specifications?preview=/44072969/69011822/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_deleteWishList_v1.docx
  */
  deleteWishListItem (wishlistId, itemId) {
    let payload = {
      header: {
        externalId: wishlistId,
        itemId: itemId
      },
      webService: endpoints.deleteWishListItemForUser
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      return {success: true};
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function createWishList
   * @param {string} wishlistId - The is of the wishlist you would like to create
   * @param {string} isDefault - flags if this should become the favorite wishlist
   * @see https://childrensplace.atlassian.net/wiki/display/DT/TCP+API+Specifications?preview=/44072969/69011584/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_createWishList_v1.docx
  */
  createWishList (wishlistName, isDefault) {
    let payload = {
      body: {
        descriptionName: wishlistName,
        state: isDefault ? 'Default' : 'Active'
      },
      webService: endpoints.createWishListForUser
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      return {
        id: res.body.uniqueID,
        success: true
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function getUserWishLists
   * @see https://childrensplace.atlassian.net/wiki/display/DT/TCP+API+Specifications?preview=/44072969/68038386/TCP%20-%20API%20Design%20Specification%20-%20Category-CART_getListofWishList_v1.docx
  */
  getUserWishLists (userName) {
    let payload = {
      webService: endpoints.getListofWishList
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      if (!res.body || !res.body.length) {
        // Fucking backend won't create a default one, so we need to mimic one
        return [{
          id: FAKE_WISHLIST_ID,
          displayName: userName + "'s Favorites",
          isDefault: true,
          itemsCount: 0,
          shareableLink: ''
        }];
      }

      let containsDefaultWishlist = false;
      let wishlists = res.body.map((wishlist) => {
        containsDefaultWishlist = containsDefaultWishlist || wishlist.status === 'Default';
        return {
          id: wishlist.giftListExternalIdentifier + '',
          displayName: wishlist.nameIdentifier,
          isDefault: wishlist.status === 'Default',
          itemsCount: wishlist.itemCount,
          shareableLink: this.apiHelper.configOptions.assetHost + '/' + this.apiHelper.configOptions.siteId + '/favorites?wishlistId=' + wishlist.giftListExternalIdentifier + '&guestAccessKey=' + wishlist.guestAccessKey // FIXME: this should be at routing level
        };
      });

      // wonderful, service might not return a default one
      if (!containsDefaultWishlist) {
        wishlists[0].isDefault = true;
      }

      return wishlists;
    }).catch((err) => {
      if (err && err.response && err.response.body && err.response.body.errorCode === 'NO_WISHLIST_FOUND') {
        return [{
          id: FAKE_WISHLIST_ID,
          displayName: userName + "'s Favorites",
          isDefault: true,
          itemsCount: 0,
          shareableLink: ''
        }];
      }

      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function addItemToWishlist
   * @summary This API is used to add an item to your wishlist.
   * @param {String} wishlistId - The id of the users wishlist that the item will be moved to, see getMyWishlists for lists of ids and deafult wishlist
   * @param {String} skuIdOrProductId - This is the unique id that each products color/size combo has. you can get this from the getItemsAndSummary
   * @param {Integer} quantity - The quantity that should be added to your wishlist
   * @param {Integer} isProduct - Indicates the id sent is a general product id vs a sku id
   * @see https://childrensplace.atlassian.net/wiki/pages/viewpage.action?spaceKey=DT&title=API+Specification+Documentation&preview=/44072969/57835523/TCP%20-%20API%20Design%20Specification%20-%20Category-CART_addItemToWishlist_v6.docx
   */
  addItemToWishlist (wishlistId, skuIdOrProductId, quantity, isProduct) {
    let payload = {
      header: {
        externalId: wishlistId,
        addItem: true
      },
      body: {
        item: [
          {
            productId: skuIdOrProductId,
            quantityRequested: quantity + '',
            isProduct: isProduct ? 'TRUE' : 'FALSE'
          }
        ]
      },
      webService: endpoints.addOrUpdateWishlist
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      let newItem = res.body.item[0];

      return { newItemId: newItem && newItem.giftListItemID };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function updateWishlistName
   * @summary This API is used to update your wishlist name.
   * @param {String} newName - The wishlist's name that it will now be refered to
   * @param {String} wishlistId - Id of the wishlist you want to update
   * @param {Boolean} isDefault - Whether to make the wishlist as the default one
   * @see https://childrensplace.atlassian.net/wiki/display/DT/TCP+API+Specifications?preview=/44072969/68045657/TCP%20-%20API%20Design%20Specification%20-%20Category-CART_EditWishlist_v3.docx

   */
  updateWishlistName (wishlistId, newName, isDefault) {
    let payload = {
      header: {
        externalId: wishlistId !== FAKE_WISHLIST_ID ? wishlistId : null
      },
      body: {
        descriptionName: newName,
        // giftListId: wishlistId !== FAKE_WISHLIST_ID ? wishlistId : '',
        state: isDefault ? 'Default' : 'Active'
      },
      webService: endpoints.editWishList
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return {success: true};
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function updateWishlistIsDefault
   * @summary This API is used to update your defualt wishlit.
   * @param {String} isDefault - Is this the defualt wishlist
   * @param {String} wishlistId - Id of the wishlist you want to update
   * @see https://childrensplace.atlassian.net/wiki/display/DT/TCP+API+Specifications?preview=/44072969/68045674/TCP%20-%20API%20Design%20Specification%20-%20Category-CART_makeWishlistasDefault_v3.docx

   */
  updateWishlistIsDefault (isDefault, wishlistId) {
    let payload = {
      header: {

      },
      body: {
        isDefault: isDefault,
        giftListId: wishlistId
      },
      webService: endpoints.makeWishListasDefault
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return {success: true};
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function moveWishListItem
   * @summary This API is used to add an item to your wishlist.
   * @param {String} fromWishListId - Id of the wishlist you are moving the item from
   * @param {String} toWishListId - Id of the wishlist you are moving the item to
   * @param {String} wishListItemId - The wishlist item id that is being moved
   * @param {String} sku - The wishlist item sku
   * @param {Number} quantity - The wishlist item quantity to move
   * @see https://childrensplace.atlassian.net/wiki/display/DT/TCP+API+Specifications?preview=/44072969/66947252/TCP%20-%20API%20Design%20Specification%20-%20Category-CART_MoveItemfromOneWishListToAnother_v3.docx
   */
  moveWishListItem (args) {
    let payload = {
      header: {
        'Content-Type': 'application/json',
        itemId: args.wishListItemId,
        addItem: 'true',
        fromExternalId: args.fromWishListId,
        toExternalId: args.toWishListId
        // giftListItemId: args.wishListItemId,
        // quantity: args.quantity
      },
      body: {
        item: [{
          productId: args.isProduct ? args.generalProductId : args.skuId,
          quantityRequested: args.quantity.toString(),
          isProduct: args.isProduct ? 'TRUE' : 'FALSE'
        }]
      },
      webService: endpoints.moveWishListItem
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return {success: true};
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function getWishListbyId
   * @param {String} wishListId - Id of the wishlist you are moving the item from
   * @param {String} userName - Backend is not going to return a default wishlist, so if the service returns nothing we need to fake one.
   * @param {String} guestAccessKey - guestAccessKey for shared wishlist
   * @see https://childrensplace.atlassian.net/browse/DT-24970
   * @see https://childrensplace.atlassian.net/wiki/display/DT/TCP+API+Specifications?preview=/44072969/69013363/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_getWishListById_v1.docx
   */

  getWishListbyId (wishListId, userName, guestAccessKey, isCanada, imageGenerator) {
    let payload = {
      header: {
        externalId: wishListId,
        guestAccessKey: guestAccessKey
      },
      webService: endpoints.getWishListbyId
    };

    // Fucking backend won't create a default one, so we need to mimic one
    if (wishListId === FAKE_WISHLIST_ID) {
      return Promise.resolve({
        id: FAKE_WISHLIST_ID,
        displayName: userName + "'s Favorites",
        creatorName: userName,
        isDefault: true,
        items: []
      });
    }

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      let wishlist = res.body;
      let pendingPromises = [];

      let rv = {
        id: wishlist.externalIdentifier,
        displayName: wishlist.descriptionName,
        creatorName: userName,
        isDefault: wishlist.default === 'true',
        items: wishlist.item.map((item, index) => {
          pendingPromises.push(getExtraImages(item.productPartNumber, false, imageGenerator)
            .then((extraImages) => {
              if (extraImages.length === 0) {
                extraImages = [{
                  iconSizeImageUrl: '/wcsstore/static/images/im_NotFound.svg',
                  listingSizeImageUrl: '/wcsstore/static/images/im_NotFound.svg',
                  regularSizeImageUrl: '/wcsstore/static/images/im_NotFound.svg',
                  bigSizeImageUrl: '/wcsstore/static/images/im_NotFound.svg',
                  superSizeImageUrl: '/wcsstore/static/images/im_NotFound.svg'
                }];
              }

              rv.items[index].imagesByColor[item.productColor].extraImages = extraImages;
            }));

          return {
            productInfo: {
              generalProductId: item.parentProductId,
              name: item.productName,
              isGiftCard: item.isGiftCard !== '0',
              pdpUrl: item.productURL,
              listPrice: item.ListPrice,
              offerPrice: isCanada ? item.OfferPriceCAD : item.OfferPriceUS
            },
            skuInfo: {
              skuId: item.productId,
              upc: parseBoolean(item.isProduct) ? null : (item.sizes[item.productId] || {}).UPC,
              imageUrl: item.imagePath,

              // REVIEW: I'm not sure this is the correct place for it,
              // it's just a value we need to store to send to the recommendations service
              colorProductId: item.productPartNumber,
              color: {
                name: item.productColor,
                imagePath: imageGenerator(item.thumbnail).colorSwatch
              },
              fit: (item.sizes[item.productId] || {}).TCPFit,
              size: parseBoolean(item.isProduct) ? null : (item.sizes[item.productId] || {}).TCPSize
            },
            itemInfo: {
              itemId: item.giftListItemID,
              quantity: parseInt(item.quantityRequested),
              store: null,
              storeZipCode: null,
              availability: item.availability === 'Available' ? AVAILABILITY.OK : AVAILABILITY.SOLDOUT // AVAILABILITY.UNAVAILABLE is there but backend doesn't provide it
            },
            imagesByColor: {
              [item.productColor]: {
                extraImages: []
              }
            },
            miscInfo: {
              // when an item is added to the wishlist, backend chosses a random sku,
              // and we need to pass that random sku when moving to a different wishlist.
              // since that is the case we also need to flag when to show the quivkiew for such item
              isShowQuickView: parseBoolean(item.isProduct),
              // FIXME: BE to get a BOPIS flag
              isBopisEligible: !!item.itemTCPROPISUSStore,
              itemTCPROPISUSStore: null, // FIXME: We need
              clearanceItem: (item.itemTCPProductInd || '').toLowerCase() === 'clearance', // for sorting
              newArrivalItem: (item.itemTCPProductInd || '').toLowerCase() === 'new arrivals' // for sorting
            },
            quantityPurchased: parseInt(item.quantityBought)
          };
        })
      };

      return Promise.all(pendingPromises).then(() => rv);
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }
}
