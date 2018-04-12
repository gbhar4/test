/**
@module Checkout Service Abstractors
*/
import {endpoints} from './endpoints.js';
import {parseDate} from 'util/parseDate.js';
import {ServiceResponseError} from 'service/ServiceResponseError';
import {CREDIT_CARDS_PAYMETHODID} from './accountDynamicAbstractor';
import {flatCurrencyToCents, toTimeString, capitalize, parseBoolean} from '../apiUtil';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';

let previous = null;
export function getCheckoutAbstractor (apiHelper) {
  if (!previous || previous.apiHelper !== apiHelper) {
    previous = new CheckoutDynamicAbstractor(apiHelper);
  }
  return previous;
}

class CheckoutDynamicAbstractor {
  constructor (apiHelper) {
    this.apiHelper = apiHelper;

    // create this-bound varsions of all methods of this class
    bindAllClassMethodsToThis(this);
  }

  /**
   * @function addGiftCard
   * @summary This API is used to apply a giftcard to your current order
   * @param {Object} args - This is an object of strings whose members are the below params
   * @param {String} args.billingAddressId - This is the id of the users billing address, see getShippingMethods
   * @param {String} args.giftcardPin - This is the pin of the giftcard that the user has entered
   * @param {String} args.giftcardBalance - This is the balance of the gift card, see getGiftCardBalance
   * @param {String} args.giftcardAccountNumber - This is the account of the giftcard, or the giftcard number
   * @see setUserShippingAddresses, getGiftCardBalance, removeGiftCard
   * @see MuleSoft Doc:
   * @see https://childrensplace.atlassian.net/wiki/display/DT/API+Specification+Documentation?preview=/44072969/50233464/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_addPaymentInstruction_v5.docx
   * @see Related Jira Tasks
   * @see https://childrensplace.atlassian.net/browse/DT-5407
   * @see https://childrensplace.atlassian.net/browse/DT-2163
   * @return {Object} This will resolve with an object holding all the payment ids attached to the current order, in this case the giftcard which is treated as a payment method. Likewise on promise rejection you will get an object with the returned error code.
   * @return paymentIds: This is an array of objects. each object has a paymentId value which is the payment id. These are all the payments applied to this order.
   * @example addGiftCard(
    {
      billingAddressId: '4237780',
      giftcardPin: '1234',
      giftcardBalance: '431.26',
      giftcardAccountNumber: '4083927423223'
      recaptchaToken: '...token from recaptcha....'
    })
    .then((res) => {
    console.log(res) //{ paymentIds: [ {paymentId : "2980732" }, {paymentId : "2980731" } ]
  })
 */
  addGiftCard (args) {
    let payload = {
      header: {
        isRest: 'true',
        identifier: 'true',
        savePayment: (args.saveToAccount) ? 'true' : 'false', // save to account for registered users
        nickName: args.nickName || ('Billing_' + this.apiHelper.configOptions.storeId + '_' + (new Date()).getTime().toString())
      },
      body: {
        paymentInstruction: [{
          payMethodId: 'GiftCard',
          piAmount: '1.00', // needs to be less then the total on the giftcard. Some IBM needed peramiter.
          billing_address_id: args.billingAddressId,
          cc_brand: 'GC',
          account: args.giftcardAccountNumber,
          account_pin: args.giftcardPin,
          'recapture-response': args.recaptchaToken
        }]
      },
      webService: endpoints.addPaymentInstruction
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return {
        paymentId: res.body.paymentInstruction[0].piId
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function removeGiftCard
   * @summary This API is used to remove a giftcard from the order
   * @param {String} paymentId - This is the id of the payment method you want to remove, in this case its the giftcard.
   * @see setGiftCard, getUserSavedPaymentInfo
   * @see MuleSoft Doc:
   * @see https://childrensplace.atlassian.net/wiki/display/DT/API+Specification+Documentation?preview=/44072969/50233467/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_deletePaymentInstruction_v5.docx
   * @return {Object} This will resolve with an object holding a success which will be true if the card was removed from the order, else and error code. Likewise on promise rejection you will get an object with the returned error code.
   * @return success: True if removed.
   * @example removeGiftCard("427839023").then((res) => {
    console.log(res) // { success: "true" }
  })
 */
  removeGiftCard (paymentId) {
    let payload = {
      body: {
        piIds: paymentId
      },
      webService: endpoints.deletePaymentInstruction
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return res.body;
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function getGiftWrappingOptions
   * @summary This API will return all the options a customer has in regards to gift wrapping.
   * @see addGiftWrappingOption
   * @see MuleSoft Doc:
   * @see https://childrensplace.atlassian.net/wiki/display/DT/API+Specification+Documentation?preview=/44072969/50233485/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_giftOptionsCmd_v5.docx
   * @return {Array<Object>} This will resolve with an array of all the needed info for adding a gift options.Likewise on promise rejection you will get an object with the returned error code.
   * @return id: This is the id of the gift option that needs to be added to the cart using the addGiftWrappingOption
   * @return displayName: this is the text value to be displayed to the user.
   * @return price: This is the text price value to be displayed to the user.
   * @return shortDescription: In the wireframes they have this under the optionText value.
   * @example getGiftWrappingOptions().then((res) => {
    console.log(res);
    [{
      "shortDescription": "Standard Gift Service",
      "id": "464502",
      "price": "2.00",
      "displayName": "Standard Gift Service"
    },
    {
      "shortDescription": "Deluxe Gift Service",
      "id": "464504",
      "price": "6.00",
      "displayName": "Deluxe Gift Service"
    }]
  })
 */
  getGiftWrappingOptions () {
    let payload = {
      webService: endpoints.giftOptionsCmd
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      let filteredRes = [];

      Object.keys(res.body.giftOptions).map((index) => {
        filteredRes.push({
          id: res.body.giftOptions[index].catEntryId,
          displayName: res.body.giftOptions[index].name.split(':')[0],
          price: flatCurrencyToCents(res.body.giftOptions[index].price),
          shortDescription: res.body.giftOptions[index].longDescription
        });
      });

      return filteredRes;
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function addGiftWrappingOption
   * @summary This API is used to add a giftwrapping option to the order
   * @param {String} orderId - The order id of which you want to add the option for
   * @param {String} giftMessage - The gift message that you would like to add
   * @param {String} giftWrapOptionId - The id of the optionsMap you would like to add to the order, see getGiftWrappingOptions
   * @see getGiftWrappingOptions
   * @see MuleSoft Doc:
   * @see https://childrensplace.atlassian.net/wiki/display/DT/API+Specification+Documentation?preview=/44072969/50233479/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_addGiftOptions_v4.docx
   * @return {Object} This will resolve with an object holding the orderId you have added the item to. Likewise on promise rejection you will get an object with the returned error code.
   * @return orderId: This can be used in many other APIs such as checkout.
   * @example addGiftWrappingOption("8928367023", "Test Message", "467952").then((res) => {
    console.log(res) // { orderId:"8928367023" }
  })
 */
  addGiftWrappingOption (giftMessage, giftWrapOptionId, orderId) {
    let payload = {
      body: {
        orderId: orderId || '.', // '.' means use context one
        GiftMsg: giftMessage || '',
        quantity_0: '1',
        catEntryId_0: giftWrapOptionId
      },
      webService: endpoints.addGiftOptions
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return {
        orderId: res.body.orderId.orderId
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  removeGiftWrappingOption () {
    let payload = {
      body: {
        orderId: '.',
        GiftMsg: '',
        quantity_0: '',
        catEntryId_0: ''
      },
      webService: endpoints.addGiftOptions
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return {
        orderId: res.body.orderId.orderId
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function getShippingMethods
   * @summary This API will return the possible shipping methods the user can select between
   * @param {String} state - The state in which you are looking to ship to
   * @param {String} zipCode - The zipCode in which you are looking to ship to
   * @see MuleSoft Doc:
   * @see https://childrensplace.atlassian.net/wiki/display/DT/API+Specification+Documentation?preview=/44072969/50233487/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_getShippingMethodCA_v4.docx
   * @see Related Jira Tickets
   * @see https://childrensplace.atlassian.net/browse/DT-2156
   * @return {Object} This will resolve with the possible shipping options for your location. Likewise on promise rejection you will get an object with the returned error code.
   * @return res[i].shippingTypeId: This is the id to be passed into the setShippingMethodAndAddressId
   * @return res[i].description: This is the description for the user to read.
   * @return res[i].shippingPrice: The price of the shipping
   * @return res[i].isDefault: is this the default shipping method or not
   * @example getShippingMethods("NJ", "07047").then((res) => {
    console.log(res);
    jsonArr: [{
      shippingTypeId:"UGNR",
      description:"Standard $5 Up To 10 Business Days",
      shippingPrice: '$5',
      isDefault: true
    },
    {
      shippingTypeId:"UGNR2",
      description:"Standard $5 Up To 10 Business Days",
      shippingPrice: '$5',
      isDefault: false
    }]
  })
  */

  getShippingMethods (state, zipCode, addressLine1, addressLine2) {
    // Note: (2-25, From Melvin Jose): based on his request we're relaxing when state and zipcode is being attached to the header, should values be empty or null we won't be sending them.
    if (this.activeGetShippingMethodsRequest && this.activeGetShippingMethodsRequest.abort) {
      this.activeGetShippingMethodsRequest.abort();
    }

    // Note: (2-25, From Melvin Jose): based on his request we're relaxing when state and zipcode is being attached to the header, should values be empty or null we won't be sending them.
    let dynamicHeader = {};
    if (state) {
      dynamicHeader.state = state;
    }
    if (zipCode) {
      dynamicHeader.zipCode = zipCode;
    }
    if (addressLine1) {
      dynamicHeader.addressField1 = addressLine1;
    }
    if (addressLine2) {
      dynamicHeader.addressField2 = addressLine2;
    }
    let payload = {
      header: dynamicHeader,
      webService: endpoints.getShipmentMethods
    };

    this.activeGetShippingMethodsRequest = this.apiHelper.webServiceCall(payload);

    return this.activeGetShippingMethodsRequest.then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      let methods = res.body.jsonArr;
      let resFiltered = [];
      let hasDefault = false;

      Object.keys(methods).map((index) => {
        let root = methods[index].description;
        let _tmp = root.split('Up To ');
        let price = methods[index].shippingPrice.match(/\$([0-9]+[\.]*[0-9]*)/);
        let displayName = (_tmp[0].indexOf('-') === -1) ? _tmp[0].replace('FREE', '- FREE') : _tmp[0];
        let shipphingMethod = _tmp.length > 1 ? 'Up To ' + _tmp[1] : '';

        if (price) {
          displayName = displayName.replace('$' + price[1], '');
        }

        hasDefault = hasDefault || methods[index].defaultShipMode;
        resFiltered.push({
          id: methods[index].shipModeId,
          displayName: (displayName || '').trim(), // return anything until $ sign is being matched
          shippingSpeed: (shipphingMethod || '').trim(), // whichever value using 'price' as anchor
          price: price ? parseInt(price[1]) : 0,
          isDefault: methods[index].defaultShipMode
        });
      });

      if (!hasDefault && methods.length) {
        resFiltered[0].isDefault = true;
      }

      return resFiltered;
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function updateShippingMethod
   * @summary This API wills set the shipping type you want for your order, like USPS
   * @param {String} shippingTypeId - See getShippingMethods to get a list of ids for this field
   * @see MuleSoft Doc:
   * @see https://childrensplace.atlassian.net/wiki/display/DT/API+Specification+Documentation?preview=/44072969/50233474/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_updateShippingMethodSelection_v3.docx
   * @return {Object} This will resolve with and object holding a success flag or an error code
   * @return success - true if the shipping was updated
   * @example setShippingMethodAndAddressId('901107').then((res) => {
    console.log(res) // { success: true }
  })
 */
  setShippingMethodAndAddressId (shippingTypeId, addressId, verifyPrescreen) {
    let payload = {
      body: {
        shipModeId: shippingTypeId,
        addressId: addressId,
        requesttype: 'ajax',
        prescreen: verifyPrescreen, // as per backend, DT-19753 & DT-19757, we are to pass this so they can run pre-screen function - DT-21915
        x_calculationUsage: '-1,-2,-3,-4,-5,-6,-7'
      },
      webService: endpoints.updateShippingMethodSelection
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      } else {
        let rtpsData = extractRtpsEligibleAndCode(res);

        return {
          success: true,
          plccEligible: rtpsData.plccEligible,
          prescreenCode: rtpsData.prescreenCode
        };
      }
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

/**
 * @function reviewOrder
 * @summary This is the function that is used when the user reviews there order before submitting. This API must be used before the submitOrder function.
 * @param {String} orderId - The users orderId that you will get ready to checkout
 * @see submitOrder
 * @see MuleSoft Doc:
 * @see https://childrensplace.atlassian.net/wiki/display/DT/API+Specification+Documentation?preview=/44072969/50233478/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_updateCheckout_v4.docx
 * @return {Object} Will resolve with and object hoding the orderId that you need to pass to the submitOrder function to complete the transaction. Likewise on promise rejection you will get an object with the returned error code.
 * @return orderId: This can be used in many other APIs such as submitOrder.
 * @example reviewOrder("88091270321").then((res) => {
 console.log(res); // { orderId: "88091270321" }
 })
 */
  reviewOrder () {
    let payload = {
      body: {
        storeId: this.apiHelper.configOptions.storeId,
        langId: this.apiHelper.configOptions.langId,
        catalogId: this.apiHelper.configOptions.catalogId
      },
      webService: endpoints.preCheckout
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return res.body;
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

/**
 * @function submitOrder
 * @summary This is the API used to submit the order and charge the customer
 * @param {String} orderId - The users orderId that you will checkout
 * @see reviewOrder
 * @see MuleSoft Doc:
 * @see https://childrensplace.atlassian.net/wiki/display/DT/API+Specification+Documentation?preview=/44072969/50233476/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_addCheckout_v3.docx
 * @return {Object} This will resolve with and object holding the orderId of the order you have submited. Likewise on promise rejection you will get an object with the returned error code.
 * @return orderId: This can be used in many other APIs.
 * @example submitOrder("88091270321").then((res) => {
 console.log(res); // { orderId: "88091270321" }
 })
 */
  submitOrder (orderId) {
    let payload = {
      body: {
        orderId: orderId || '.',
        isRest: 'true',
        locStore: 'True'  // NOTE: MS geniuses require this flag to avoid parsing reponses as when a store info is expected.
      },
      webService: endpoints.checkout
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      let r = res.body;
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

      let trackinLinkPrefix = '/shop/TCPOrderLookUp?catalogId=' + this.apiHelper.configOptions.catalogId + '&langId=' + this.apiHelper.configOptions.langId + '&storeId=' + this.apiHelper.configOptions.storeId;
      let sthLinkOrder = trackinLinkPrefix + '&shipmentTypeId=1&forSearch=1&orderId=' + sthOrderId + '&emailId=' + ((shipping || addressDetails).email1 || '');

      let stateTax = 0;

      if (orderSummary.salesTax && orderSummary.salesTax.salesTax) {
        for (let country in orderSummary.salesTax.salesTax) {
          for (let state in orderSummary.salesTax.salesTax[country]) {
            stateTax += parseFloat(orderSummary.salesTax.salesTax[country][state]);
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
          savingsTotal: Math.abs(flatCurrencyToCents(orderSummary.orderDiscountAmount) || 0),
          taxesTotal: flatCurrencyToCents(orderSummary.shippingTax) + stateTax,
          shippingTotal: flatCurrencyToCents(orderSummary.finalShippingCharge),
          estimatedRewards: orderSummary.userPoints,
          pointsToNextReward: orderSummary.pointsToNextReward,
          valueOfEarnedPcCoupons: parseInt(orderSummary.valueOfEarnedPcCoupons) || 0,
          subTotal: flatCurrencyToCents(orderSummary.orderSubTotalBeforeDiscount),
          grandTotal: orderSummary.grandTotal
        },

        isOrderPending: orderSummary.orderStatus === 'V',

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
            // TODO: legacy link, remove
            orderLink: bopisOrderTrackLink,
            orderTotal: flatCurrencyToCents(summary.piAmount),

            emailAddress: summary.shippingAddressDetails.email1
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

      // UGLY: I guess rounding causes this to be non zero in some cases
      // (or backend sending incorrect numbers)
      if (orderConfirmationDetails.summary.savingsTotal < 0) {
        orderConfirmationDetails.summary.savingsTotal = 0;
      }

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
          // TODO: legacy order link, remove
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
      throw this.apiHelper.getFormattedError(err);
    });
  }

/**
 * @method addPaymentToOrder
 * @summary This API is used to add a new payment method to a users order. This will apply the payment to the order not add it to the users account.
 * @param {Object} args - This is an object holding the below params
 * @param {String} args.cardNumber - The number on the card
 * @param {String} args.billingAddressId - The id of the address you would like to add to this payment method
 * @param {String} args.cardType - The credit card brand
 * @param {String} args.cvv - the cvv on the back of the card
 * @param {String} args.monthExpire - The month your credit card expires
 * @param {String} args.yearExpire - The year your card expires
 * @param {String} args.orderGrandTotal - This should be the grand total of the order.
 * @see updatePaymentInfo, getSavedPaymentInfo
 * @see MuleSoft Doc:
 * @see https://childrensplace.atlassian.net/wiki/display/DT/API+Specification+Documentation?preview=/44072969/50233464/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_addPaymentInstruction_v5.docx
 * @see Related Jira Ticket:
 * @see https://childrensplace.atlassian.net/browse/DT-2159
 * @return {Object} This will resolve with an object holding all the payment ids attached to the current order. Likewise on promise rejection you will get an object with the returned error code.
 * @return paymentIds: This is an array of objects. each object has a paymentId value which is the payment id. These are all the payments applied to this order.
 * @example addPaymentToOrder({
     billingAddressId: '4237780',
     cvv: '234',
     cardType: 'VISA',
     orderGrandTotal: '431.26',
     cardNumber: '4083927423223',
     monthExpire: '2',
     yearExpire: '2020'
   }).then((res) => {
    console.log(res) //{ paymentIds: [ {paymentId : "2980732" }, {paymentId : "2980731" } ]})
 */
  addPaymentToOrder (args) {
    let paymentInstruction = {
      billing_address_id: (args.billingAddressId || '').toString(),
      piAmount: (args.orderGrandTotal || '').toString(),
      payMethodId: CREDIT_CARDS_PAYMETHODID[args.cardType],
      cc_brand: args.cardType,
      account: (args.cardNumber || '').toString(),
      expire_month: (args.monthExpire || '').toString(), // PLCC doesn't require exp
      expire_year: (args.yearExpire || '').toString(), // PLCC doesn't require exp
      isDefault: (!!args.setAsDefault).toString()
    };

    let header = {
      isRest: 'true',
      identifier: 'true',
      savePayment: (args.saveToAccount) ? 'true' : 'false', // save to account for registered users
      nickName: args.nickName || ('Billing_' + this.apiHelper.configOptions.storeId + '_' + (new Date()).getTime().toString())
    };

    if (args.onFileCardId) {
      paymentInstruction.creditCardId = (args.onFileCardId || '').toString();
    }

    if (args.cvv) {
      paymentInstruction.cc_cvc = (args.cvv || '').toString(); // PLCC doesn't require exp
    }

    let payload = {
      header: header,
      body: {
        paymentInstruction: [paymentInstruction]
      },
      webService: endpoints.addPaymentInstruction
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return {
        paymentIds: res.body.paymentInstruction
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  addGiftCardPaymentToOrder (args) {
    let paymentInstruction = {
      billing_address_id: (args.billingAddressId || '').toString(),
      piAmount: (args.orderGrandTotal || '').toString(),
      payMethodId: 'GiftCard',
      cc_brand: 'GC',
      account: (args.cardNumber || '').toString(),
      account_pin: (args.cardPin || '').toString(),
      balance: args.balance
    };

    let header = {
      isRest: 'true',
      identifier: 'true',
      savePayment: (args.saveToAccount) ? 'true' : 'false', // save to account for registered users
      nickName: args.nickName || ('Billing_' + this.apiHelper.configOptions.storeId + '_' + (new Date()).getTime().toString())
    };

    if (args.creditCardId) {
      paymentInstruction.creditCardId = (args.creditCardId || '').toString();
    }

    let payload = {
      header: header,
      body: {
        paymentInstruction: [paymentInstruction]
      },
      webService: endpoints.addPaymentInstruction
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return {
        paymentIds: res.body.paymentInstruction
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

/**
 * @method updatePaymentOnOrder
 * @summary This API is used to update a payment method on the users order.
 * @see MuleSoft Doc:
 * @param {String} args.billingAddressId - The id of the address you would like to add to this payment method
 * @param {String} args.monthExpire - The month your credit card expires
 * @param {String} args.yearExpire - The year your card expires
 * @param {String} args.orderGrandTotal - This should be the grand total of the order.
 * @param {String} args.cardType - The credit card brand
 * @param {String} args.cvv - The cvv
 * @param {String} args.account - The number on the card
 * @param {String} args.paymentId - The ID of the payment to be updated
 * @see https://childrensplace.atlassian.net/wiki/display/DT/API+Specification+Documentation?preview=/44072969/66494757/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_updatePaymentInstruction_v5.docx
 * @see Related Jira Ticket:
 * @see https://childrensplace.atlassian.net/browse/DT-2159
 * @see https://childrensplace.atlassian.net/browse/DT-9775
 */
  updatePaymentOnOrder (args) {
    let payload = {
      header: {
        savePayment: (args.saveToAccount) ? 'true' : 'false'
      },
      body: {
        prescreen: true, // as per backend, DT-19753 & DT-19757, we are to pass this so they can run pre-screen function
        paymentInstruction: [{
          expire_month: args.monthExpire ? args.monthExpire.toString() : '',
          piAmount: args.orderGrandTotal ? args.orderGrandTotal.toString() : '',
          payMethodId: CREDIT_CARDS_PAYMETHODID[args.cardType],
          cc_brand: args.cardType,
          expire_year: args.yearExpire ? args.yearExpire.toString() : '',
          account: args.cardNumber,
          piId: args.paymentId,
          cc_cvc: args.cvv,
          billing_address_id: args.billingAddressId,
          isDefault: (!!args.setAsDefault).toString()
        }]
      },
      webService: endpoints.updatePaymentInstruction
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return { paymentId: res.body.paymentInstruction[0].piId };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

/**
 * @method getPaymentsAppliedToOrder
 * @summary This will return all the payment cards the user has applied to the current order, not saved to their account. Likewise this will return all address associated to the order.
 * @see MuleSoft Doc:
 * @see https://childrensplace.atlassian.net/wiki/display/DT/API+Specification+Documentation?preview=/44072969/50233493/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_getUsablePaymentInformation_v4.docx
 * @return {Object[]} This will resolve with all the payment cards the user has on their order, and their addresses. Likewise on error you will get an object with the returned error code.
 * @return Please see below for structure
 * @example getPaymentsAppliedToOrder().then((res) => {
 [
    {
        "addressId": "1357743",
        "firstName": "Michael",
        "lastName": "Citro",
        "addressLine1": "",
        "addressLine2": "",
        "city": "",
        "state": "",
        "zipCode": "07047",
        "country": "US",
        "email": "DEVOPS1@GMAIL.COM",
        "phone": "2012336701",
        "isSavedToAccount": true,
        "paymentInformation": {
            "expire_month": "9",
            "account_pin": "0546",
            "cc_brand": "GC",
            "payment_method": "GiftCard",
            "billing_address_id": "1357743",
            "balance": "500.00",
            "account": "***************2624",
            "expire_year": "2020"
        }
    },
    {
        "addressId": "1357743",
        "firstName": "Michael",
        "lastName": "Citro",
        "addressLine1": "",
        "addressLine2": "",
        "city": "",
        "state": "",
        "zipCode": "07047",
        "country": "US",
        "email": "DEVOPS1@GMAIL.COM",
        "phone": "2012336701",
        "isSavedToAccount": true,
        "paymentInformation": {
            "expire_month": "9",
            "account_pin": "0546",
            "cc_brand": "GC",
            "payment_method": "GiftCard",
            "billing_address_id": "1357743",
            "balance": "500.00",
            "account": "***************2624",
            "expire_year": "2020"
        }
    },
    {
        "addressId": "1357743",
        "firstName": "Michael",
        "lastName": "Citro",
        "addressLine1": "",
        "addressLine2": "",
        "city": "",
        "state": "",
        "zipCode": "07047",
        "country": "US",
        "email": "DEVOPS1@GMAIL.COM",
        "phone": "2012336701",
        "isSavedToAccount": true,
        "paymentInformation": {
            "expire_month": "9",
            "account_pin": "0546",
            "cc_brand": "GC",
            "payment_method": "GiftCard",
            "billing_address_id": "1357743",
            "balance": "500.00",
            "account": "***************2624",
            "expire_year": "2020"
        }
    },
    {
        "addressId": "1357743",
        "firstName": "Michael",
        "lastName": "Citro",
        "addressLine1": "",
        "addressLine2": "",
        "city": "",
        "state": "",
        "zipCode": "07047",
        "country": "US",
        "email": "DEVOPS1@GMAIL.COM",
        "phone": "2012336701",
        "isSavedToAccount": true,
        "paymentInformation": {
            "expire_month": "9",
            "account_pin": "0546",
            "cc_brand": "GC",
            "billing_address_id": "1357743",
            "payment_method": "GiftCard",
            "balance": "500.00",
            "expire_year": "2020",
            "account": "***************2624"
        }
    },
    {
        "addressId": "1357743",
        "firstName": "Michael",
        "lastName": "Citro",
        "addressLine1": "",
        "addressLine2": "",
        "city": "",
        "state": "",
        "zipCode": "07047",
        "country": "US",
        "email": "DEVOPS1@GMAIL.COM",
        "phone": "2012336701",
        "isSavedToAccount": true,
        "paymentInformation": {
            "expire_month": "9",
            "account_pin": "0546",
            "cc_brand": "GC",
            "billing_address_id": "1357743",
            "payment_method": "GiftCard",
            "balance": "500.00",
            "expire_year": "2020",
            "account": "***************2624"
        }
    },
    {
        "addressId": "1357743",
        "firstName": "Michael",
        "lastName": "Citro",
        "addressLine1": "",
        "addressLine2": "",
        "city": "",
        "state": "",
        "zipCode": "07047",
        "country": "US",
        "email": "DEVOPS1@GMAIL.COM",
        "phone": "2012336701",
        "isSavedToAccount": true,
        "paymentInformation": {
            "expire_month": "10",
            "billto_zipcode": "07047",
            "cc_brand": "VISA",
            "billto_country": "USA",
            "payment_method": "VISA",
            "billto_address1": "707 liberty ave",
            "billing_address_id": "1357743",
            "account": "***********20026",
            "expire_year": "2020",
            "billto_firstname": "Michael",
            "billto_lastname": "Citro"
        }
    }
]

})
 */
  getPaymentsAppliedToOrder () {
    let payload = {
      webService: endpoints.getUserPaymentInformation
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      return Object.keys(res.body.paymentInstruction).map((index) => {
        let cardInfo = {};

        res.body.paymentInstruction[index].protocolData.map((card) => {
          cardInfo[card.name] = card.value;
        });

        return {
          addressId: res.body.paymentInstruction[index].billing_address_id,
          firstName: res.body.paymentInstruction[index].firstName,
          lastName: res.body.paymentInstruction[index].lastName,
          addressLine1: res.body.paymentInstruction[index].addressLine[0],
          addressLine2: res.body.paymentInstruction[index].addressLine[1],
          city: res.body.paymentInstruction[index].city,
          state: res.body.paymentInstruction[index].state,
          zipCode: (res.body.paymentInstruction[index].postalCode || '').trim(),
          country: res.body.paymentInstruction[index].country,
          email: res.body.paymentInstruction[index].email1,
          phone: res.body.paymentInstruction[index].phone1,
          isSavedToAccount: parseBoolean(res.body.paymentInstruction[index].phone1Publish),
          paymentInformation: cardInfo
        };
      });
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

/**
 * @method updateAirMilesInfo
 * @summary This API is used to update our Canadian user's air miles
 * @param {String} orderId - This is the order id of the order you want to get credit for
 * @param {String} promoId - This is the promo that the user enters
 * @param {String} cardNumber - This is the card number that the user enters
 * @see MuleSoft Doc:
 * @see https://childrensplace.atlassian.net/wiki/display/DT/API+Specification+Documentation?preview=/44072969/64126977/TCP%20-%20API%20Design%20Specification%20-%20Category-BOPIS_UpdateAirMilesInfo_v2.docx#suk=ff80808154b7fc630154bb409a300003
 * @return {Object} This will resolve with and object holding a success flag or an error code
 * @return success - true if the shipping was updated
 * @example updateAirMilesInfo({
    "orderId":"269501",
    "promoId":"12345",
    "cardNumber":"5780971101000203"
   }).then((res) => {
    console.log(res) //{ success: true }
 */
  updateAirMilesInfo (orderId, promoId, cardNumber) {
    let payload = {
      body: {
        orderId: orderId.toString(),
        promoId: promoId || '',
        cardNumber: cardNumber || ''
      },
      webService: endpoints.updateAirMilesInfo
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      } else {
        return { success: true };
      }
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  startExpressCheckout (verifyPrescreen) {
    let payload = {
      header: {
        prescreen: verifyPrescreen
      },
      webService: endpoints.startExpressCheckout
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      let rtpsData = extractRtpsEligibleAndCode(res);

      return {
        orderId: res.body.orderId,
        plccEligible: rtpsData.plccEligible,
        prescreenCode: rtpsData.prescreenCode
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  getInternationCheckoutSettings () {
    let payload = {
      body: {
        storeId: this.apiHelper.configOptions.storeId,
        langId: this.apiHelper.configOptions.langId,
        catalogId: this.apiHelper.configOptions.catalogId,
        orderId: '.',
        URL: 'LogonForm'
      },
      webService: endpoints.internationalCheckoutSettings
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      return {
        checkoutUrl: res.body.completeURL
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }
}

function extractRtpsEligibleAndCode (apiResponse) {
  let response = apiResponse.body.processOLPSResponse;
  let prescreenResponse = (response && response.response) || {};

  return {
    plccEligible: prescreenResponse.returnCode === '01',
    prescreenCode: prescreenResponse.prescreenId || ''
  };
}
