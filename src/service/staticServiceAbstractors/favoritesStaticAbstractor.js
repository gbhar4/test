/**
* @module Favorites Static Service Abstractors
* @author Michael Citro
* @author Gabriel Gomez
*/

import {editJsonPopup} from 'util/testUtil/editJsonPopup';

export function getFavoritesAbstractors () {
  return FavoritesStaticAbstractor;
}

const FavoritesStaticAbstractor = {

  getUserWishLists () {
    return editJsonPopup('getUserWishLists', [
      {
        id: '116001',
        displayName: 'Gabriel\'s Favorites',
        isDefault: true,
        itemsCount: 10,
        shareableLink: '/favorites/?wishlistId=116001&guestAccessKey=faabd87:15ca5acc593:-7f81'
      }, {
        id: '116002',
        displayName: 'Ddddddddddddddddddddddddd dddd ddd dddddddddddd',
        isDefault: false,
        itemsCount: 50,
        shareableLink: '/favorites/?wishlistId=116001&guestAccessKey=faabd87:15ca5acc593:-7f81'
      }, {
        id: '116003',
        displayName: 'DdddddddddddddddddddddddddddddddddddddDdddddddddd',
        isDefault: false,
        itemsCount: 2,
        shareableLink: '/favorites/?wishlistId=116001&guestAccessKey=faabd87:15ca5acc593:-7f81'
      }, {
        id: '116004',
        displayName: 'Maria Antonieta de las Nieves\'s Favorites',
        isDefault: false,
        itemsCount: 50,
        shareableLink: '/favorites/?wishlistId=116001&guestAccessKey=faabd87:15ca5acc593:-7f81'
      }
    ]);
  },

  getWishListbyId (wishlistId, userName, isShared) {
    return editJsonPopup('getWishListbyId', {
      id: '116001',
      displayName: 'Agu\'s Favorites',
      isDefault: true,
      creatorName: 'Noam', // needed for shared wishlist view
      items: [{
        productInfo: {
          generalProductId: 'g1_45',
          name: 'Cool Girls Shirt',
          pdpUrl: 'http://www.childrensplace.com/shop/us/p/Toddler-Girls-Neon-Colorblock-Fleece-Hat-2071143-1021',  // NOTE: it should be "productURL" of the old service.
          isGiftCard: false, // isGiftCard from old service.
          listPrice: 5.00,
          offerPrice: 10.00
        },
        skuInfo: {
          skuId: '878882',  // itemId
          upc: '00440001707209',
          // imageUrl: '/wcsstore/GlobalSAS/images/tcp/products/500/2071143_1021.jpg',  // NOTE: it should be "thumbnail" of the old service + image size (there're options for: 160, ,240, 300, 500, 700+; otherwise ask product)
          imageUrl: '/images/boys-denim-fpo.png',
          colorProductId: 'something',
          color: {
            name: 'Red',
            // imagePath: '/wcsstore/GlobalSAS/images/tcp/products/swatches/2071143_1021.jpg' // NOTE: see the path, it's basically the skuInfo with a slide change.
            imagePath: '/images/fpo-color-1.jpg'
          },
          fit: 'Slim', // look on the size table on the "itemId" key, and then extract the: TCPFit
          size: 'L (4T/5T)' // look on the size "table" on the "itemId" key, and then extract the: TCPSize
        },
        itemInfo: {
          itemId: '423428',
          quantity: 1,
          store: null,
          storeZipCode: null,
          availability: 'SOLDOUT' // 'OK', 'SOLDOUT', 'UNAVAILABLE'
        },
        imagesByColor: {
          'Red': {
            extraImages: [
              {
                iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                superSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg'
              },
              {
                iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                superSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg'
              },
              {
                iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                superSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg'
              },
              {
                iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                superSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg'
              }
            ]
          }
        },
        miscInfo: {
          isBopisEligible: true,
          clearanceItem: true,
          newArrivalItem: false
        },
        quantityPurchased: 0
      }, {
        productInfo: {
          generalProductId: 'g1_45',
          name: 'Red Pants',
          pdpUrl: 'http://www.childrensplace.com/shop/us/p/Toddler-Girls-Neon-Colorblock-Fleece-Hat-2071143-1021',  // NOTE: it should be "productURL" of the old service.
          isGiftCard: false, // isGiftCard from old service.
          listPrice: 99.99,
          offerPrice: 10.99
        },
        skuInfo: {
          skuId: '878883',  // itemId
          upc: '00440001707209',
          // imageUrl: '/wcsstore/GlobalSAS/images/tcp/products/500/2071143_1021.jpg',  // NOTE: it should be "thumbnail" of the old service + image size (there're options for: 160, ,240, 300, 500, 700+; otherwise ask product)
          imageUrl: '/images/boys-denim-fpo.png',
          colorProductId: 'something1',
          color: {
            name: 'Red',
            // imagePath: '/wcsstore/GlobalSAS/images/tcp/products/swatches/2071143_1021.jpg' // NOTE: see the path, it's basically the skuInfo with a slide change.
            imagePath: '/images/fpo-color-1.jpg'
          },
          fit: 'husky', // look on the size table on the "itemId" key, and then extract the: TCPFit
          size: 'H XL' // look on the size "table" on the "itemId" key, and then extract the: TCPSize
        },
        itemInfo: {
          itemId: '423427',
          quantity: 2,
          store: null,
          storeZipCode: null,
          availability: 'UNAVAILABLE' // 'OK', 'SOLDOUT', 'UNAVAILABLE'
        },
        miscInfo: {
          isBopisEligible: true,
          clearanceItem: false,
          newArrivalItem: true
        },
        imagesByColor: {
          'Red': {
            extraImages: [
              {
                iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                superSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg'
              },
              {
                iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                superSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg'
              },
              {
                iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                superSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg'
              },
              {
                iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                superSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg'
              }
            ]
          }
        },
        quantityPurchased: 0
      }, {
        productInfo: {
          generalProductId: '781106',
          name: 'Jacket',
          pdpUrl: 'http://www.childrensplace.com/shop/us/p/Toddler-Girls-Neon-Colorblock-Fleece-Hat-2071143-1021',  // NOTE: it should be "productURL" of the old service.
          isGiftCard: false, // isGiftCard from old service.
          listPrice: 199.99,
          offerPrice: 189.99
        },
        skuInfo: {
          skuId: '878884',  // itemId
          upc: '00440001707209',
          // imageUrl: '/wcsstore/GlobalSAS/images/tcp/products/500/2071143_1021.jpg',  // NOTE: it should be "thumbnail" of the old service + image size (there're options for: 160, ,240, 300, 500, 700+; otherwise ask product)
          imageUrl: '/images/boys-denim-fpo.png',
          colorProductId: 'something2',
          color: {
            name: 'Red',
            // imagePath: '/wcsstore/GlobalSAS/images/tcp/products/swatches/2071143_1021.jpg' // NOTE: see the path, it's basically the skuInfo with a slide change.
            imagePath: '/images/fpo-color-1.jpg'
          },
          fit: 'Regular', // look on the size table on the "itemId" key, and then extract the: TCPFit
          size: 'S (1T/2T)' // look on the size "table" on the "itemId" key, and then extract the: TCPSize
        },
        itemInfo: {
          itemId: '423424',
          quantity: 5,
          store: null,
          storeZipCode: null,
          availability: 'OK' // 'OK', 'SOLDOUT', 'UNAVAILABLE'
        },
        miscInfo: {
          isBopisEligible: true,
          clearanceItem: false,
          newArrivalItem: false
        },
        imagesByColor: {
          'Red': {
            extraImages: [
              {
                iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                superSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg'
              },
              {
                iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                superSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg'
              },
              {
                iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                superSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg'
              },
              {
                iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                superSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg'
              }
            ]
          }
        },
        quantityPurchased: 0
      }, {
        productInfo: {
          generalProductId: '782166',
          name: 'Boston Red Sox',
          pdpUrl: 'http://www.childrensplace.com/shop/us/p/Toddler-Girls-Neon-Colorblock-Fleece-Hat-2071143-1021',  // NOTE: it should be "productURL" of the old service.
          isGiftCard: false, // isGiftCard from old service.
          listPrice: 10.99,
          offerPrice: 9.99
        },
        skuInfo: {
          skuId: '878885',  // itemId
          upc: '00440001707209',
          // imageUrl: '/wcsstore/GlobalSAS/images/tcp/products/500/2071143_1021.jpg',  // NOTE: it should be "thumbnail" of the old service + image size (there're options for: 160, ,240, 300, 500, 700+; otherwise ask product)
          imageUrl: '/images/boys-denim-fpo.png',
          colorProductId: 'something3',
          color: {
            name: 'Red',
            // imagePath: '/wcsstore/GlobalSAS/images/tcp/products/swatches/2071143_1021.jpg' // NOTE: see the path, it's basically the skuInfo with a slide change.
            imagePath: '/images/fpo-color-1.jpg'
          },
          fit: 'Regular', // look on the size table on the "itemId" key, and then extract the: TCPFit
          size: 'XL (6T/7T)' // look on the size "table" on the "itemId" key, and then extract the: TCPSize
        },
        itemInfo: {
          itemId: '423425',
          quantity: 1,
          store: null,
          storeZipCode: null,
          availability: 'OK' // 'OK', 'SOLDOUT', 'UNAVAILABLE'
        },
        miscInfo: {
          isBopisEligible: true,
          clearanceItem: false,
          newArrivalItem: true
        },
        imagesByColor: {
          'Red': {
            extraImages: [
              {
                iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                superSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg'
              },
              {
                iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                superSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg'
              },
              {
                iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                superSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg'
              },
              {
                iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                superSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg'
              }
            ]
          }
        },
        quantityPurchased: 0
      }, {
        productInfo: {
          generalProductId: '785566',
          name: 'Cool Kids Shirt',
          pdpUrl: 'http://www.childrensplace.com/shop/us/p/Toddler-Girls-Neon-Colorblock-Fleece-Hat-2071143-1021',  // NOTE: it should be "productURL" of the old service.
          isGiftCard: false, // isGiftCard from old service.
          listPrice: 9.00,
          offerPrice: 9.00
        },
        skuInfo: {
          skuId: '878886',  // itemId
          upc: '00440001707209',
          // imageUrl: '/wcsstore/GlobalSAS/images/tcp/products/500/2071143_1021.jpg',  // NOTE: it should be "thumbnail" of the old service + image size (there're options for: 160, ,240, 300, 500, 700+; otherwise ask product)
          imageUrl: '/images/boys-denim-fpo.png',
          colorProductId: 'something4',
          color: {
            name: 'Red',
            // imagePath: '/wcsstore/GlobalSAS/images/tcp/products/swatches/2071143_1021.jpg' // NOTE: see the path, it's basically the skuInfo with a slide change.
            imagePath: '/images/fpo-color-1.jpg'
          },
          fit: 'Slim', // look on the size table on the "itemId" key, and then extract the: TCPFit
          size: 'L (4T/5T)' // look on the size "table" on the "itemId" key, and then extract the: TCPSize
        },
        itemInfo: {
          itemId: '423426',
          quantity: 2,
          store: null,
          storeZipCode: null,
          availability: 'OK' // 'OK', 'SOLDOUT', 'UNAVAILABLE'
        },
        miscInfo: {
          isBopisEligible: false,
          clearanceItem: true,
          newArrivalItem: false
        },
        imagesByColor: {
          'Red': {
            extraImages: [
              {
                iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg',
                superSizeImageUrl: '/wcsstore/static/images/fpo-prod-1.jpg'
              },
              {
                iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg',
                superSizeImageUrl: '/wcsstore/static/images/fpo-prod-2.jpg'
              },
              {
                iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                superSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg'
              },
              {
                iconSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                regularSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                bigSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg',
                superSizeImageUrl: '/wcsstore/static/images/fpo-prod-3.jpg'
              }
            ]
          }
        },
        quantityPurchased: 1
      }]
    }, {wishlistId, userName, isShared});
  },

  deleteWishList (wishlistId) {
    return editJsonPopup('deleteWishList', { success: true }, {wishlistId});
  },

  deleteWishListItem (wishlistId, itemId) {
    return editJsonPopup('deleteWishListItem', { success: true }, {wishlistId, itemId});
  },

  moveWishListItem (args) {
    return editJsonPopup('moveWishListItem', { success: true }, {args});
  },

  shareWishlistByEmail (wishlistId, from, to, message) {
    return editJsonPopup('shareWishlistByEmail', { success: true }, {wishlistId, from, to, message});
  },

  createWishList (name, isDefault) {
    return editJsonPopup('createWishList', { id: '123123123', success: true }, {name, isDefault});
  },

  updateWishlistName (wishlistId, displayName, isDefault) {
    return editJsonPopup('updateWishlistName', { success: true }, {wishlistId, displayName, isDefault});
  },

  updateWishlistIsDefault (isDefault, wishlistId) {
    return editJsonPopup('updateWishlistIsDefault', { success: true }, {isDefault, wishlistId});
  },

  addItemToWishlist (wishlistId, skuOrProductId, quantity, isProduct) {
    return editJsonPopup('addItemToWishlist', { success: true }, {wishlistId, skuOrProductId, quantity, isProduct});
  }

};
