/**
@module Checkout Static Service Abstractors
*/
import {editJsonPopup} from 'util/testUtil/editJsonPopup';
import {parseDate} from 'util/parseDate.js';
import {flatCurrencyToCents, toTimeString, capitalize} from '../apiUtil';

export function getCheckoutAbstractor () {
  return CheckoutStaticAbstractor;
}

const CheckoutStaticAbstractor = {

  addGiftCard: function (args) {
    return editJsonPopup('addGiftCard', {
      paymentId: '2980732',
      balance: 95.95
    }, args);
  },

  removeGiftCard: function (paymentId) {
    return editJsonPopup('removeGiftCard', { success: true }, { paymentId });
  },

  getGiftWrappingOptions: function () {
    return editJsonPopup('getGiftWrappingOptions', [{
      shortDescription: 'Standard Gift Service',
      id: '464502',
      price: 2.00,
      displayName: 'Standard Gift Service'
    },
      {
        shortDescription: 'Deluxe Gift Service',
        id: '464504',
        price: 6.00,
        displayName: 'Deluxe Gift Service'
      }]);
  },

  addGiftWrappingOption: function (giftMessage, giftWrapOptionId, orderId) {
    return editJsonPopup('addGiftWrappingOption', { orderId: '8928367023' }, {orderId, giftMessage, giftWrapOptionId});
  },

  removeGiftWrappingOption: function () {
    return editJsonPopup('removeGiftWrappingOption', { orderId: '8928367023' });
  },

  getShippingMethods: function (state, zipCode, addressLine1, addressLine2) {
    return editJsonPopup('getShippingMethods', [{
      id: 'UGNR',
      displayName: 'Free Standard Shipping',
      shippingSpeed: 'up to 10 Business Days',
      price: 0,
      isDefault: true
    },
      {
        id: 'UGNR2',
        displayName: 'Express Shipping',
        shippingSpeed: 'Up to 3 business days',
        price: 10,
        isDefault: false
      }], {state, zipCode, addressLine1, addressLine2});
  },

  setShippingMethodAndAddressId: function (shippingTypeId, addressId) {
    return editJsonPopup('setShippingMethodAndAddressId', {
      success: true,
      plccEligible: true,
      prescreenCode: '123456'
    }, {shippingTypeId, addressId});
  },

  reviewOrder: function () {
    return editJsonPopup('reviewOrder', { orderId: '88091270321' });
  },

  submitOrder: function (orderId) {
    return editJsonPopup('submitOrder', {
      'errorCode': '',
      'errorMessage': '',
      'exceptionData': '',
      'orderSummaryJson': {
        'OrderLevelPromos': {
          'explicit': [

          ],
          'implicit': [

          ]
        },
        'airMiles': {
          airMilesAccount: '12312312312',
          airMilesDeal: '1234'
        },
        'bopisIntlField': false,
        'cartCount': 1,
        'currencyCode': 'USD',
        'finalShippingCharge': 5,
        'grandTotal': 24.5,
        'isPayPalAllowed': false,
        'isROPISEnabledInState': 'TRUE',
        'mixOrderDetails': {
          'data': [
            {
              'itemsCount': 1,
              'orderType': 'ECOM',
              'piAmount': '24.50',
              'shippingAddressDetails': {
                'address': '500 Plaza Dr',
                'addressId': 1574260,
                'addressLine1': '500 Plaza Dr',
                'addressLine2': '',
                'addressLine3': '',
                'addressNickName': 'sb_2017-04-06 14:11:59.437',
                'altEmail': '',
                'altName': '',
                'city': 'Secaucus',
                'country': 'US',
                'email1': 'nman@childrensplace.com',
                'firstName': 'NNN',
                'lastName': 'MMM',
                'phone1': '555-555-5555',
                'state': 'NJ',
                'zipCode': '07094-3619'
              },
              'subOrderId': '8006355018',
              'subtotal': '19.50',
              'totalAdjustment': '0.00',
              'totalShipping': '5.00',
              'totalShippingTax': '0.00',
              'totalTax': '0.00'
            }
          ],
          'mixCart': 'ECOM'
        },
        'mixOrderPaymentDetails': [
          {
            'orderType': 'ECOM',
            'paymentList': [
              {
                '_classname': 'com.tcp.commerce.integration.order.dto.TCPPaymentsData',
                '_type': 'JavaClass',
                'authorizedAmount': 24.5,
                'billingAddressDetails': {
                  'address': '500 Plaza Dr',
                  'addressLine1': '500 Plaza Dr',
                  'addressLine2': '',
                  'addressLine3': '',
                  'city': 'Secaucus',
                  'country': 'US',
                  'customerName': 'NNN MMM',
                  'email': 'nman@childrensplace.com',
                  'firstName': 'NNN',
                  'lastName': 'MMM',
                  'phone1': '555-555-5555',
                  'state': 'NJ',
                  'zipCode': '07094-3619'
                },
                'cardExpirationMonth': '6',
                'cardExpirationYear': '2022',
                'cardHolderName': 'NNN MMM',
                'cardType': 'VISA',
                'class': 'com.tcp.commerce.integration.order.dto.TCPPaymentsData',
                'maskedCardNumber': '************0026',
                'paymentMethod': 'COMPASSVISA',
                'piId': '1091048'
              }
            ],
            'subOrderId': '8006355018'
          }
        ],
        'orderDiscountAmount': 0,
        'orderItems': [

        ],
        'orderStatus': 'P',
        'orderSubTotal': 19.5,
        'orderSubTotalBeforeDiscount': 19.5,
        'orderTotalAfterDiscount': 19.5,
        'parentOrderId': 8006355018,
        'paymentsList': [
          {
            'authorizedAmount': 24.5,
            'billingAddressDetails': {
              'address': '500 Plaza Dr',
              'addressLine1': '500 Plaza Dr',
              'addressLine2': '',
              'addressLine3': '',
              'city': 'Secaucus',
              'country': 'US',
              'customerName': 'NNN MMM',
              'email': 'nman@childrensplace.com',
              'firstName': 'NNN',
              'lastName': 'MMM',
              'phone1': '555-555-5555',
              'state': 'NJ',
              'zipCode': '07094-3619'
            },
            'cardExpirationMonth': '6',
            'cardExpirationYear': '2022',
            'cardHolderName': 'NNN MMM',
            'cardType': 'VISA',
            'maskedCardNumber': '************0026',
            'paymentMethod': 'COMPASSVISA',
            'piId': '1091048'
          }
        ],
        'placedOrderTime': '2017-04-06 14:12:45.138',
        'pointsToNextReward': 0,
        'valueOfEarnedPcCoupons': 50,
        'salesTax': {
          'salesTax': {
            'US': {
              'stateTax': 0
            }
          }
        },
        'shipModeDescription': 'Standard',
        'shipModeId': '901101',
        'shippingCharge': 5,
        'shippingDiscount': 0,
        'shippingTax': 0,
        'totalGiftCardAmount': 0,
        'userPoints': 20
      }
    }).then((res) => {
      let r = res;
      let orderSummary = r.addCheckoutResponse ? r.addCheckoutResponse.orderSummaryJson : r.orderSummaryJson;
      let orderDetails = orderSummary.orderDetailsResponse || orderSummary;
      let orderBopisDetails = r.storeInfoResponse || null;
      let onlineOrder = orderSummary && orderSummary.mixOrderDetails && orderSummary.mixOrderDetails.data && orderSummary.mixOrderDetails.data.length > 0 ? orderSummary.mixOrderDetails.data.find((address) => address.orderType === 'ECOM') || {} : {};
      let shipping = onlineOrder.shippingAddressDetails || null;
      let addressDetails = orderSummary && orderSummary.mixOrderDetails && orderSummary.mixOrderDetails.data && orderSummary.mixOrderDetails.data.length > 0 ? orderSummary.mixOrderDetails.data[0].shippingAddressDetails : {};

      let sthOrderId = onlineOrder ? onlineOrder.subOrderId : null;
      let sthTotalOrder = onlineOrder.piAmount ? flatCurrencyToCents(onlineOrder.piAmount) : null;
      let sthItemCount = onlineOrder.itemsCount ? flatCurrencyToCents(onlineOrder.itemsCount) : null;
      let sthOrderPlaced = parseDate(orderSummary.placedOrderTime);

      let trackinLinkPrefix = '/shop/TCPOrderLookUp?catalogId=' + '10551' + '&langId=' + '-1' + '&storeId=' + '10151';
      let sthLinkOrder = trackinLinkPrefix + '&shipmentTypeId=1&forSearch=1&orderId=' + sthOrderId + '&emailId=' + ((shipping || addressDetails).email1 || '');

      let stateTax = 0;

      if (orderSummary.salesTax && orderSummary.salesTax.salesTax) {
        for (let country in orderSummary.salesTax.salesTax) {
          for (let state in orderSummary.salesTax.salesTax[country]) {
            stateTax = orderSummary.salesTax.salesTax[country][state];
          }
        }
      }

      // FIXME: cleanup, info repeated in some nodes
      // FIXME: cleanup. we should only store information relevant to confirmation page.
      let orderConfirmationDetails = {
        summary: {
          itemsTotal: orderSummary.orderSubTotal,
          itemsCount: orderSummary.cartCount,
          couponsTotal: 0,
          giftWrappingTotal: 0, // FIXME: retrieve value from response
          giftCardsTotal: flatCurrencyToCents(orderSummary.totalGiftCardAmount) || 0,
          savingsTotal: Math.abs(flatCurrencyToCents(orderSummary.orderDiscountAmount) || 0) - Math.abs(flatCurrencyToCents(orderSummary.shippingDiscount) || 0),
          taxesTotal: flatCurrencyToCents(orderSummary.shippingTax) + stateTax,
          shippingTotal: flatCurrencyToCents(orderSummary.shippingCharge),
          estimatedRewards: orderSummary.userPoints,
          pointsToNextReward: orderSummary.pointsToNextReward,
          valueOfEarnedPcCoupons: orderSummary.valueOfEarnedPcCoupons,
          subTotal: flatCurrencyToCents(orderSummary.orderSubTotalBeforeDiscount),
          grandTotal: orderSummary.grandTotal
        },

        isOrderPending: orderSummary.orderStatus === 'P',

        holdDate: null,
        totalsByFullfillmentCenterMap: orderBopisDetails ? orderBopisDetails.PhysicalStore.map((store, index) => {
          let summary = orderDetails.mixOrderDetails.data.find((details) => details.shippingAddressDetails.stLocId === store.uniqueID) || {};
          let bopisOrderTrackLink = trackinLinkPrefix + '&shipmentTypeId=1&forSearch=1&orderId=' + summary.subOrderId + '&emailId=' + (summary.shippingAddressDetails.email1 || '');

          let storeHours = JSON.parse(store.Attribute[0].displayValue);
          let todayOpeningTime = toTimeString(parseDate(storeHours.storehours[0].availability[0].from));
          let todayClosingTime = toTimeString(parseDate(storeHours.storehours[0].availability[0].to));
          let tomorrowOpeningTime = toTimeString(parseDate(storeHours.storehours[1].availability[0].from));
          let tomorrowClosingTime = toTimeString(parseDate(storeHours.storehours[1].availability[0].to));

          return {
            id: (store.uniqueID || store.uniqueId || store.storeLocId || store.storeUniqueID || store.stLocId).toString(),
            storeName: capitalize(store.Description[0].displayStoreName),
            address: {
              addressLine1: store.addressLine[0],
              addressLine2: store.addressLine[1],
              city: store.city,
              state: store.stateOrProvinceName,
              zipCode: (store.postalCode || '').trim(),
              country: store.country
            },
            phoneNumber: (store.telephone1 || '').trim(),
            productsCount: parseInt(summary.itemsCount),

            todayOpenRange: todayOpeningTime + ' - ' + todayClosingTime,
            tomorrowOpenRange: tomorrowOpeningTime + ' - ' + tomorrowClosingTime,

            orderDate: parseDate(orderDetails.placedOrderTime),
            orderNumber: summary.subOrderId,
            orderLink: bopisOrderTrackLink,
            orderTotal: flatCurrencyToCents(summary.piAmount)
          };
        }) : null,

        orderDetails: {
          date: parseDate(orderDetails.placedOrderTime),
          orderNumber: onlineOrder ? onlineOrder.subOrderId : '[NOT_AVAILABLE]',
          trackingLink: sthLinkOrder,
          orderTotal: orderSummary.grandTotal
        },
        rewardedPoints: orderDetails.estimatedPointsEarned
      };

      if (orderDetails.airMiles) {
        orderConfirmationDetails.airmiles = {
          accountNumber: orderDetails.airMiles.airMilesAccount,
          promoId: orderDetails.airMiles.airMilesDeal
        };
      }

      if (orderDetails.OrderLevelPromos && orderDetails.OrderLevelPromos.explicit) {
        for (let item of orderDetails.OrderLevelPromos.explicit) {
          for (let promoCode in item) {
            orderConfirmationDetails.summary.couponsTotal += Math.abs(flatCurrencyToCents(item[promoCode].price));
          }
        }
      }

      orderConfirmationDetails.summary.savingsTotal -= orderConfirmationDetails.summary.couponsTotal;

      if (orderSummary.giftWrapItem && orderSummary.giftWrapItem.length) {
        orderConfirmationDetails.summary.giftWrappingTotal = flatCurrencyToCents(orderSummary.giftWrapItem[0].totalPrice);
        orderConfirmationDetails.summary.subTotal -= orderConfirmationDetails.summary.giftWrappingTotal;
      }

      if (shipping) {
        orderConfirmationDetails.shipping = {
          address: {
            firstName: shipping.firstName,
            lastName: shipping.lastName
          },
          emailAddress: shipping.email1,

          // STH only settings (not necesarely the totals)
          orderDate: sthOrderPlaced,
          orderLink: sthLinkOrder,
          orderTotal: sthTotalOrder,
          itemsCount: sthItemCount
        };
      }

      // Information needed for guest user registration on confirmation page
      orderConfirmationDetails.userDetails = {
        emailAddress: (shipping || addressDetails).email1 || (orderConfirmationDetails.shipping ? orderConfirmationDetails.shipping.emailAddress : null)
      };

      for (let payment of orderDetails.paymentsList) {
        if (payment.cardType !== 'GC') {
          // CC or PayPal
          let billingAddress = payment.billingAddressDetails;
          let billingFirstName = (billingAddress.customerName || '').match(/(\w+)/);
          let billingLastName = (billingAddress.customerName || '').match(/(\w+)$/);

          orderConfirmationDetails.userDetails = {
            firstName: billingFirstName ? billingFirstName[0] : '',
            lastName: billingLastName ? billingLastName[0] : '',
            zipCode: (billingAddress.zipCode || '').trim(),
            // emailAddress: billingAddress.email || orderConfirmationDetails.userDetails.emailAddress,
            emailAddress: orderConfirmationDetails.userDetails.emailAddress || billingAddress.email, // use the shipping email address
            phoneNumber: billingAddress.phone1 || addressDetails.phone1
          };
        }
      }

      // FIXME: should come from backend / variable days
      let holdDate = parseDate(orderDetails.placedOrderTime);
      holdDate.setDate(holdDate.getDate() + 4);
      orderConfirmationDetails.holdDate = holdDate;

      return orderConfirmationDetails;
    }).catch((err) => {
      throw err;// getFormattedError(err);
    });
  },

  addPaymentToOrder: function (args) {
    return editJsonPopup('addPaymentToOrder', {
      paymentIds: [
        {paymentId: '2980732'},
        {paymentId: '2980731'}
      ]
    }, args);
  },

  addGiftCardPaymentToOrder: function (args) {
    return editJsonPopup('addGiftCardPaymentToOrder', {
      paymentIds: [
        {paymentId: '2980732'}
      ]
    }, args);
  },

  updatePaymentOnOrder: function (args) {
    return editJsonPopup('updatePaymentOnOrder', {paymentId: '458569985'}, args);
  },

  getPaymentsAppliedToOrder: function () {
    return editJsonPopup('getPaymentsAppliedToOrder', [
      {
        'addressId': '1357743',
        'firstName': 'Michael',
        'lastName': 'Citro',
        'addressLine1': '',
        'addressLine2': '',
        'city': '',
        'state': '',
        'zipCode': '07047',
        'country': 'US',
        'email': 'DEVOPS1@GMAIL.COM',
        'phone': '2012336701',
        'isSavedToAccount': true,
        'paymentInformation': {
          'expire_month': '9',
          'account_pin': '0546',
          'cc_brand': 'GC',
          'billing_address_id': '1357743',
          'payment_method': 'GiftCard',
          'balance': '500.00',
          'expire_year': '2020',
          'account': '***************2624'
        }
      },
      {
        'addressId': '1357743',
        'firstName': 'Michael',
        'lastName': 'Citro',
        'addressLine1': '',
        'addressLine2': '',
        'city': '',
        'state': '',
        'zipCode': '07047',
        'country': 'US',
        'email': 'DEVOPS1@GMAIL.COM',
        'phone': '2012336701',
        'isSavedToAccount': true,
        'paymentInformation': {
          'expire_month': '9',
          'account_pin': '0546',
          'cc_brand': 'GC',
          'billing_address_id': '1357743',
          'payment_method': 'GiftCard',
          'balance': '500.00',
          'expire_year': '2020',
          'account': '***************2624'
        }
      }
    ]);
  },

  updateAirMilesInfo: function (orderId, promoId, cardNumber) {
    return editJsonPopup('updateAirMilesInfo', { success: true }, {orderId, promoId, cardNumber});
  },

  getOrderConfirmation: function (orderId) {
    return editJsonPopup('getOrderConfirmation', {
      summary: {
        itemsTotal: 19.9,
        couponsTotal: 45.3,
        giftWrapping: 4.85,
        giftCardsTotal: 9.99,
        itemsCount: 2,
        savingsTotal: 10,
        taxTotal: 7.79,
        shippingTotal: 19.9,
        estimatedRewards: 40,
        pointsToNextReward: 12,
        subTotal: 99.9,
        grandTotal: 109.47
      },

      shipping: {
        address: {
          firstName: 'john',
          lastName: 'doe',
          addressLine1: '500 Plaza Dr',
          addressLine2: '',
          city: 'Secaucus',
          state: 'NJ',
          zipCode: '07052',
          country: 'US'
        },
        phoneNumber: '555-555-5555',

        // STH only settings (not necesarely the totals)
        orderDate: new Date(),
        orderLink: '#',
        orderTotal: 99.95,
        emailAddress: 'john-doe@gmail.com',
        itemsCount: 1      // STH products count
      },
      holdDate: new Date(),
      totalsByFullfillmentCenterMap: [{
        id: '1234',
        storeName: 'store name',
        address: {
          addressLine1: '500 Plaza Dr',
          addressLine2: '',
          city: 'Secaucus',
          state: 'NJ',
          zipCode: '07052',
          country: 'US'
        },
        productsCount: 2,
        orderDate: new Date(),
        orderNumber: '123123123123',
        orderLink: '#NOT_PROVIDED',
        orderTotal: 99.99
      }],
      orderDetails: {
        date: new Date(),
        orderNumber: '12312312',
        trackingLink: '#NOT-COMING-IN-SERVICE-RESPONSE'
      },
      rewardedPoints: 0
    }, {orderId});
  },

  startExpressCheckout: function () {
    return editJsonPopup('startExpressCheckout', {
      orderId: '8020348630',
      plccEligible: true,
      prescreenCode: 'ThisCodeIsLegit'
    });
  },

  getInternationCheckoutSettings: function () {
    return editJsonPopup('getInternationCheckoutSettings', {
      checkoutUrl: 'https://stagecheckout.fiftyone.com/v4#/checkout/E4X000001082043-8N2YoE*nJKxXXudniczF0sOmIdoE87u*sdBFgaK64vw?version=e4_0&merchantid=2646&method=default&consumeraccountenabled='
    });
  }
};
