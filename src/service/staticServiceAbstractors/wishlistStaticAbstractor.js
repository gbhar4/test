/**
@module Wishlist Static Service Abstractors
*/
import {editJsonPopup} from 'util/testUtil/editJsonPopup';
// import {sanitizeEntity} from 'service/apiUtil.js';

export function getWishlistAbstractor (apiHelper) {
  return WishlistStaticAbstractor;
}

const WishlistStaticAbstractor = {

  getListWishlist () {
    return editJsonPopup('favoriteList': [
      {
        'favoriteKey': '13',
        'favoriteTitle': "Sarah's Favorites",
        'items': '1',
        'isDefault': true
      },
      {
        'favoriteKey': '24',
        'favoriteTitle': 'Fall Clothes for Jack',
        'items': '12',
        'isDefault': false
      }
    ]);
  },

  getSharedFavoriteList () {
    return editJsonPopup({
      'shareFavoriteList': [
        {
          'key': 'asdf',
          'typeShare': 'Facebook'
        },
        {
          'key': '2hda',
          'typeShare': 'Email'
        },
        {
          'key': '8dhf',
          'typeShare': 'Copy Link'
        }
      ]
    });
  },

  getSharedList () {
    return editJsonPopup('isShared': true,
    'nameShared': 'Sarah',
    'nameFavoriteList': "Lizzie's Birthday Gifts");
  },

  getProductListWishlist () {
    return editJsonPopup('items': [
      {
        'generalProductId': '62141',
        'skuId': '768325',
        'name': 'Girls long Sleeve Embellished Graphic Top',
        'imagePath': 'static/images/boys-joggers-fpo.png',
        'size': '8',
        'color': {
          'name': 'FLAX',
          'imagePath': 'static/images/fpo-color-1.jpg'
        },
        'fit': 'regular',
        'listPrice': 17.95,
        'offerPrice': 17.95,
        'isPurchased': false
      }, {
        'generalProductId': '45141',
        'skuId': '768325',
        'name': 'Girls Basic Skinny Jeans - Tide Pool Wash',
        'imagePath': 'static/images/boys-joggers-fpo.png',
        'size': '8',
        'color': {
          'name': 'FLAX',
          'imagePath': 'static/images/fpo-color-1.jpg'
        },
        'fit': 'regular',
        'listPrice': 17.95,
        'offerPrice': 17.95,
        'isPurchased': false
      }, {
        'generalProductId': '98141',
        'skuId': '768325',
        'name': 'Girls Long Sleeve Embellished Graphic Top',
        'imagePath': 'static/images/boys-joggers-fpo.png',
        'size': '8',
        'color': {
          'name': 'FLAX',
          'imagePath': 'static/images/fpo-color-1.jpg'
        },
        'fit': 'regular',
        'price': '18,98',
        'listPrice': 17.95,
        'offerPrice': 17.95,
        'isPurchased': true
      }, {
        'generalProductId': '622231',
        'skuId': '768325',
        'name': 'Girls long Sleeve Embellished Graphic Top',
        'imagePath': 'static/images/boys-joggers-fpo.png',
        'size': '8',
        'color': {
          'name': 'FLAX',
          'imagePath': 'static/images/fpo-color-1.jpg'
        },
        'fit': 'regular',
        'listPrice': 17.95,
        'offerPrice': 17.95,
        'isPurchased': true
      }, {
        'generalProductId': '622731',
        'skuId': '768325',
        'name': 'Girls long Sleeve Embellished Graphic Top',
        'imagePath': 'static/images/boys-joggers-fpo.png',
        'size': '8',
        'color': {
          'name': 'FLAX',
          'imagePath': 'static/images/fpo-color-1.jpg'
        },
        'fit': 'regular',
        'listPrice': 17.95,
        'offerPrice': 17.95,
        'isPurchased': true
      }
    ]);
  }

};
