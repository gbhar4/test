/**
@module Cart Static Service Abstractors
*/
import {editJsonPopup} from 'util/testUtil/editJsonPopup';
import {sanitizeEntity} from 'service/apiUtil.js';

export function getCartAbstractor (apiHelper) {
  return CartStaticAbstractor;
}

const CartStaticAbstractor = {

  getCurrentOrder (orderId, calcsEnabled) {
    return editJsonPopup('getCurrentOrder', {
      'orderId': 8006216003,
      'totalItems': 1,
      'appliedGiftCards': [{
        'id': '123',
        'onFileCardId': '1245',
        'amountApplied': 10.00,
        'endingNumbers': '6788',
        'remainingBalance': 10.00
      }, {
        'id': '193',
        'amountApplied': 10.00,
        'endingNumbers': '6788',
        'remainingBalance': 10.00
      }],
      'giftWrappingTotal': 2.99,
      'savingsTotal': 0,
      'couponsTotal': 0,
      'giftCardsTotal': 0,
      'shippingTotal': 5,
      'totalTax': 0.93,
      'grandTotal': 22.95,
      'rewardsToBeEarned': 50,
      'subTotal': 22.95,
      'subTotalWithDiscounts': 20.95,
      'estimatedRewards': 18,
      'estimatedAirMiles': 0,
      airmiles: {
        accountNumber: '12312312312',
        promoId: '1234'
      },
      'uiFlags': {
        isPaypalEnabled: true
      },
      'checkout': {
        'pickUpContact': {
          'firstName': 'main',
          'lastName': 'flint',
          'emailAddress': 'main@gg.com',
          'phoneNumber': '5554443333'
        },
        'pickUpAlternative': {
          'firstName': 'alt',
          'lastName': 'alti',
          'emailAddress': 'alt@kk.com'
        },
        'shipping': {
          'address': {
            'country': 'US',
            'firstName': 'Pay',
            'lastName': 'Pal',
            'addressLine1': '1 Geoffrey Way',
            'city': 'Wayne',
            'state': 'NJ',
            'zipCode': '07470'
          },
          'onFileAddressId': '543335',
          'onFileAddressKey': 'Citro\'s 2nd Address',
          'emailAddress': 'US_igalpe_1358955371_per@childrensplace.com',
          'phoneNumber': '4087976962',
          'emailSignup': false,
          'method': {
            'shippingMethodId': 'UGNR'
          }
        },
        'billing': {
          'paymentMethod': 'creditCard',
          'paymentId': '1031015',
          'onFileCardId': '123',
          'emailAddress': 'US_igalpe_1358955371_per@childrensplace.com',
          'address': {
            'onFileAddressId': '543335',
            'onFileAddressKey': 'Citro\'s 2nd Address',
            'sameAsShipping': false,
            'firstName': 'Igor',
            'lastName': 'Galperin',
            'addressLine1': '500 Plaza Drive',
            'city': 'Secaucus',
            'state': 'NJ',
            'zipCode': '07094',
            'country': 'US'
          },
          'billing': {
            'cardNumber': '************6818',
            'cardType': 'VISA',
            'expMonth': 12,
            'expYear': 2018,
            'cvv': '',
            'isExpirationRequired': true,
            'isCVVRequired': true
          }
        },
        'giftWrap': {
          'optionId': '464504',
          'message': 'hi bye'
        }
      },
      'orderItems': [
        {
          'productInfo': {
            'generalProductId': '62141',
            'skuId': '768325',
            'name': sanitizeEntity('chino pants &amp; &Amp; china'),
            'imagePath': 'https://uatlive2.childrensplace.com/wcsstore/GlobalSAS/images/tcp/products/500/1101084_FX.jpg',
            'upc': '00700953912602',
            'size': '5',
            'fit': 'regular',
            'pdpUrl': '/shop/us/p/chino-pants-1101084-FX',
            'color': {
              'name': 'FLAX',
              'imagePath': '/wcsstore/GlobalSAS/images/tcp/products/swatches/1101084_FX.jpg'
            },
            'isGiftCard': false
          },
          'itemInfo': {
            'quantity': 1,
            'itemId': '8009220003',
            'listPrice': 17.95,
            'offerPrice': 17.95
          },
          'miscInfo': {
            'clearanceItem': false,
            'isOnlineOnly': false,
            'isBopisEligible': true,
            // 'onlineInventoryAvailable': 2485,
            'store': 'lalala',
            'storeId': '12123123',
            'storeAddress': {
              'addressLine1': '11 Nowhere St.',
              'city': 'Omaha',
              'state': 'NB',
              'zipCode': '08765'
            },
            'storePhoneNumber': '5555555555',
            'storeTodayOpenRange': 'dsaasdasd',
            'storeTomorrowOpenRange': 'adasdsaas',
            'availability': 'OK'
          }
        },
        {
          'productInfo': {
            'generalProductId': '779587',
            'skuId': 's866748',
            'name': sanitizeEntity('funny items &prime; &Prime; &quot;'),
            'imagePath': '/images/colors/brown-color.png',
            'upc': '00700953912602',
            'size': 's1',
            'fit': 'slim',
            'pdpUrl': '/shop/us/p/chino-pants-1101084-FX',
            'color': {
              'name': 'Gray Steel',
              'imagePath': '/wcsstore/GlobalSAS/images/tcp/products/swatches/2065376_465.jpg'
            },
            'isGiftCard': false,
            'colorFitSizeDisplayNames': {'color': 'Design', 'size': 'Value'}
          },
          'itemInfo': {
            'quantity': 1,
            'itemId': '800dsf0003',
            'listPrice': 11.95,
            'offerPrice': 10.90
          },
          'miscInfo': {
            'clearanceItem': false,
            'isOnlineOnly': false,
            'isBopisEligible': true,
            'storePhoneNumber': null,
            'storeTodayOpenRange': null,
            'storeTomorrowOpenRange': null,
            'availability': 'SOLDOUT'
          }
        }
      ]
    }, {orderId, calcsEnabled});
  },

  addItem (skuId, quantity) {
    return editJsonPopup('addItem', { orderItemId: '802374863' }, {skuId, quantity});
  },

  getCurrentOrderSummary () {
    return editJsonPopup('getCurrentOrderSummary', { totalItems: 90 });
  },

  updateItem (orderItemId, skuId, quantity = 1) {
    return editJsonPopup('updateItem', { orderItemId: '802374864' }, {orderItemId, skuId, quantity});
  },

  removeItem (orderItemId) {
    return editJsonPopup('removeItem', { orderId: '8020348630' }, {orderItemId});
  },

  updateItemQty (orderItemId, quantity) {
    return editJsonPopup('updateItemQty', { orderItemId: '802374864' }, {orderItemId, quantity});
  },

  addItemToDefaultWishlist (skuId, quantity) {
    return editJsonPopup('addItemToDefaultWishlist', { wishlistItemId: '1564130' }, {skuId, quantity});
  },

  addCouponOrPromo (code) {
    return editJsonPopup('addCouponOrPromo', { code: 'Y038HDRIUWOE' }, {code});
  },

  removeCouponOrPromo (code) {
    return editJsonPopup('removeCouponOrPromo', { success: true }, {code});
  },

  removeItemFromWishlist (wishlistId, wishlistItemId) {
    return editJsonPopup('removeItemFromWishlist', { success: true }, {wishlistId, wishlistItemId});
  },

  addBopisItemToCart (storeId, skuId, quantity) {
    return editJsonPopup('addBopisItemToCart', { success: true }, {storeId, skuId, quantity});
  },

  updateBopisItemInCart (orderId, orderItemId, isItemShipToHome, storeId, skuId, quantity) {
    return editJsonPopup('updateBopisItemInCart', { success: true }, {orderId, orderItemId, isItemShipToHome, storeId, skuId, quantity});
  },

  getSitePromotions () {
    return editJsonPopup('getSitePromotions', [
      {
        id: '2344236',
        status: 'applied',
        title: 'The Coolpon',
        detailsOpen: false,
        expirationDate: '1/1/18',
        isExpiring: true,
        details: 'Some Info',
        imageThumbUrl: '/images/plcc-icon-thumb.png',
        imageUrl: '/images/plcc-icon.png',
        error: '',
        redemptionType: 'PUBLIC',
        isApplicable: true
      }, {
        id: '2344237',
        status: 'available',
        title: 'The Coolpon',
        detailsOpen: false,
        expirationDate: '12/9/19',
        isExpiring: false,
        details: 'Some Info',
        imageThumbUrl: '/images/saving-icon-thumb.png',
        imageUrl: '/images/saving-icon.png',
        error: '',
        redemptionType: 'PUBLIC',
        isApplicable: true
      }, {
        id: '2344238',
        status: 'pending',
        title: 'The Coolpon',
        detailsOpen: false,
        expirationDate: '6/10/17',
        isExpiring: false,
        details: 'Some Info',
        imageThumbUrl: '/images/saving-icon-thumbs.png',
        imageUrl: '/images/saving-icon.png',
        error: '',
        redemptionType: 'PUBLIC',
        isApplicable: true
      }, {
        id: '2344239',
        status: 'applied',
        title: 'The Coolpon',
        detailsOpen: false,
        expirationDate: '2/3/21',
        isExpiring: false,
        details: 'Some Info',
        imageThumbUrl: '/images/saving-icon-thumb.png',
        imageUrl: '/images/saving-icon.png',
        error: '',
        redemptionType: 'PUBLIC',
        isApplicable: true
      }, {
        id: '2344210',
        status: 'removing',
        title: 'The Coolpon',
        detailsOpen: false,
        expirationDate: '1/1/21',
        isExpiring: false,
        details: 'Some Info',
        imageThumbUrl: '/images/saving-icon-thumb.png',
        imageUrl: '/images/saving-icon.png',
        error: '',
        redemptionType: 'PUBLIC',
        isApplicable: true
      }
    ]);
  },

  getUnqualifiedItems () {
    return editJsonPopup('getUnqualifiedItems', ['8009220003']);
  }

};
