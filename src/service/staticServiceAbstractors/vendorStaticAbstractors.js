/**
@module vendorStaticAbstractors
*/
import { editJsonPopup } from 'util/testUtil/editJsonPopup';

export function getVendorAbstractors () {
  return VendorStaticAbstractors;
}

const ERRORS_MAP = require('service/WebAPIServiceAbstractors/errorMapping.json');

const VendorStaticAbstractors = {
  paypalAuthorization: function (orderId, fromPage, payload, paypalOrderId) {
    return editJsonPopup('paypalAuthorization', {
      'success': true
    }, { orderId, fromPage, payload, paypalOrderId });
  },

  acceptOrDeclineWIC: function (args) {
    return editJsonPopup('acceptOrDeclineWIC', { success: true }, args);
  },

  acceptOrDeclinePreScreenOffer: function (args) {
    return editJsonPopup('acceptOrDeclinePreScreenOffer', { success: true }, args);
  },

  instantCreditApplication: function (args) {
    return editJsonPopup('instantCreditApplication', {
      onFileCardId: '123456',
      cardType: 'PLACE CARD',
      plccCardId: '1234', // FIXME: rename, it's the last 4 digits of the card
      cardNumber: '************1234',

      isExpirationRequired: false,
      isCVVRequired: false,
      isDefault: false,

      address: {
        firstName: 'john',
        lastName: 'doe',
        addressLine1: '500 Plaza Dr',
        addressLine2: '',
        zipCode: '09750',
        state: 'NJ',
        city: 'Seacacus'
      },
      phoneNumber: '5555555555',
      emailAddress: 'aaa@aaaa.com',

      status: 'APPROVED',
      creditLimit: 4000,
      apr: 28.97,
      couponCode: 'FKJLVFKJLV',
      checkoutCouponError: ERRORS_MAP['_WIC_RTPS_COUPON_NOT_APPLIED'],
      savingAmount: 9.37
    }, args);
  },

  startPaypalCheckout (orderId, fromPage) {
    return editJsonPopup('startPaypalCheckout', {
      centinelPostbackUrl: 'https://0centineltest.cardinalcommerce.com/maps/payment_pp_redirect.asp?payload=FIRSTDATAS%7CTCPusTEST%7CnpwtCTOaDkCnMQnFNY20%7CPP',
      centinelTermsUrl: 'https://localhost/webapp/wcs/stores/servlet/AjaxStoreLocatorDisplayView?catalogId=10551&amp;langId=-1&amp;storeId=10151&amp;callingPage=AjaxOrderItemDisplayView&amp;tcpOrderId=295501',
      centinelPayload: 'FIRSTDATAS|TCPusTEST|npwtCTOaDkCnMQnFNY20|PP',
      centinelOrderId: '8090367089865957'
    }, { orderId, fromPage });
  },

  preScreenCodeValidation () {
    return editJsonPopup('preScreenCodeValidation', {
      isValid: true
    }, arguments);
  },

  getOutfitRecommendations (itemPartNumber, maxResultSet = 5) {
    return editJsonPopup('getOutfitRecommendations', [{
      'generalProductId': '5',
      name: 'outfit 1',
      'imagePath': 'https://s3.amazonaws.com/ampersand.production/collage_images/outfit_collage_image/117510/lookbook.png',
      'productIds': 'eesdsd_3321-ASDeeSAD_34324-edsadsa_33sd'
    },
    {
      'generalProductId': '6',
      name: 'outfit 2',
      'imagePath': 'https://s3.amazonaws.com/ampersand.production/collage_images/outfit_collage_image/117509/lookbook.png',
      'productIds': 'sdsd_3321-ASDSAD_34324-dsadsa_33sd'
    }], { itemPartNumber, maxResultSet });
  },

  getProductRecommendations (itemPartNumber) {
    return editJsonPopup('getProductRecommendations', [
      {
        'generalProductId': '8974328_0A',
        'department': 'Girls',
        'name': 'Quilted Purse',
        'imagePath': '/wcsstore/static/images/fpo-prod-1.jpg',
        'listPrice': 19.95,
        'offerPrice': 10.47,
        'pdpUrl': 'http://www.google.com'
      }, {
        'generalProductId': 'g1_45',
        'department': 'Girls',
        'name': 'Long Sleeve Glitter "Are you kitten me right meow?" Texting Cats Craphic Tee',
        'imagePath': '/wcsstore/static/images/fpo-prod-2.jpg',
        'listPrice': 19.95,
        'offerPrice': 13.97,
        'pdpUrl': 'http://www.google.com'
      }, {
        'generalProductId': '3',
        'department': 'Girls',
        'name': 'Long Sleeve Glitter "Are You Kitten Me Right Meow" Texting Cats Graphic Tee',
        'imagePath': '/wcsstore/static/images/fpo-prod-3.jpg',
        'listPrice': 19.95,
        'offerPrice': 13.97,
        'pdpUrl': 'http://www.google.com'
      }, {
        'generalProductId': '4',
        'department': 'Girls',
        'name': 'Glitter Bow June Ballet Flat',
        'imagePath': '/wcsstore/static/images/fpo-prod-4.jpg',
        'listPrice': 24.95,
        'offerPrice': 17.47,
        'pdpUrl': 'http://www.google.com'
      }, {
        'generalProductId': '5',
        'department': 'Girls',
        'name': 'Glitter Bow June Ballet Flat',
        'imagePath': '/wcsstore/static/images/fpo-prod-4.jpg',
        'listPrice': 30.82,
        'offerPrice': 11.77,
        'pdpUrl': 'http://www.google.com'
      }], { itemPartNumber });
  },

  calcDistanceByLatLng (storeLocations, coords) {
    return editJsonPopup('calcDistanceByLatLng', [1.3, 2.4, -1, 4.6, 7.8], arguments);
  }
};
