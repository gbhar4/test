/**
@module User Static Service Abstractors
*/
import {editJsonPopup} from 'util/testUtil/editJsonPopup';

export function getAccountAbstractor () {
  return AccountStaticAbstractor;
}

const AccountStaticAbstractor = {
  getMyWishlists: function () {
    return editJsonPopup('getMyWishlists', [
      {
        wishlistId: '434524',
        itemCount: '12',
        wishlistName: "Citro's Favorites",
        status: 'Default'
      }
    ]);
  },

  getSavedAddresses: function () {
    return editJsonPopup('getSavedAddresses', [
      {
        addressId: '546465',
        addressKey: 'Citro\'s Address',
        address: {
          firstName: 'Michael',
          lastName: 'Citro',

          addressLine1: '707 Lib Ave',
          addressLine2: '',
          city: 'New York',
          state: 'NY',
          country: 'US',
          zipCode: '10012'
        },
        emailAddress: 'mike@citro.com',
        phoneNumber: '5555555555',
        type: 'Billing',
        isDefault: true // backend sends a string
      },
      {
        addressId: '543335',
        addressKey: 'Citro\'s 2nd Address',
        address: {
          firstName: 'John',
          lastName: 'Citro',

          addressLine1: '707 Lib Ave',
          addressLine2: '',
          city: 'Jersey City',
          state: 'NJ',
          country: 'US',
          zipCode: '07047'
        },
        emailAddress: 'mike@citro2.com',
        type: 'ShippingAndBilling',
        phoneNumber: '5555555555',
        isDefault: false // backend sends a string
      },
      {
        addressId: '513335',
        addressKey: 'Citro\'s 3nd Address',
        address: {
          firstName: 'John',
          lastName: 'Rambo',

          addressLine1: '707 Lib Ave',
          addressLine2: '',
          city: 'Jersey City',
          state: 'QC',
          country: 'CAD',
          zipCode: 'L6T4L7'
        },
        emailAddress: 'mike@citro2.com',
        type: 'ShippingAndBilling',
        phoneNumber: '5555555555',
        isDefault: false // backend sends a string
      }
    ]);
  },

  addShippingAddress: function (args) {
    return editJsonPopup('addShippingAddress', { addressId: '143690', addressKey: Date.now().toString() }, args);
  },

  addPickupPerson: function (args) {
    return editJsonPopup('addPickupPerson', { addressId: '143690' }, args);
  },

  updateShippingAddress: function (args) {
    return editJsonPopup('updateShippingAddress', { addressId: '143690' }, args);
  },

  applyBillingAddress: function (args) {
    return editJsonPopup('applyBillingAddress', { addressId: '143690B' }, args);
  },

  applyOnFileAddressToOrder: function (addressId, orderId) {
    return editJsonPopup('applyOnFileAddressToOrder', { success: true }, {addressId, orderId});
  },

  getAddressVerificationData: function (address) {
    return editJsonPopup('getAddressVerificationData', {
      suggestedAddresses: [
        {
          ...address,
          id: '123',
          zipCode: address.zipCode + '-0001'
        }
      ],
      result: {
        status: 'invalid',
        message: {
          text: 'There may be an issue with your address as entered. Please double check it, or select from the below.',
          className: ''
        }
      }
    }, address);
  },

  addCreditCardDetails: function (args) {
    return editJsonPopup('addCreditCardDetails', {success: true}, args);
  },

  updateCreditCardDetails: function (args) {
    return editJsonPopup('updateCreditCardDetails', {success: true}, args);
  },

  setCreditCardAsDefault: function (args) {
    return editJsonPopup('setCreditCardAsDefault', {success: true}, args);
  },

  getCreditCards: function () {
    return editJsonPopup('getCreditCards', [
      {
        'onFileCardId': '123',
        'cardType': 'PLACE CARD',
        'cardNumber': '************1234',
        'isExpirationRequired': false,
        'isCVVRequired': true,
        'expYear': 2010,
        'expMonth': 11,
        'isDefault': true,
        'billingAddressId': '546465'
      },
      {
        'onFileCardId': '124',
        'cardType': 'VISA',
        'cardNumber': '************3214',
        'isExpirationRequired': true,
        'isCVVRequired': true,
        'expYear': 2020,
        'expMonth': 11,
        'isDefault': false,
        'billingAddressId': '543335'
      },
      {
        cardType: 'GIFT CARD',
        'onFileCardId': '1245',
        'cardNumber': '6006491259499902624',
        'cardPin': '1234',
        'billingAddressId': 123123,
        'balance': 0
      },
      {
        cardType: 'GIFT CARD',
        'onFileCardId': '12465',
        'cardNumber': '6006491259499902624',
        'cardPin': '1234',
        'billingAddressId': 123123,
        'balance': 0
      }
    ]);
  },

  deleteCreditCards: function (creditCardId) {
    return editJsonPopup('deleteCreditCards', {success: true}, {creditCardId});
  },

  getOrderHistory: function () {
    return editJsonPopup('getOrderHistory', [
      {
        orderDate: 'September 19, 2017',
        orderNumber: '8005904003',
        orderStatus: 'Shipped',
        orderTotal: '$28.48',
        orderTrackingNumber: 'N/A'
      }, {
        orderDate: 'September 19, 2017',
        orderNumber: '8005904005',
        orderStatus: 'Shipped',
        orderTotal: '$283.48',
        orderTrackingNumber: 'N/A'
      }
    ]);
  },

  getLastOrder: function () {
    return editJsonPopup('getLastOrder', {
      orderDate: 'September 19, 2017',
      orderNumber: '8005904003',
      orderStatus: 'Shipped',
      orderTotal: '$28.48',
      orderTrackingNumber: 'N/A'
    });
  },

  createNewWishlist: function (wishlistName) {
    return editJsonPopup('createNewWishlist', {wishlistId: '5614981'}, {wishlistName});
  }

};
