/**
@module Cart Service Abstractors
*/
import {COUPON_STATUS, COUPON_REDEMPTION_TYPE} from 'reduxStore/storeReducersAndActions/couponsAndPromos/couponsAndPromos';
import {endpoints} from './endpoints.js';
import {parseDate} from 'util/parseDate.js';
import {ServiceResponseError} from 'service/ServiceResponseError';
import {flatCurrencyToCents, toTimeString, capitalize, parseBoolean} from '../apiUtil';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {sanitizeEntity} from 'service/apiUtil.js';
import {AVAILABILITY} from 'reduxStore/storeReducersAndActions/cart/cart.js';

const EMPTY_OBJECT = Object.create(null);

let previous = null;
export function getCartAbstractor (apiHelper) {
  if (!previous || previous.apiHelper !== apiHelper) {
    previous = new CartDynamicAbstractor(apiHelper);
  }
  return previous;
}

class CartDynamicAbstractor {
  constructor (apiHelper) {
    this.apiHelper = apiHelper;

    // create this-bound varsions of all methods of this class
    bindAllClassMethodsToThis(this);
  }

  getCurrentOrderSummary (isTaxCalculation) {
    let payload = {
      header: {
        pageName: 'orderSummary',
        locStore: 'False',
        calc: !!isTaxCalculation
      },
      webService: endpoints.getOrderDetails
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return {totalItems: res.body.CartCount || 0, orderId: res.body.ParentOrderId || ''};
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function getCurrentOrder
   * @summary This API is used to get the users order summary. This will return a list of items in the cart as well. Note that all price values are returned in cents.
   * @param {String=} orderId - If you pass an order Id you will get all information on that order. If you do not pass this value it will defult to the current users cart as the order.
   * @param {Boolean} excludeCartItems - .We are restricting the execution of pulling the item cart details on Pickup screen/Shipping and Billing.This is required only for ledger,full cart and review page
   * @return {Integer} totalItems - This will be the total items in the cart that the user has.
   * @return {Integer} savingsTotal - This is the total discounts applied to the order.
   * @return {Integer} shippingTotal - This is the shipping costs for this order.
   * @return {Integer} grandTotal - This is the total cost of the order with applied discounts and tax. This is what the user will be charged.
   * @return {Integer} subTotal - This is the total cost of the order with applied discounts.
   * @return {Integer} estimatedRewards - This will be the amount of rewards points the user will earn on this order.
   * @return {String} productInfo.generalProductId - this is the id used to pass into get getSwatchesAndSize to get all other colors for this product
   * @return {String} productInfo.skuId - This is the id of the product that is used to add an item to the cart, this is a color/size combo
   * @return {String} productInfo.name - This is the item name to be displayed
   * @return {String} productInfo.imagePath - This is the path to the image to be displayed
   * @return {String} productInfo.upc - This is the items UPC to be displayed
   * @return {String} productInfo.size - This is the size of the item
   * @return {String} productInfo.fit - This is the fit of the item
   * @return {String} productInfo.color.name - This is the name of the color to be displayed
   * @return {String} productInfo.color.imagePath - This is the swatch img path
   * @return {Integer} itemInfo.quantity - The quantity of this item that the user has
   * @return {String} itemInfo.itemId - This it the order item id that needs to be used to remove the item from the cart
   * @return {Integer} itemInfo.listPrice - This is the price of the item
   * @return {Integer} itemInfo.offerPrice - This is the price of the item after applied discounts, it will be the same as listPrice if there is no discount applied
   * @return {Boolean} miscInfo.isOnlineOnly - This flag will tell you if this is online only or not
   * @return {Boolean} miscInfo.clearanceItem - This flag will tell you if this is a clearance item or not
   * @return {Integer} miscInfo.onlineInventoryAvailable - This is the amount of inventory available for this item online
   * @return {String} miscInfo.store - This is the store if there is a BOPIS item that the item will be shipped to
   * @see MuleSoft Doc Below:
   * @see https://childrensplace.atlassian.net/wiki/display/DT/API+Specification+Documentation?preview=/44072969/66510370/TCP%20-%20API%20Design%20Specification%20-%20Category-Cart_getOrderDetails_v7.docx
   * @see Related Jira Tickets
   * @see https://childrensplace.atlassian.net/browse/DT-1789
   * @see https://childrensplace.atlassian.net/browse/DT-5416
   * @see https://childrensplace.atlassian.net/browse/DT-5413
   * @example getCurrentOrder().then((res) => {
        console.log(res);
        {
            "totalItems": 7,
            "savingsTotal": 0,
            "shippingTotal": 0,
            "grandTotal": 13965,
            "estimatedRewards": "140",
            "orderItems": [
                {
                    "productInfo": {
                        "generalProductId": "293413",
                        "skuId": 777520,
                        "name": "denim ballet flat",
                        "imagePath": "http://int3.childrensplace.com/shop/us/p/denim-ballet-flat-2009560-DB",
                        "upc": "00889705310573",
                        "size": "TODDLER 4",
                        "color": {
                            "name": "DENIM",
                            "imagePath": null
                        }
                    },
                    "itemInfo": {
                        "quantity": 6,
                        "itemId": 8007610003,
                        "listPrice": 1995,
                        "offerPrice": 1995
                    },
                    "miscInfo": {
                        "isOnlineOnly": false,
                        "clearanceItem": false,
                        "onlineInventoryAvailable": 149,
                        "store": null
                    }
                },
                {
                    "productInfo": {
                        "generalProductId": "62159",
                        "skuId": 773321,
                        "name": "chino pants",
                        "imagePath": "http://int3.childrensplace.com/shop/us/p/chino-pants-1101084-SG",
                        "upc": "00889705252798",
                        "size": "7S",
                        "fit": "slim",
                        "color": {
                            "name": "SANDWASH",
                            "imagePath": null
                        }
                    },
                    "itemInfo": {
                        "quantity": 1,
                        "itemId": 8007805002,
                        "listPrice": 1795,
                        "offerPrice": 1995
                    },
                    "miscInfo": {
                        "isOnlineOnly": false,
                        "clearanceItem": false,
                        "onlineInventoryAvailable": 1082,
                        "store": null
                    }
                }
            ]
        }

          // Product Sold Out: we do not have a flag for this yet.
          // Color Sold Out = inventoryFlagUSStore = "0" || " ";
          // Size for a color sold out = inventoryAvailable = 0
  })
   */
  getCurrentOrder (orderId, calcsEnabled, excludeCartItems, imageGenerator) {
    let payload = {
      header: {
        orderId,
        pageName: excludeCartItems ? 'excludeCartItems' : 'fullOrderInfo', // If this value is not set then you will get partial order information
        locStore: 'True', // this flag is so that mulesoft can run other services on their side to get BOPIS store info per item
        'X-Cookie': this.apiHelper.configOptions.cookie,
        calc: !!calcsEnabled // new flag (4/30) that enables a BE internal mechanism to compute calcs and taxes
      },
      webService: endpoints.getOrderDetails
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      let orderDetailsResponse = res.body.orderDetailsResponse || res.body;

      let pickUpContact = {};
      let pickUpAlternative = {};
      let bopis = orderDetailsResponse.mixOrderDetails && orderDetailsResponse.mixOrderDetails.data &&
        orderDetailsResponse.mixOrderDetails.data.find((store) => store.orderType === 'BOPIS');
      if (bopis) {
        let address = bopis.shippingAddressDetails || {};
        pickUpContact = {
          firstName: address.firstName,
          lastName: address.lastName,
          emailAddress: address.email1,
          phoneNumber: address.phone1
        };
        let pickUpAltName = address.altName || '';
        pickUpAlternative = {
          firstName: pickUpAltName.substr(0, pickUpAltName.indexOf(' ')),
          lastName: pickUpAltName.substr(pickUpAltName.indexOf(' ') + 1).trim(),
          emailAddress: address.altEmail
        };
      }

      let shipping = {};
      let shippingTotal = undefined;    // eslint-disable-line no-undef-init
      if (orderDetailsResponse.mixOrderDetails && orderDetailsResponse.mixOrderDetails.data) {
        let orderShippingElement = orderDetailsResponse.mixOrderDetails.data.find(
          (element) => element.orderType === 'ECOM'
        );
        if (orderShippingElement && orderShippingElement.shippingAddressDetails) {
          let orderShippingInfo = orderShippingElement.shippingAddressDetails;
          if (orderShippingInfo.addressId) {
            // orderDetailsResponse.finalShippingCharge may contain garbage that should be ignored if we have no shipping addressId
            shippingTotal = flatCurrencyToCents(orderDetailsResponse.finalShippingCharge);
          }
          shipping = {
            method: {
              shippingMethodId: orderDetailsResponse.shipModeId
            },
            address: {
              firstName: orderShippingInfo.firstName,
              lastName: orderShippingInfo.lastName,
              addressLine1: orderShippingInfo.addressLine1 || orderShippingInfo.address,
              addressLine2: orderShippingInfo.addressLine2,
              city: orderShippingInfo.city,
              state: orderShippingInfo.state,
              zipCode: (orderShippingInfo.zipCode || '').trim(),
              country: orderShippingInfo.country
            },
            onFileAddressKey: orderShippingInfo.addressNickName,
            onFileAddressId: orderShippingInfo.addressId && orderShippingInfo.addressId.toString(),
            emailAddress: orderShippingInfo.email1,
            phoneNumber: orderShippingInfo.phone1
          };
        }
      }
      shipping.emailSignup = orderDetailsResponse.mixOrderDetails.marketingPromoBox === '1';
      let giftWrapItem = orderDetailsResponse.orderItems.find((item) => item.giftOptions);
      let giftWrap = !giftWrapItem ? {} : {
        optionId: giftWrapItem.itemCatentryId.toString(),
        message: giftWrapItem.giftOptionsMessage || ''
      };

      let stateTax = -1;
      if (orderDetailsResponse.salesTax && orderDetailsResponse.salesTax.salesTax) {
        for (let country in orderDetailsResponse.salesTax.salesTax) {
          for (let state in orderDetailsResponse.salesTax.salesTax[country]) {
            if (stateTax === -1) {
              stateTax = 0;
            }

            stateTax += orderDetailsResponse.salesTax.salesTax[country][state];
          }
        }
      }

      let usersOrder = {
        orderId: orderDetailsResponse.parentOrderId,
        totalItems: excludeCartItems ? null : 0,
        appliedGiftCards: [],
        giftWrappingTotal: 0,
        savingsTotal: Math.abs(flatCurrencyToCents(orderDetailsResponse.orderDiscountAmount) || 0),
        couponsTotal: 0,
        giftCardsTotal: flatCurrencyToCents(orderDetailsResponse.totalGiftCardAmount || 0),
        shippingTotal: shippingTotal,
        totalTax: (stateTax > -1) ? flatCurrencyToCents(orderDetailsResponse.shippingTax) + stateTax : undefined,
        grandTotal: flatCurrencyToCents(orderDetailsResponse.grandTotal),
        subTotal: flatCurrencyToCents(orderDetailsResponse.orderSubTotalBeforeDiscount),
        subTotalWithDiscounts: flatCurrencyToCents(orderDetailsResponse.orderSubTotalDiscount || 0), // this is designed to be engaged from the mini-cart only.
        // subTotalWithDiscounts: flatCurrencyToCents(orderDetailsResponse.orderSubTotal), // to use in condensed ledger, as per DT-18757, this one might be deprecated.
        estimatedRewards: Math.round(orderDetailsResponse.userPoints),
        estimatedAirMiles: 0, // NOT IN SERVICE RESPONSE - - - Math.round(orderDetailsResponse.airMiles || 0),
        rewardsToBeEarned: parseInt(orderDetailsResponse.valueOfEarnedPcCoupons) || 0, // FIXME: this should have been part of another namespace, however it had to be done.
        checkout: {
          pickUpContact: pickUpContact,
          pickUpAlternative: pickUpAlternative,
          shipping: shipping,
          billing: {},
          giftWrap: giftWrap
        },
        orderItems: []
      };

      if (orderDetailsResponse.airMiles) {
        usersOrder.airmiles = {
          accountNumber: orderDetailsResponse.airMiles.airMilesAccount,
          promoId: orderDetailsResponse.airMiles.airMilesDeal
        };
      }

      if (orderDetailsResponse.orderLevelPromos && orderDetailsResponse.orderLevelPromos.explicit) {
        for (let item of orderDetailsResponse.orderLevelPromos.explicit) {
          for (let promoCode in item) {
            usersOrder.couponsTotal += Math.abs(flatCurrencyToCents(item[promoCode].price));
          }
        }
      }

      usersOrder.savingsTotal -= usersOrder.couponsTotal;

      // UGLY: I guess rounding causes this to be non zero in some cases
      // (or backend sending incorrect numbers)
      if (usersOrder.savingsTotal < 0) {
        usersOrder.savingsTotal = 0;
      }

      /*
      if (orderDetailsResponse.mixOrderDetails && orderDetailsResponse.mixOrderDetails.data &&
        orderDetailsResponse.mixOrderDetails.data.find((store) => store.orderType !== 'ECOM')) {
        usersOrder.totalsByFullfillmentCenterMap = orderDetailsResponse.mixOrderDetails.data.map((store, index) => {
          let address = store.shippingAddressDetails;
          let orderLink = '://' + this.apiHelper._configOptions.domain + '/shop/TCPOrderLookUp?catalogId=' + this.apiHelper._configOptions.catalogId + '&langId=' + this.apiHelper._configOptions.langId + '&storeId=' + this.apiHelper._configOptions.storeId + '&shipmentTypeId=1&forSearch=1&orderId=' + store.subOrderId + '&emailId=' + address.email1 || '';
          let isBopis = store.orderType === 'BOPIS';
          let storeDetails = (isBopis && res.body.storeInfoResponse && res.body.storeInfoResponse.PhysicalStore) ? res.body.storeInfoResponse.PhysicalStore.find((store) => store.uniqueID === address.stLocId) : null;

          let storeHours = isBopis ? JSON.parse(storeDetails.Attribute[0].displayValue) : null;
          let todayOpeningTime = isBopis ? toTimeString(parseDate(storeHours.storehours[0].availability[0].from)) : null;
          let todayClosingTime = isBopis ? toTimeString(parseDate(storeHours.storehours[0].availability[0].to)) : null;
          let tomorrowOpeningTime = isBopis ? toTimeString(parseDate(storeHours.storehours[1].availability[0].from)) : null;
          let tomorrowClosingTime = isBopis ? toTimeString(parseDate(storeHours.storehours[1].availability[0].to)) : null;

          return {
            name: store.orderType === 'ECOM'
            ? 'Online' // (address.firstName ? address.firstName + ' ' + address.lastName : 'Online Shipping')
            : ((res.body.storeInfoResponse && res.body.storeInfoResponse.PhysicalStore)
              ? capitalize(storeDetails.Description[0].displayStoreName)
              : '#MISSING STORE NAME'),
            address: {
              addressLine1: address.address,
              addressLine2: '',
              city: address.city,
              state: address.state,
              zipCode: (address.zipCode || '').trim(),
              country: address.country
            },

            phoneNumber: isBopis ? (store.telephone1 || '').trim() : null,
            todayOpenRange: todayOpeningTime + ' - ' + todayClosingTime,
            tomorrowOpenRange: tomorrowOpeningTime + ' - ' + tomorrowClosingTime,

            productsCount: store.itemsCount,
            orderDate: new Date(),              // FIXME: not available in response
            orderNumber: store.subOrderId,
            orderLink: orderLink,
            amount: parseFloat(store.piAmount)
          };
        });
      }
      */

      if (orderDetailsResponse.giftCardDetails) {
        for (let giftCard of orderDetailsResponse.giftCardDetails) {
          usersOrder.appliedGiftCards.push({
            id: giftCard.piId,
            onFileCardId: giftCard.creditCardId.toString(),
            amountApplied: giftCard.giftAmount,
            endingNumbers: giftCard.giftCardNumber.substr(-4),
            remainingBalance: giftCard.remainingBalance
          });
        }
      }

      // DT-32443
      // Not sure why payment information is in mixOrderPaymentDetails AND paymentsList...
      // Backend will clear out mixOrderPaymentDetails array if the payment method is inactive in the DB
      // If mixOrderPaymentDetails is empty we should not save billing details and show error message
      let mixOrderPaymentDetails = orderDetailsResponse.mixOrderPaymentDetails;
      if (mixOrderPaymentDetails && mixOrderPaymentDetails.length > 0) {
        for (let payment of orderDetailsResponse.paymentsList) {
          if (payment.cardType !== 'GC') {
            // CC or PayPal
            let billingAddress = payment.billingAddressDetails;
            let billingFirstName = (billingAddress.customerName || '').match(/(\w+)/);
            let billingLastName = (billingAddress.customerName || '').match(/(\w+)$/);

            usersOrder.checkout.billing = {
              paymentMethod: payment.cardType === 'PayPal' ? 'paypal' : 'creditCard',
              onFileCardId: (billingAddress.creditCardId || '').toString(), // credit card id from the card book
              paymentId: payment.piId,
              emailAddress: billingAddress.email,
              phoneNumber: billingAddress.phone,

              address: {
                onFileAddressKey: billingAddress.nickName,
                onFileAddressId: billingAddress.addressId && billingAddress.addressId.toString(),
                sameAsShipping: billingAddress.nickName === shipping.onFileAddressKey,
                firstName: billingFirstName ? billingFirstName[0] : '',
                lastName: billingLastName ? billingLastName[0] : '',
                addressLine1: billingAddress.addressLine1 || billingAddress.address,
                addressLine2: billingAddress.addressLine2,
                city: billingAddress.city,
                state: billingAddress.state,
                zipCode: (billingAddress.zipCode || '').trim(),
                country: billingAddress.country
              },

              billing: {
                cardNumber: payment.maskedCardNumber,
                cardType: payment.cardType === 'PayPal' ? 'paypal' : (payment.cardType || '').toUpperCase(),
                expMonth: parseInt(payment.cardExpirationMonth),
                expYear: parseInt(payment.cardExpirationYear),
                cvv: '',
                isExpirationRequired: payment.cardType !== 'PLACE CARD' && payment.cardType !== 'PayPal',
                isCVVRequired: payment.cardType !== 'PLACE CARD' && payment.cardType !== 'PayPal'
              }
            };
          }
        }
      }

      for (let item of orderDetailsResponse.orderItems) {
        let sizeAndFit = item.productInfo.itemsAttributes[item.itemCatentryId.toString()];
        let isBopis = item.orderItemType === 'BOPIS' && item.stLocId;
        let store = (item.orderItemType === 'BOPIS' && item.stLocId && res.body.storeInfoResponse && res.body.storeInfoResponse.PhysicalStore) ? res.body.storeInfoResponse.PhysicalStore.find((store) => store.uniqueID === item.stLocId) : null;

        if (!item.giftOptions) {
          usersOrder.totalItems += parseInt(item.qty);

          let storeHours = isBopis ? JSON.parse(store.Attribute[0].displayValue) : null;
          let todayOpeningTime = isBopis ? toTimeString(parseDate(storeHours.storehours[0].availability[0].from)) : null;
          let todayClosingTime = isBopis ? toTimeString(parseDate(storeHours.storehours[0].availability[0].to)) : null;
          let tomorrowOpeningTime = isBopis ? toTimeString(parseDate(storeHours.storehours[1].availability[0].from)) : null;
          let tomorrowClosingTime = isBopis ? toTimeString(parseDate(storeHours.storehours[1].availability[0].to)) : null;

          let isGiftCard = item.giftItem;
          usersOrder.orderItems.push({
            productInfo: {
              generalProductId: sizeAndFit ? item.productId : item.itemCatentryId.toString(), // when there are no sizeAndFit that means this item is a gift card, meaning that we should pull the items itemCatentryId.
              skuId: item.itemCatentryId.toString(),
              name: sanitizeEntity(item.productInfo.productName),
              imagePath: imageGenerator(item.productInfo.productPartNumber).productImages[500],
              upc: item.itemPartNumber,
              size: sizeAndFit ? sizeAndFit.TCPSize : item.itemUnitDstPrice, // giftCard Size is its price
              fit: sizeAndFit ? sizeAndFit.TCPFit : null, // no fit for gift cards
              pdpUrl: item.productUrl.replace(/&amp;/g, '&'),
              color: {
                name: item.productInfo.productColor ? item.productInfo.productColor : item.productInfo.productName,
                imagePath: imageGenerator(item.productInfo.productThumbnail).colorSwatch
              },
              isGiftCard: isGiftCard,
              colorFitSizeDisplayNames: isGiftCard ? {color: 'Design', size: 'Value'} : EMPTY_OBJECT
            },
            itemInfo: {
              quantity: parseInt(item.qty),
              itemId: item.orderItemId.toString(),
              // This code is misleading - itemPrice and itemDstPrice are not equal to list price/offer price
              // Backend returns the same value for both itemPrice and itemDstPrice UNLESS an explicit promotion is applied
              // Enhancement needed - Backend should return the actual prices and frontend should determine which values to display
              listPrice: flatCurrencyToCents(item.itemPrice),
              offerPrice: flatCurrencyToCents(item.itemDstPrice)
            },
            miscInfo: {
              clearanceItem: item.productInfo.itemTCPProductInd === 'Clearance',
              isOnlineOnly: (this.apiHelper.configOptions.isUSStore ? (Boolean(parseInt(item.productInfo.webOnlyFlagUSStore))) : (Boolean(parseInt(item.productInfo.webOnlyFlagCanadaStore)))),
              isBopisEligible: !parseBoolean(orderDetailsResponse.bopisIntlField),
              // onlineInventoryAvailable: item.inventoryAvail,

              // TODO: cleanup structure
              store: store ? capitalize(store.Description[0].displayStoreName) : null,
              storeId: (item.orderItemType === 'BOPIS' && item.stLocId) ? item.stLocId : null,
              storeAddress: store ? {
                addressLine1: capitalize(store.addressLine[0]),
                addressLine2: store.addressLine[1],
                city: capitalize(store.city),
                state: store.stateOrProvinceName,
                zipCode: store.postalCode.trim()
              } : null,
              storePhoneNumber: isBopis ? (store.telephone1 || '').trim() : null,
              storeTodayOpenRange: isBopis ? todayOpeningTime + ' - ' + todayClosingTime : null,
              storeTomorrowOpenRange: isBopis ? tomorrowOpeningTime + ' - ' + tomorrowClosingTime : null,

              availability: deriveItemAvailability(orderDetailsResponse, item),
              vendorColorDisplayId: item.productInfo && item.productInfo.productPartNumber
            }
          });
        }
      }

      if (orderDetailsResponse.giftWrapItem && orderDetailsResponse.giftWrapItem.length) {
        usersOrder.checkout.giftWrap = {
          optionId: orderDetailsResponse.giftWrapItem[0].catentryId.toString(),
          message: orderDetailsResponse.giftWrapItem[0].giftOptionsMessage || ''
        };
        usersOrder.giftWrappingTotal = flatCurrencyToCents(orderDetailsResponse.giftWrapItem[0].totalPrice);
        usersOrder.subTotal -= usersOrder.giftWrappingTotal;
      }

      usersOrder.uiFlags = {
        isPaypalEnabled: parseBoolean(orderDetailsResponse.payPalAllowed)
      };

      return usersOrder;
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function addItem
   * @summary This API is used to add an item to the users cart given an items catalog entry id and the quantity
   * @param {String} skuId - The unique id of a SKU. skuId is the value of the size for a particular style/color combo.
   * @param {String} quantity - The quantity count of the item to be added to the cart
   * @return {Object} This will resolve holding an object with the orderItemId of the newly added item, which can be used to remove the item from the cart. Likewise on promise rejection you will get an object with the returned error code.
   * @return orderItemId: This is the id of the item in your cart. This is needed for many things such as remove.
   * @see getItemsAndSummary, removeItemFromCart
   * @see MuleSoft Doc Below:
   * @see https://childrensplace.atlassian.net/wiki/pages/viewpage.action?spaceKey=DT&title=API+Specification+Documentation&preview=/44072969/50233507/TCP%20-%20API%20Design%20Specification%20-%20Category-CART_addOrderItem_v2.docx
   * @example addItem("7308273","1").then((res) => {
        console.log(res) // { orderItemId: "802374863" }
  })
   */
  addItem (skuId, quantity) {
    let payload = {
      body: {
        orderId: '.',
        orderItem: [{
          productId: skuId,
          quantity
        }],
        x_calculateOrder: '0',
        x_inventoryValidation: 'true'
      },
      webService: endpoints.addOrderItem
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return {
        orderItemId: res.body.orderItem[0].orderItemId
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function updateItem
   * @summary This Will Run The addItem and on success of that will run removeItem. Please refer to them for their respective Documentation
   * @param {String} orderItemId - The id(s) of the item in your cart, see getCurrentOrder.
   * @param {String} skuId - The unique id of a SKU. skuId is the value of the size for a particular style/color combo.
   * @param {Number} quantity - the quantity to be added to the cart
   * @return This will return the cartItemId of the newly added item
   */
  updateItem (orderItemId, skuId, quantity = 1) {
    let payload = {
      body: {
        orderItem: [
          {
            orderItemId: orderItemId,
            xitem_catEntryId: skuId,
            quantity: quantity.toString()
          }
        ]
      },
      webService: endpoints.updateOrderItem
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return {
        orderItemId: res.body.orderItem[0].orderItemId
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function removeItem
   * @summary This API is used to remove and item from the cart given its orderItemId.
   * @param {String|Array} orderItemId The id(s) of the item in your cart, see getItemsAndSummary. This can be a single string or an array of strings. Each String is an orderItemId.
   * @see getItemsAndSummary, addItem.
   * @return {Object} This will resolve with an object holding the orderid in which the item was removed from. Likewise on promise rejection you will get an object with the returned error code.
   * @return orderId: This is the id of the order that the item was removed from. This can be used to many APIs such as checkout.
   * @see MuleSoft Doc Below:
   * @see https://childrensplace.atlassian.net/wiki/pages/viewpage.action?spaceKey=DT&title=API+Specification+Documentation&preview=/44072969/50233505/TCP%20-%20API%20Design%20Specification%20-%20Category-CART_deleteOrderItem_v2.docx
   * @example removeItem("87308273").then((res) => {
        console.log(res) // { orderId: "8020348630" }
  });

  removeItem(["87308273","87308272","87308271","87308270"]).then((res) => {
      console.log(res) // { orderId: "8020348630" }
  })
   */
  removeItem (orderItemId) {
    let orderItems = [];
    if (typeof orderItemId === 'string') {
      orderItems.push({
        orderItemId,
        quantity: '0'
      });
    } else {
      orderItems = Object.keys(orderItemId).map((index) => {
        return {
          orderItemId: orderItemId[index],
          quantity: '0'
        };
      });
    }
    let payload = {
      body: {
        orderItem: orderItems
      },
      webService: endpoints.updateMultiSelectItemsToRemove
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return {
        orderId: res.body.orderId
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function updateItemQty
   * @summary This API is used to update the quantity of an item in the cart by taking its orderItemId and an updated quantity
   * @param {String} orderItemId - the unique id of an item, this can be taken from the getItemsAndSummary.
   * @param {String} quantity - The quantity count of the item to be added to the cart.
   * @return {Object} This will resolve with an object holding the orderItemId of the newly updated item, which can be used to remove/undo the item from the cart. Likewise on promise rejection you will get an object with the returned error code.
   * @return orderItemId: This is the id of the item in your cart. This is needed for many things such as remove. so you can use this as the undo parameter.
   * @see getItemsAndSummary
   * @see MuleSoft Doc Below:
   * @see https://childrensplace.atlassian.net/wiki/pages/viewpage.action?spaceKey=DT&title=API+Specification+Documentation&preview=/44072969/50233507/TCP%20-%20API%20Design%20Specification%20-%20Category-CART_addOrderItem_v2.docx
   * @example updateItemQty("87308273",10).then((res) => {
        console.log(res) // { orderItemId: "87308273" }
  })
   */
  updateItemQty (orderItemId, quantity) {
    let payload = {
      body: {
        orderId: '.',
        orderItem: [{
          orderItemId,
          quantity
        }],
        x_calculateOrder: '0',
        x_inventoryValidation: 'true'
      },
      webService: endpoints.addOrderItem
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return {
        orderItemId: res.body.orderItem[0].orderItemId
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function addItemToDefaultWishlist
   * @summary This API is used to add an item to your wishlist.
   * @param {String} skuId - This is the unique id that each products color/size combo has. you can get this from the getItemsAndSummary
   * @param {Integer} quantity - The quantity that should be added to your wishlist
   * @return {Object} This will resolve with an object holding a wishlistItemId, This is the id of the item in your wishlist which is used for other APIs. Likewise on promise rejection you will get an object with the returned error code.
   * @return wishlistItemId: you need this to remove or update the item in your wishlist.
   * @see getUserWishlists, getItemsAndSummary
   * @see MuleSoft Doc Below:
   * @see https://childrensplace.atlassian.net/wiki/pages/viewpage.action?spaceKey=DT&title=API+Specification+Documentation&preview=/44072969/57835523/TCP%20-%20API%20Design%20Specification%20-%20Category-CART_addItemToWishlist_v6.docx
   */
  addItemToDefaultWishlist (skuId, quantity) {
    let payload = {
      header: {
        externalId: ''            // The id of the users's default wishlist is the empty string for this purpose.
      },
      body: {
        item: [
          {
            productId: skuId,
            quantityRequested: quantity + ''
          }
        ]
      },
      webService: endpoints.addOrUpdateWishlist
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      let wishlistItemId;

      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      wishlistItemId = res.body.item[0];

      return wishlistItemId;
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function addBopisItemToCart
   * @summary This API is used to add a Bopis Item to your Cart.
   * @param {String} storeId - unique id identifier to the store in which we are going to pick the item selected from
   * @param {String} skuId - This is the unique id that each products color/size combo has. you can get this from the getItemsAndSummary
   * @param {Integer} quantity - number of items to be added to the cart
   * @return when successful it returns both the orderId and orderItemId.
   */
  addBopisItemToCart (storeId, skuId, quantity) {
    let payload = {
      body: {
        storeLocId: storeId,
        quantity: quantity.toString(),
        catEntryId: skuId,
        isRest: 'false'             // hardcoded value based on Documentation -- meaningless to the client. should have been stored at MulesSoft...
      },
      webService: endpoints.addOrderBopisItem
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return {
        orderItemId: res.body
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function updateBopisItemToCart
   * @summary This API is used to update a Bopis Item in the Cart.
   * @param {String} orderId - unique identifier of the open user's order
   * @param {String} orderItemId - unique identifier of the item in the order
   * @param {String} isItemShipToHome - flags if the item is currently set to be
   *  shipped to home (contrary to picked-up in store)
   * @param {String} storeId - unique identifier to the store in which we are
   *  going to pick the item
   * @param {String} skuId - This is the unique id that each product color/size
   *  combo has. you can get this from the getItemsAndSummary
   * @param {Integer} quantity - number of items to be added to the cart
   * @return when successful it returns the orderItemId.
   */
  updateBopisItemInCart (orderId, orderItemId, isItemShipToHome, storeId, skuId, quantity) {
    let payload = {
      body: {
        orderId: orderId + '',
        orderItem: [{
          orderItemId: orderItemId,
          xitem_catEntryId: skuId,
          quantity: quantity + ''
        }],
        x_storeLocId: storeId,
        x_calculationUsage: '-1,3,-5,-6,-7',
        x_isUpdateDescription: 'true',
        x_orderitemtype: isItemShipToHome ? 'ECOM' : 'BOPIS'
      },
      webService: endpoints.updateOrderBopisItem
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return {
        orderItemId: res.body.orderItem[0].orderItemId
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function addCouponOrPromo
   * @summary This API is used to apply a coupon or promotion to a users order.
   * @param {String} code - The Coupon or Promo to be applied to the order
   * @return {Object} This will resolve with an object holding the code that was added. This code should not be used to apply the removeCouponOrPromo as sometimes backend manipulates this code. Should this fail you may have a number of error codes ie: invalid code, duplicate code used on order. Backend still needs to provide us with such lists { errorCode: "" , errorMessage: ""}
   * @return code: This is the code that was just added to the order.
   * @see removeCouponOrPromo
   * @see MuleSoft Doc Below:
   * @see https://childrensplace.atlassian.net/wiki/pages/viewpage.action?spaceKey=DT&title=API+Specification+Documentation&preview=/44072969/50233539/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_addCoupons_v3.docx
   * @example addCouponOrPromo("Y038HDRIUWOE").then((res) => {
        console.log(res) // { code: "Y038HDRIUWOE" }
  })
   */
  addCouponOrPromo (code) {
    let payload = {
      body: {
        storeId: this.apiHelper.configOptions.storeId,
        langId: this.apiHelper.configOptions.langId,
        catalogId: this.apiHelper.configOptions.catalogId,
        URL: '',
        promoCode: code,
        requesttype: 'ajax',
        fromPage: 'shoppingCartDisplay',
        taskType: 'A'
      },
      webService: endpoints.addCoupons
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return {
        code: res.body.promoCode
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function removeCouponOrPromo
   * @summary This API is used to remove a coupon code from the order.
   * @param {String} code - The Code to be remove from the order. Use the the getItemsAndSummary or another service to get coupons/promos from backend. sometimes the code you entered with the addCouponOrPromo is not the same one you entered, it could have a prefixed '-'.
   * @return {Object} This will resolve with an object holding a boolean state, or an error code
   * @return success: true if the code was removed, and object holding the error code  errorCode: "", errorMessage: ""
   * @see getUserAvailableCoupons, applyCouponOrPromo, getItemsAndSummary
   * @see MuleSoft Doc Below:
   * @see https://childrensplace.atlassian.net/wiki/download/attachments/44072969/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_removePromotionCode_v7.docx?version=1&modificationDate=1487245525426&cacheVersion=1&api=v2
   * @example removeCouponOrPromo("-Y038HDRIUWOE").then((res) => {
        console.log(res) // { success: true }
  })
   */
  removeCouponOrPromo (code) {
    let payload = {
      header: {
        promoCode: code
      },
      webService: endpoints.removeCouponOrPromo
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

  /**
   * @function getSitePromotions
   * @summary This will get site wide promotions that a user can add to their order
   * @return {Object[]} This will resolve with an array of Objects. Each object is a promotion/coupon, they are the same thing.
   * @return {String} couponCode: This is the code to be passed into addCouponOrPromo/removeCouponOrPromo
   * @return {String} couponDescription: This is the description to be displayed to the user
   * @return {Date} couponEndDate: This is the expiration date of the Promotion.
   * @return {Date} couponStartDate: This is the start data of the Promotion
   * @see addCouponsOrPromo, removeCouponsOrPromo
   * @example getSitePromotions().then((res) => {
    console.log(res);
    [
      {
        code: "MERCHDOL20",
        description: "$20 OFF $50. MERCHDOL20",
        endDate: "2016-05-25T04:00:00.000Z",
        startDate: "2016-05-25T04:00:00.000Z",
      },
      {
        code: "U234AFT19"
        description: "$10 off $20 (UAT TESTING)"
        endDate: Wed May 25 2016 00:00:00 GMT-0400 (EDT)
        startDate: Tue May 24 2016 00:00:00 GMT-0400 (EDT)
      }
    ]
  })
   */
  getSitePromotions () {
    let payload = {
      webService: endpoints.getSitePromotions
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      let coupons = [];

      Object.keys(res.body.coupons).map((index) => {
        let endDate = (parseDate(res.body.coupons[index].couponEndDate));

        coupons.push({
          id: res.body.coupons[index].couponCode,
          status: COUPON_STATUS.AVAILABLE,
          title: res.body.coupons[index].couponDescription,
          detailsOpen: false,
          expirationDate: (endDate.getMonth() + 1) + '/' + endDate.getDate() + '/' + (endDate.getFullYear().toString().substr(-2)),
          // startDate: parseDate(res.body.coupons[index].couponStartDate),
          details: '',
          imageThumbUrl: '/wcsstore/static/images/saving-icon-thumb.png',
          imageUrl: '/wcsstore/static/images/saving-icon.png',
          error: '',
          redemptionType: COUPON_REDEMPTION_TYPE.PUBLIC
        });
      });
      return coupons;
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function getUnqualifiedItems
   * @summary Cleans up the order of OOS items so that the user may proceed to checkout
   * @example getUnqualifiedItems().then((res) => {
    console.log(res);
    {
      success: true
    }
  })
   */
  getUnqualifiedItems () {
    let payload = {
      webService: endpoints.getUnqualifiedItems
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      let unqualifiedItem = [];

      if (res.body.orderItemList.length > 0) {
        res.body.orderItemList.map((item) => {
          unqualifiedItem.push(item.orderItemId.toString());
        });
      }

      // if order contains unqualified items,
      // user needs to remove then and the try again
      return unqualifiedItem;
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

}

function deriveItemAvailability (orderDetails, item) {
  let isUsOrder = orderDetails.currencyCode === 'USD';
  let isCaOrder = orderDetails.currencyCode !== 'USD';

  if ((isUsOrder && item.productInfo.articleOOSUS) || (isCaOrder && item.productInfo.articleOOSCA)) {
    return AVAILABILITY.SOLDOUT;
  } else if (item.orderItemType === 'BOPIS' && item.stLocId && !parseBoolean(orderDetails.bopisIntlField)) {
    return AVAILABILITY.OK;
  } else if (item.inventoryAvail > 0) {
    return AVAILABILITY.OK;
  } else {
    return AVAILABILITY.UNAVAILABLE;
  }
}
