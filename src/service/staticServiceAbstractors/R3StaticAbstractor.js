/**
@module User Static Service Abstractors
*/
import {editJsonPopup} from 'util/testUtil/editJsonPopup';
import {sanitizeEntity} from 'service/apiUtil.js';
import {ORDER_STATUS} from 'reduxStore/storeReducersAndActions/user/orders/reducer';
import {routingConstants} from 'routing/routingConstants.js';
import {formatPhone} from 'util/formatPhone';
import {extractFloat} from '../apiUtil.js';
import {COMPLETE_MONTH} from 'util/parseDate';

export function getR3Abstractor () {
  return R3StaticAbstractor;
}

const R3StaticAbstractor = {
  deleteGiftCardOnAccount: function (onFileCardId) {
    return editJsonPopup('deleteGiftCardOnAccount', { success: true }, { onFileCardId });
  },

  deleteCreditCardOnAccount: function (onFileCardId) {
    return editJsonPopup('deleteCreditCardOnAccount', { success: true }, { onFileCardId });
  },

  setFavoriteStore: function (storeLocationId) {
    return editJsonPopup('setFavoriteStore', { success: true }, { storeLocationId });
  },

  deleteFavoriteStore: function () {
    return editJsonPopup('deleteFavoriteStore', { success: true });
  },

  updateFavoriteStore: function (storeLocationId) {
    return editJsonPopup('updateFavoriteStore', { success: true }, { storeLocationId });
  },

  updateProfileInfo: function (args) {
    return editJsonPopup('updateProfileInfo', { success: true }, args);
  },

  getOrderHistory: function (siteId) {
    return editJsonPopup('getOrderHistory', {
      totalPages: 1,
      orders: siteId === routingConstants.siteIds.us
        // US orders
        ? [
          {

            orderDate: 'September 19, 2017',
            orderNumber: '58322656564',
            orderStatus: 'picked-up'.replace('-', ' '),
            currencySymbol: '$',
            orderTotal: 589.6,
            orderTracking: 'JKHSBFs7658675F6sa',
            orderTrackingUrl: 'http://www.google.com',
            isEcomOrder: true,
            isCanadaOrder: false
          },
          {

            orderDate: 'September 19, 2017',
            orderNumber: '48322656565',
            orderStatus: 'processing',
            currencySymbol: '$',
            orderTotal: 14,
            orderTracking: 'CITROs7658675F6sa',
            orderTrackingUrl: 'http://www.google.com',
            isEcomOrder: false,
            isCanadaOrder: false
          },
          {

            orderDate: 'September 19, 2017',
            orderNumber: '58322656560',
            orderStatus: 'order-shipped'.replace('-', ' '),
            currencySymbol: '$',
            orderTotal: 589.63,
            orderTracking: 'JKHSBFs7658675F6sa',
            orderTrackingUrl: 'http://www.google.com',
            isEcomOrder: true,
            isCanadaOrder: false
          },
          {

            orderDate: 'March 7, 2017',
            orderNumber: '48322656560',
            orderStatus: 'processing',
            currencySymbol: '$',
            orderTotal: 14.63,
            orderTracking: 'CITROs7658675F6sa',
            orderTrackingUrl: 'http://www.google.com',
            isEcomOrder: false,
            isCanadaOrder: false
          }
        ]
        // CA orders
        : [
          {

            orderDate: 'June 21, 2017',
            orderNumber: '58322656566',
            orderStatus: 'order-shipped'.replace('-', ' '),
            currencySymbol: '$',
            orderTotal: 689.63,
            orderTracking: 'JKHSBFs7658675F6sa',
            orderTrackingUrl: 'http://www.google.com',
            isEcomOrder: true,
            isCanadaOrder: true
          },
          {

            orderDate: 'June 20, 2017',
            orderNumber: '48322656567',
            orderStatus: 'processing',
            currencySymbol: '$',
            orderTotal: 15.63,
            orderTracking: 'CITROs7658675F6sa',
            orderTrackingUrl: 'http://www.google.com',
            isEcomOrder: false,
            isCanadaOrder: true
          }
        ]
    });
  },

  addChild: function (args) {
    return editJsonPopup('addChild', {
      'firstName': 'John',
      'lastName': 'Doe',
      'children': [{
        'name': 'Joey',
        'birthYear': '2010',
        'birthMonth': '10',
        'gender': '1',
        'childId': '1'
      }]
    }, args);
  },

  deleteAddressOnAccount: function (addressKey) {
    return editJsonPopup('deleteAddressOnAccount', { success: true }, {addressKey});
  },

  getReservationHistory: function () {
    return editJsonPopup('getReservationHistory', {
      totalPages: 1,
      reservations: [
        {
          'expiryDate': '04/28/2017',
          'reservationId': '1006146356',
          'reservationStatus': 'Reservation Received',
          'reserveDate': '03/27/2017',
          emailAddress: 'john@doe.com'
        },
        {
          'expiryDate': '04/29/2017',
          'reservationId': '8006146356',
          'reservationStatus': 'Reservation Received',
          'reserveDate': '04/27/2017',
          emailAddress: 'jane@doe.com'
        }
      ]
    });
  },

  updateChild: function (args) {
    return editJsonPopup('updateChild', { success: true }, args);
  },

  deleteChild: function (args) {
    return editJsonPopup('deleteChild', { success: true }, args);
  },

  getFavoriteStore: function () {
    return editJsonPopup('getFavoriteStore', {
      id: 111085,
      storeName: 'apache mall',
      address: {
        addressLine1: '314 apache mall',
        city: 'rochester',
        state: 'MN',
        zipCode: '55902'
      },
      phone: '5072812555',
      coordinates: {
        lat: -92.47957,
        long: 44.00247
      }
    });
  },

  getPointsHistory: function () {
    return editJsonPopup('getPointsHistory', {
      totalPages: 1,
      pointsTransactions: [
        {date: 'Apr 29, 2017', type: 'Activation', amount: '32'},
        {date: 'Apr 9, 2017', type: 'Sale', amount: '32'},
        {date: 'Mar 15, 2017', type: 'Sale', amount: '45'},
        {date: 'Mar 2, 2017', type: 'Sale', amount: '32'},
        {date: 'Feb 23, 2017', type: 'Sale', amount: '67'},
        {date: 'Feb 20, 2017', type: 'Activation', amount: '32'},
        {date: 'Feb 13, 2017', type: 'Sale', amount: '32'},
        {date: 'Jan 28, 2017', type: 'Sale', amount: '87'},
        {date: 'Jan 22, 2017', type: 'Sale', amount: '34'},
        {date: 'Dec 23, 2016', type: 'Sale', amount: '31'},
        {date: 'Dec 12, 2016', type: 'Sale', amount: '5'}
      ]
    });
  },

  claimPoints: function (args) {
    return editJsonPopup('claimPoints', { success: true }, args);
  },

  getGiftCardBalance: function (creditCardId, giftCardNumber, giftCardPin, recaptureResponse) {
    return editJsonPopup('getGiftCardBalance', {
      id: '3',
      endingNumbers: '1234',
      remainingBalance: 19.9
    }, {creditCardId, giftCardNumber, giftCardPin, recaptureResponse});
  },

  addGiftCardToAccount: function (giftcardAccountNumber, giftcardPin, recaptchaToken) {
    return editJsonPopup('addGiftCardToAccount', { success: true }, {
      giftcardAccountNumber, giftcardPin, recaptchaToken
    });
  },

  getChildren: function () {
    return editJsonPopup('getChildren', [
      {
        name: 'Joey',
        birthYear: '2010',
        birthMonth: '10',
        gender: '1',
        childId: '1'
      }
    ]);
  },

  getOrderInfoByOrderId: function (args) {
    return editJsonPopup('getOrderInfoByOrderId', {
      orderNumber: '58322656564',
      orderDate: '2017-06-20 03:53:01',
      status: ORDER_STATUS.ITEMS_PICKED_UP,
      pickedUpDate: '4/13/2018 03:53:01',
      pickUpExpirationDate: '4/15/2018 03:53:01',
      isBopisOrder: false,
      checkout: {
        shippingAddress: {
          firstName: 'Jay',
          lastName: 'Johnson',
          addressLine1: '500 Plaza Drive',
          addressLine2: '',
          city: 'Secaucus',
          state: 'NJ',
          zipCode: '33071',
          country: 'US'
        },
        pickUpStore: {
          'basicInfo': {
            'id': '1',
            'storeName': 'Union Square'.split('|')[0],
            'address': {
              'addressLine1': '500 Plaza Drive',
              'city': 'New York',
              'state': 'NY',
              'zipCode': '10003'
            },
            'phone': '(212) 529-2201',
            'coordinates': {
              'lat': 40.720481,
              'long': -73.845743
            }
          },
          'hours': {
            'regularHours': [
              {
                'dayName': 'Monday'.toUpperCase() || '',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994'
                }, {
                  'fromHour': '2017-03-16 17:21:49.994',
                  'toHour': '2017-03-16 22:21:49.994'
                }],
                'isClosed': false
              },
              {
                'dayName': 'Tuesday'.toUpperCase() || '',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994'
                }],
                'isClosed': false
              },
              {
                'dayName': 'Wednesday'.toUpperCase() || '',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994'
                }],
                'isClosed': false
              },
              {
                'dayName': 'Black Friday',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994'
                }],
                'isClosed': false
              },
              {
                'dayName': 'Thanksgiving',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': true
              },
              {
                'dayName': 'Saturday'.toUpperCase() || '',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Sunday'.toUpperCase() || '',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              }
            ]
          },
          'features': {
            'storeType': 'Retail Store',
            'mallType': 'Enclosed Mall',
            'entranceType': 'Internal',
            'isBopisAvailable': true
          },
          'pickUpPrimary': {
            'firstName': 'Jay',
            'lastName': 'Johnson',
            'email': 'jay.johnson@gmail.com'
          },
          'pickUpAlternative': {
            'firstName': 'alt',
            'lastName': 'alti',
            'emailAddress': 'alt@kk.com'
          }
        },
        billing: {
          sameAsShipping: false,
          card: {
            cardType: 'VISA',
            endingNumbers: '3452',
            imgPath: 'http://TODO-somewhere-else'
          },
          billingAddress: {
            firstName: 'Jay',
            lastName: 'Johnson',
            addressLine1: '500 Plaza Drive',
            addressLine2: '',
            city: 'Secaucus',
            state: 'NJ',
            zipCode: '33071',
            country: 'US'
          }
        }
      },
      appliedGiftCards: [
        {
          id: '2309823234',
          endingNumbers: '3453'
        },
        {
          id: '2309823235',
          endingNumbers: '3455'
        }
      ],
      summary: {
        currencySymbol: '$',
        totalItems: 5,
        subTotal: 15.0,
        outOfStockItems: 1,
        outOfStockTotal: -5.5,

        purchasedItems: 999,
        shippedItems: 5,
        canceledItems: 10.0,
        returnedItems: 0.0,

        canceledTotal: 2.5,
        couponsTotal: -3,
        shippingTotal: 3,
        totalTax: 2,
        grandTotal: 7
      },
      purchasedItems: [
        {
          items: [
            {
              'productInfo': {
                'generalProductId': '62142',
                'skuId': '768326',
                'name': sanitizeEntity('Boys Skinny Chino Pants'),
                'imagePath': 'https://uatlive2.childrensplace.com/wcsstore/GlobalSAS/images/tcp/products/500/1101084_FX.jpg',
                'upc': '00700953912605',
                'size': '5',
                'fit': 'regular',
                'pdpUrl': '/shop/us/p/chino-pants-1101084-FX',
                'color': {
                  'name': 'FLAX',
                  'imagePath': '/wcsstore/GlobalSAS/images/tcp/products/swatches/1101084_FX.jpg'
                }
              },
              'itemInfo': {
                'listPrice': extractFloat(10.45),
                'offerPrice': extractFloat(9.10),
                'linePrice': extractFloat(9.10) * (parseInt(4)),
                'quantity': parseInt(4),
                'quantityCanceled': parseInt(null) || 0,
                'quantityShipped': parseInt(4) || 0,
                'quantityReturned': parseInt(null) || 0,
                'quantityOOS': 0 // no support from backend
              }
            },
            {
              'productInfo': {
                'generalProductId': '62141',
                'skuId': '768325',
                'name': sanitizeEntity('Funny Items &prime; &Prime; &quot;'),
                'imagePath': 'https://int3.childrensplace.com/wcsstore/GlobalSAS/images/tcp/products/swatches/2065376_465.jpg',
                'upc': '00700953912602',
                'size': 's1',
                'fit': 'slim',
                'pdpUrl': '/shop/us/p/chino-pants-1101084-FX',
                'color': {
                  'name': 'Gray Steel',
                  'imagePath': '/wcsstore/GlobalSAS/images/tcp/products/swatches/2065376_465.jpg'
                }
              },
              'itemInfo': {
                'listPrice': extractFloat(20.75),
                'offerPrice': extractFloat(18.15),
                'linePrice': extractFloat(18.15) * (parseInt(2)),
                'quantity': parseInt(5),
                'quantityCanceled': parseInt(2) || 0,
                'quantityShipped': parseInt(null) || 0,
                'quantityReturned': parseInt(null) || 0,
                'quantityOOS': 0 // no support from backend
              }
            }
          ],
          status: ORDER_STATUS.ORDER_SHIPPED,
          trackingNumber: '1ZW64107YW87134803',
          trackingUrl: 'http://wwwapps.ups.com/WebTracking/track?track=yes&amp;trackNums=1ZW64107YW87134803',
          shippedDate: '4/15/2018 03:53:01'
        },
        {
          items: [
            {
              'productInfo': {
                'generalProductId': '62142',
                'skuId': '768326',
                'name': sanitizeEntity('Boys Skinny Chino Pants'),
                'imagePath': 'https://uatlive2.childrensplace.com/wcsstore/GlobalSAS/images/tcp/products/500/1101084_FX.jpg',
                'upc': '00700953912605',
                'size': '5',
                'fit': 'regular',
                'pdpUrl': '/shop/us/p/chino-pants-1101084-FX',
                'color': {
                  'name': 'FLAX',
                  'imagePath': '/wcsstore/GlobalSAS/images/tcp/products/swatches/1101084_FX.jpg'
                }
              },
              'itemInfo': {
                'listPrice': extractFloat(10.45),
                'offerPrice': extractFloat(9.10),
                'linePrice': extractFloat(9.10) * (parseInt(4)),
                'quantity': parseInt(4),
                'quantityCanceled': parseInt(null) || 0,
                'quantityShipped': parseInt(4) || 0,
                'quantityReturned': parseInt(null) || 0,
                'quantityOOS': 0 // no support from backend
              }
            },
            {
              'productInfo': {
                'generalProductId': '62141',
                'skuId': '768325',
                'name': sanitizeEntity('Funny Items &prime; &Prime; &quot;'),
                'imagePath': 'https://int3.childrensplace.com/wcsstore/GlobalSAS/images/tcp/products/swatches/2065376_465.jpg',
                'upc': '00700953912602',
                'size': 's1',
                'fit': 'slim',
                'pdpUrl': '/shop/us/p/chino-pants-1101084-FX',
                'color': {
                  'name': 'Gray Steel',
                  'imagePath': '/wcsstore/GlobalSAS/images/tcp/products/swatches/2065376_465.jpg'
                }
              },
              'itemInfo': {
                'listPrice': extractFloat(20.75),
                'offerPrice': extractFloat(18.15),
                'linePrice': extractFloat(18.15) * (parseInt(2)),
                'quantity': parseInt(5),
                'quantityCanceled': parseInt(2) || 0,
                'quantityShipped': parseInt(null) || 0,
                'quantityReturned': parseInt(null) || 0,
                'quantityOOS': 0 // no support from backend
              }
            }
          ],
          status: ORDER_STATUS.ORDER_SHIPPED,
          trackingNumber: '1ZW64107YW87134803',
          trackingUrl: 'http://wwwapps.ups.com/WebTracking/track?track=yes&amp;trackNums=1ZW64107YW87134803',
          shippedDate: '4/15/2018 03:53:01'
        },
        {
          items: [
            {
              'productInfo': {
                'generalProductId': '62142',
                'skuId': '768326',
                'name': sanitizeEntity('Boys Skinny Chino Pants'),
                'imagePath': 'https://uatlive2.childrensplace.com/wcsstore/GlobalSAS/images/tcp/products/500/1101084_FX.jpg',
                'upc': '00700953912605',
                'size': '5',
                'fit': 'regular',
                'pdpUrl': '/shop/us/p/chino-pants-1101084-FX',
                'color': {
                  'name': 'FLAX',
                  'imagePath': '/wcsstore/GlobalSAS/images/tcp/products/swatches/1101084_FX.jpg'
                }
              },
              'itemInfo': {
                'listPrice': extractFloat(10.45),
                'offerPrice': extractFloat(9.10),
                'linePrice': extractFloat(9.10) * (parseInt(4)),
                'quantity': parseInt(4),
                'quantityCanceled': parseInt(null) || 0,
                'quantityShipped': parseInt(4) || 0,
                'quantityReturned': parseInt(null) || 0,
                'quantityOOS': 0 // no support from backend
              }
            },
            {
              'productInfo': {
                'generalProductId': '62141',
                'skuId': '768325',
                'name': sanitizeEntity('Funny Items &prime; &Prime; &quot;'),
                'imagePath': 'https://int3.childrensplace.com/wcsstore/GlobalSAS/images/tcp/products/swatches/2065376_465.jpg',
                'upc': '00700953912602',
                'size': 's1',
                'fit': 'slim',
                'pdpUrl': '/shop/us/p/chino-pants-1101084-FX',
                'color': {
                  'name': 'Gray Steel',
                  'imagePath': '/wcsstore/GlobalSAS/images/tcp/products/swatches/2065376_465.jpg'
                }
              },
              'itemInfo': {
                'listPrice': extractFloat(20.75),
                'offerPrice': extractFloat(18.15),
                'linePrice': extractFloat(18.15) * (parseInt(2)),
                'quantity': parseInt(5),
                'quantityCanceled': parseInt(2) || 0,
                'quantityShipped': parseInt(null) || 0,
                'quantityReturned': parseInt(null) || 0,
                'quantityOOS': 0 // no support from backend
              }
            }
          ],
          status: ORDER_STATUS.ORDER_RECEIVED
        }
      ],
      outOfStockItems: [
        {
          'productInfo': {
            'generalProductId': '62143',
            'skuId': '768327',
            'name': sanitizeEntity('funny OOS items'),
            'imagePath': 'https://int3.childrensplace.com/wcsstore/GlobalSAS/images/tcp/products/swatches/2065376_465.jpg',
            'upc': '00700953912743',
            'size': 's1',
            'fit': 'slim',
            'pdpUrl': '/shop/us/p/chino-pants-1101084-FX',
            'color': {
              'name': 'Gray Steel',
              'imagePath': '/wcsstore/GlobalSAS/images/tcp/products/swatches/2065376_465.jpg'
            }
          },
          'itemInfo': {
            'quantity': 1,
            quantityCanceled: 0,
            'listPrice': 11.95,
            'offerPrice': 10.90
          }
        }
      ],
      canceledItems: [
        {
          'productInfo': {
            'generalProductId': '62144',
            'skuId': '768328',
            'name': sanitizeEntity('Funny Canceled Items'),
            'imagePath': 'https://int3.childrensplace.com/wcsstore/GlobalSAS/images/tcp/products/swatches/2065376_465.jpg',
            'upc': '00700953912745',
            'size': 's1',
            'fit': 'slim',
            'pdpUrl': '/shop/us/p/chino-pants-1101084-FX',
            'color': {
              'name': 'Gray Steel',
              'imagePath': '/wcsstore/GlobalSAS/images/tcp/products/swatches/2065376_465.jpg'
            }
          },
          'itemInfo': {
            'listPrice': extractFloat(10.75),
            'offerPrice': extractFloat(8.15),
            'linePrice': extractFloat(8.15) * (parseInt(5)),
            'quantity': parseInt(5),
            'quantityCanceled': parseInt(5) || 0,
            'quantityShipped': parseInt(null) || 0,
            'quantityReturned': parseInt(null) || 0,
            'quantityOOS': 0 // no support from backend
          }
        }
      ]
    }, args);
  },

  reservationLookUp: function (orderId, emailId) {
    return editJsonPopup('reservationLookUp', {
      orderNumber: '58322656564',
      orderDate: '4/4/2017 03:53:01',
      pickUpExpirationDate: '4/15/2018 03:53:01',
      pickedUpDate: '4/13/2018 03:53:01',
      status: ORDER_STATUS.ORDER_RECEIVED,
      checkout: {
        pickUpStore: {
          'basicInfo': {
            'id': '1',
            'storeName': 'Union Square',
            'address': {
              'addressLine1': '36 Union Sq. East',
              'city': 'New York',
              'state': 'NY',
              'zipCode': '10003',
              'addressLine1': '500 Plaza Drive'
            },
            'phone': '(212) 529-2201',
            'coordinates': {
              'lat': 40.720481,
              'long': -73.845743
            }
          },
          'hours': {
            'regularHours': [
              {
                'dayName': 'Monday'.toUpperCase() || '',
                'openIntervals': [{
                  'fromHour': '2017-11-15 11:21:49.994',
                  'toHour': '2017-11-15 16:21:49.994'
                }, {
                  'fromHour': '2017-11-15 17:21:49.994',
                  'toHour': '2017-11-15 22:21:49.994'
                }],
                'isClosed': false
              },
              {
                'dayName': 'Tuesday'.toUpperCase() || '',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994'
                }],
                'isClosed': false
              },
              {
                'dayName': 'Wednesday'.toUpperCase() || '',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994'
                }],
                'isClosed': false
              },
              {
                'dayName': 'Black Friday',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994'
                }],
                'isClosed': false
              },
              {
                'dayName': 'Thanksgiving',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': true
              },
              {
                'dayName': 'Saturday'.toUpperCase() || '',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Sunday'.toUpperCase() || '',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              }
            ]
          },
          'features': {
            'storeType': 'Retail Store',
            'mallType': 'Enclosed Mall',
            'entranceType': 'Internal',
            'isBopisAvailable': true
          }
        }
      },
      purchasedItems: [
        {
          'productInfo': {
            'generalProductId': '62142',
            'skuId': '768326',
            'name': sanitizeEntity('chino pants &amp; &Amp; china'),
            'imagePath': 'https://uatlive2.childrensplace.com/wcsstore/GlobalSAS/images/tcp/products/500/1101084_FX.jpg',
            'upc': '00700953912603',
            'size': '5',
            'fit': 'regular',
            'pdpUrl': '/shop/us/p/chino-pants-1101084-FX',
            'color': {
              'name': 'FLAX',
              'imagePath': '/wcsstore/GlobalSAS/images/tcp/products/swatches/1101084_FX.jpg'
            }
          },
          'itemInfo': {
            'quantity': 1,
            'listPrice': 17.95,
            'offerPrice': 17.95,
            'quantityCanceled': 0
          }
        },
        {
          'productInfo': {
            'generalProductId': '62141',
            'skuId': '768325',
            'name': sanitizeEntity('funny items &prime; &Prime; &quot;'),
            'imagePath': 'https://int3.childrensplace.com/wcsstore/GlobalSAS/images/tcp/products/swatches/2065376_465.jpg',
            'upc': '00700953912604',
            'size': 's1',
            'fit': 'slim',
            'pdpUrl': '/shop/us/p/chino-pants-1101084-FX',
            'color': {
              'name': 'Gray Steel',
              'imagePath': '/wcsstore/GlobalSAS/images/tcp/products/swatches/2065376_465.jpg'
            }
          },
          'itemInfo': {
            'quantity': 1,
            'listPrice': 11.95,
            'offerPrice': 10.90,
            'quantityCanceled': 0
          }
        }
      ],
      canceledItems: [
        {
          'productInfo': {
            'generalProductId': '62144',
            'skuId': '768328',
            'name': sanitizeEntity('funny canceled items'),
            'imagePath': 'https://int3.childrensplace.com/wcsstore/GlobalSAS/images/tcp/products/swatches/2065376_465.jpg',
            'upc': '00700953912745',
            'size': 's1',
            'fit': 'slim',
            'pdpUrl': '/shop/us/p/chino-pants-1101084-FX',
            'color': {
              'name': 'Gray Steel',
              'imagePath': '/wcsstore/GlobalSAS/images/tcp/products/swatches/2065376_465.jpg'
            }
          },
          'itemInfo': {
            'quantity': 3,
            'listPrice': 11.95,
            'offerPrice': 10.90,
            'quantityCanceled': 1
          }
        }
      ]
    }, { orderId, emailId });
  }

};
