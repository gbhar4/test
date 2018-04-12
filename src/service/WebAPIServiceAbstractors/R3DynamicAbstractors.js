/**
* @module R3DynamicAbstractors
* @see https://docs.google.com/spreadsheets/d/1Pcoe2f8G-u-u-fxVh9AtuwQjkB2SbQwAk_BW33PR2JI/edit#gid=0
*/
import {endpoints} from './endpoints.js';
import {ServiceResponseError} from 'service/ServiceResponseError';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {sanitizeEntity} from 'service/apiUtil.js';
import {ORDER_STATUS} from 'reduxStore/storeReducersAndActions/user/orders/reducer.js';
import {routingConstants} from 'routing/routingConstants.js';
import {extractFloat} from '../apiUtil.js';
import {parseDate} from 'util/parseDate.js';
import {parseStoreHours} from './tcpStoresDynamicAbstractor.js';

let previous = null;
// NOTE: do we have a global config file that we can store other site consts like this inside?
const ecomStoreNumber = '0180';

export function getR3Abstractor (apiHelper) {
  if (!previous || previous.apiHelper !== apiHelper) {
    previous = new R3DynamicAbstractor(apiHelper);
  }
  return previous;
}

class R3DynamicAbstractor {
  constructor (apiHelper) {
    this.apiHelper = apiHelper;

    // create this-bound varsions of all methods of this class
    bindAllClassMethodsToThis(this);
  }

  /**
   * @function deleteGiftCardOnAccount
   * @summary This api is used to delete a gift card on file given the card id
   * @param {type} onFileCardId - This is the id of the card on file.
   * @return This will return a success flag true or an api error on fail
  */
  deleteGiftCardOnAccount (onFileCardId) {
    let payload = {
      body: {
        action: 'D',
        creditCardId: onFileCardId
      },
      webService: endpoints.deleteGiftCardOnAccount
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return { success: true };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function deleteCreditCardOnAccount
   * @summary
   * @param {type} paramName -
   * @return TDB
  */
  deleteCreditCardOnAccount (onFileCardId) {
    let payload = {
      body: {
        action: 'D',
        creditCardId: onFileCardId
      },
      webService: endpoints.deleteCreditCardOnAccount
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return { success: true };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  // FIXME: delete this when r5 is complete if we still don't find any use for them
  /**
   * @function deleteFavoriteStore
   * @summary
   * @param {type} paramName -
   * @return TDB
  */
  // deleteFavoriteStore () {
  //   let payload = {
  //     header: {
  //       action: 'delete'
  //     },
  //     webService: endpoints.deleteFavoriteStore
  //   };
  //
  //   return this.apiHelper.webServiceCall(payload).then((res) => {
  //     if (this.apiHelper.responseContainsErrors(res)) {
  //       throw new ServiceResponseError(res);
  //     }
  //     return res.body;
  //   }).catch((err) => {
  //     throw this.apiHelper.getFormattedError(err);
  //   });
  // }

  // FIXME: delete this when r5 is complete if we still don't find any use for them
  /**
   * @function updateFavoriteStore
   * @summary
   * @param {type} paramName -
   * @return TDB
  */
  // updateFavoriteStore (storeLocationId) {
  //   let payload = {
  //     header: {
  //       action: 'update'
  //     },
  //     body: {
  //       storeLocId: storeLocationId // 111085
  //     },
  //     webService: endpoints.updateFavoriteStore
  //   };
  //
  //   return this.apiHelper.webServiceCall(payload).then((res) => {
  //     if (this.apiHelper.responseContainsErrors(res)) {
  //       throw new ServiceResponseError(res);
  //     }
  //     return { success: true };
  //   }).catch((err) => {
  //     throw this.apiHelper.getFormattedError(err);
  //   });
  // }

  /**
   * @function updateProfileInfo
   * @summary
   * @param {type} paramName -
   * @return TDB
  */
  updateProfileInfo (args) {
    let payload = {
      header: {
        'Content-Type': 'application/json'
      },
      body: {
        firstName: args.firstName,
        lastName: args.lastName,
        associateId: args.associateId,
        email1: args.email,
        phone1: args.phone,
        currentPassword: args.currentPassword,
        logonPassword: args.newPassword,
        logonPasswordVerify: args.newPasswordVerify,
        status: args.status,
        operation: args.currentPassword && args.newPassword && 'resetPassword' || '' // If resetPassword backend will validate currentPassword
      },
      webService: endpoints.updateProfileInfo
    };

    if (args.airmiles) {
      payload.body.customMemberAttributes = [ {airMilesCard: args.airmiles} ];
    }

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return { success: true };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function getOrderHistory
   * @summary
   * @param {type} paramName -
   * @return TDB
  */
  getOrderHistory (siteId, currentSiteId) {
    let {siteIds, companyIds} = routingConstants;
    let payload = {
      header: {
        fromRest: true
      },
      webService: endpoints.getDetailedOrderHistory
    };

    if (siteId !== currentSiteId) {
      payload.header.companyId = (siteId === siteIds.ca) ? companyIds.ca : companyIds.us;
    }

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      let orders = res.body.getOrderHistoryResponse.domOrderBeans.map((order) => {
        return {
          orderDate: order.orderDate,
          orderNumber: order.orderNumber,
          orderStatus: orderStatusMapping(order.orderStatus),
          currencySymbol: order.orderTotal.replace(/[0-9]|\.|,/gi, ''),
          orderTotal: extractFloat(order.orderTotal),
          orderTracking: order.orderTrackingNumber,
          orderTrackingUrl: order.orderTrackingURL,
          isEcomOrder: !(order.orderType === 'USBOPIS' || order.orderType === 'CABOPIS' || order.orderType === 'USROPIS' || order.orderType === 'CAROPIS'),
          isCanadaOrder: ['CAECOM', 'CAROPIS', 'CABOPIS'].includes(order.orderType)
        };
      });

      return {
        totalPages: 1,
        orders: orders.sort((prev, next) => parseInt(next.orderNumber) - parseInt(prev.orderNumber))
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function addChild
   * @summary
   * @param {type} paramName -
   * @return TDB
  */
  addChild (args) {
    let payload = {
      body: {
        firstName: args.parentFirstName,
        lastName: args.parentLastName,
        timestamp: args.timestamp,
        childDetails: [
          {
            childName: args.childFullName,
            birthYear: args.childBirthYear,
            birthMonth: args.childBirthMonth,
            gender: args.childGender === 'MALE' ? '01' : '0'
          }
        ]
      },
      webService: endpoints.addChild
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      return {
        firstName: res.body.firstName,
        lastName: res.body.lastName,
        children: res.body.childBirthdayInfo.map((child) => ({
          name: child.childName,
          birthYear: child.childBirthdayYear,
          birthMonth: child.childBirthdayMonth,
          gender: child.childGender,
          childId: child.childId
        }))
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function deleteAddressOnAccount
   * @summary
   * @param {type} paramName -
   * @return TDB
  */
  deleteAddressOnAccount (addressKey) {
    let payload = {
      header: {
        nickname: addressKey,
        'Content-Type': 'application/json'
      },
      webService: endpoints.deleteAddressOnAccount
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return { success: true };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function getReservationHistory
   * @summary
   * @param {type} paramName -
   * @return TDB
  */
  getReservationHistory () {
    let payload = {
      header: {
        fromRest: true
      },
      webService: endpoints.getReservationHistory
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      let reservations = res.body.reservationHistoryArray.map((reservation) => {
        return {
          expiryDate: reservation.expiryDate,
          reservationId: reservation.reservationId,
          reservationStatus: orderStatusMapping(reservation.reservationStatus),
          reserveDate: reservation.reserveDate,
          emailAddress: reservation.emailId
        };
      });
      return {
        totalPages: 1,
        reservations
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function updateChild
   * @summary
   * @param {type} paramName -
   * @return TDB
  */
  updateChild (args) {
    let d = new Date();
    let payload = {
      body: {
        firstName: args.parentFirstName,
        lastName: args.parentLastName,
        timestamp: d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + '.' + d.getMilliseconds(),
        childDetails: [
          {
            childName: args.childFullName,
            birthYear: args.childBirthYear,
            birthMonth: args.childBirthMonth,
            gender: args.childGender === 'MALE' ? '1' : '0',
            childId: args.childId
          }
        ]
      },
      webService: endpoints.updateChild
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return { success: true };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function deleteChild
   * @summary
   * @param {type} paramName -
   * @return TDB
  */
  deleteChild (args) {
    let d = new Date();
    let payload = {
      body: {
        firstName: args.parentFirstName,
        lastName: args.parentLastName,
        timestamp: d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + '.' + d.getMilliseconds(),
        childDetails: [
          {
            childId: args.childId
          }
        ]
      },
      webService: endpoints.deleteChild
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
   * @function getChildren
   * @summary
   * @param {type} paramName -
   * @return TDB
  */
  getChildren (args) {
    let payload = {
      webService: endpoints.getChildren
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      // We are doing parseInt(child.childBirthdayMonth).toString() beacuse we use this value to index a table and backend can send it with a leading Zero like 02
      return res.body.childBirthdayInfo.map((child) => ({
        name: child.childName,
        birthYear: child.childBirthdayYear,
        birthMonth: parseInt(child.childBirthdayMonth).toString(),
        gender: child.childGender,
        childId: child.childId
      }));
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function getPointsHistory
   * @summary This API will give you the transactional history of a users points
   * @return TDB
  */
  getPointsHistory () {
    let payload = {
      webService: endpoints.getPointsHistory
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      let pointsTransactions = res.body.pointsHistoryList[0].pointsHistoryData.map((transaction) => ({
        date: transaction.transactionDate,
        type: transaction.transactionTypeName,
        amount: transaction.pointsEarned
      }));
      return {
        totalPages: 1,
        pointsTransactions
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function claimPoints
   * @summary This api is used to claim points on a users account given a past transaction.
   * @param {String} firstName - This is the form value that represents the user's first name
   * @param {String} lastName - This is the form value that represents the user's last name
   * @param {String} myPlaceNumber - This is the form value that represents the user's MPR account number
   * @param {String} email - This is the form value that represents the user's email
   * @param {boolean} wasInStoreTransaction - This is the form value that represents if the transaction was in store or online, true is it was in-store
   * @param {String} storeRegisterNumber - If wasInStoreTransaction is true you must pass the register number feild
   * @param {String} transactionNumber - If wasInStoreTransaction is true this is the form value that represents the user's transaction number found on their receipt
   * @param {String} transactionDate - This is the form value that represents the user's transactionDate
   * @param {String} orderNumber - If not wasInStoreTransaction this is the form value that represents the user's orderNumber
   * @return { success: true } if valid else form mapped error
  */
  claimPoints (args) {
    let payload = {
      body: {
        FirstName: args.firstName,
        LastName: args.lastName,
        MyPlaceNumber: args.myPlaceNumber,
        EmailAddr: args.email,
        StoreType: args.wasInStoreTransaction ? 'S' : 'O',
        StoreNumber: args.wasInStoreTransaction ? args.storeNumber : ecomStoreNumber,
        RegisterNumber: args.storeRegisterNumber,
        TransNumber: args.transactionNumber,
        TransDate: args.transactionDate,
        OrderNum: args.orderNumber
      },
      webService: endpoints.claimPoints
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      if (['1', '2', '3', '4', '5'].includes(res.body.statusCode)) {
        return {
          success: false,
          // Adding this key only for clarity to show the same message for many
          // errors, as specified in DT-22410 and DT-22420.
          errorKey: 'POINTS_CLAIM_FORM_ANY_ERROR'
        };
      }
      return { success: true };
    }).catch((err) => {
      if (err.response.body.errorDetected) {
        throw this.apiHelper.getFormattedError({response: {body: { errorCode: err.response.body.errorDetected.ErrorCode }}});
      } else {
        throw this.apiHelper.getFormattedError(err);
      }
    });
  }

  /**
   * @function addGiftCardToAccount
   * @summary
   * @param {type} paramName -
   * @return TDB
  */
  addGiftCardToAccount (giftcardAccountNumber, giftcardPin, recaptchaToken) {
    let payload = {
      header: {
        isRest: true
      },
      body: {
        cc_brand: 'GC',
        payMethodId: 'GiftCard',
        account_pin: giftcardPin,
        pay_account: giftcardAccountNumber,
        recapchaResponse: recaptchaToken || ''
      },
      webService: endpoints.addGiftCardToAccount
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return { success: true };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
    * @function getGiftCardBalance
    * @summary This API is used to get the information about a gift card, such as balance
    * @param {String} creditCardId - if it's an existing card on the account we need to send card id instead of card number (as it would be encoded)
    * @param {String} giftCardNumber - this is the giftcard number that the user inputs
    * @param {String} giftCardPin - this is the giftcard pin that the user inputs
    * @param {String} recaptureResponse - this is the code returned from the google recaptcha API
    * @see MuleSoft Doc:
    * @see https://childrensplace.atlassian.net/wiki/display/DT/API+Specification+Documentation?preview=/44072969/50233462/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_Gift%20Card%20Balance%20Check%20with%20recaptCha_v4.docx
    * @return {Object} This will resolve with and object holding details about the requested giftcard
  */
  getGiftCardBalance (creditCardId, giftCardNumber, giftCardPin, recaptureResponse) {
    let payload = {
      body: {
        'recapture-response': recaptureResponse || ''
      },
      webService: endpoints.getGifCardBalance
    };

    if (creditCardId) {
      payload.body = {
        ...payload.body,
        creditCardId
      };
    } else {
      payload.body = {
        ...payload.body,
        giftCardNbr: giftCardNumber,
        giftCardPin: giftCardPin
      };
    }

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      return {
        id: '************' + res.body.giftCardNbr.substr(-4), // service does not provide one
        endingNumbers: res.body.giftCardNbr.substr(-4),
        remainingBalance: Number(res.body.giftCardAuthorizedAmt) || 0 // REVIEW: or res.body.giftCardAmt? backend to specify
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function getOrderInfoByOrderId
   * @summary
   * @param {type} paramName -
   * @return TDB
  */
  getOrderInfoByOrderId (orderId, emailAddress, isGuest, getSwatchPath) {
    let payload = {
      header: {
        orderId,
        emailId: emailAddress
      },
      webService: endpoints.orderLookUp
    };

    if (!isGuest) {
      payload.header.fromPage = 'orderHistory';
    }

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      const giftCardType = 'Gift Card';
      let orderDetails = res.body.orderLookupResponse.orderDetails;
      let orderShipping = res.body.orderLookupResponse.orderSummary.shippingAddress;
      let orderBillingAddress = res.body.orderLookupResponse.orderSummary.billingAddress;
      let orderBilling = res.body.orderLookupResponse.amountBilled;
      let orderPayment = res.body.orderLookupResponse.paymentSummary.paymentList;
      let orderCart = res.body.orderLookupResponse.shoppingBag;

      let paymentCards = orderPayment.map((card) => ({
        endingNumbers: card.accountNo,
        cardType: card.cardType,
        chargedAmount: card.chargedAmount,
        id: null // we dont get, do we need this?
      }));

      let cartItems = orderCart.items.map((item) => ({
        productInfo: {
          fit: null,
          pdpUrl: sanitizeEntity(item.productURL),
          name: sanitizeEntity(item.name),
          imagePath: `//${item.imgURL}`,
          upc: item.upc,
          size: item.size,
          color: {
            name: item.color,
            imagePath: getSwatchPath(item.thumbnail)
          }
        },
        itemInfo: {
          listPrice: extractFloat(item.saleUnitPrice),
          offerPrice: extractFloat(item.paidUnitPrice),
          linePrice: extractFloat(item.paidUnitPrice) * (parseInt(item.quantityShipped) || parseInt(item.quantity)),
          quantity: parseInt(item.quantity),
          quantityCanceled: parseInt(item.quantityCanceled) || 0,
          quantityShipped: parseInt(item.quantityShipped) || 0,
          quantityReturned: parseInt(item.quantityReturned) || 0,
          quantityOOS: 0 // no support from backend
        },
        trackingInfo: (item.shipped) ? item.shipped : null
      }));

      // Get all shipped items
      let shippedItems = cartItems.filter((item) => item.trackingInfo !== null);

      // Group shipped items by tracking number
      // Object used to prevent duplicates
      let shipmentsObj = {};
      shippedItems.forEach((item) => {
        item.trackingInfo.forEach((shipment) => {
          let key = shipment.trackingNbr;
          let items = shipmentsObj[key] && shipmentsObj[key].items || [];

          items.push({
            itemInfo: {
              ...item.itemInfo,
              quantity: shipment.quantity, // We only want to show quantity included in the shipment
              linePrice: item.itemInfo.offerPrice * parseInt(shipment.quantity)
            },
            productInfo: item.productInfo
          });

          shipmentsObj[key] = {
            trackingNumber: shipment.trackingNbr,
            trackingUrl: sanitizeEntity(shipment.trackingUrl),
            shippedDate: shipment.shipDate,
            status: 'order shipped',
            items
          };
        });
      });

      // Convert shipmentsObj to an array
      let shipments = Object.keys(shipmentsObj).map((trackingNbr) => shipmentsObj[trackingNbr]);

      // For BOPIS orders, remainingItems = uncanceled items
      // For Non-BOPIS orders, remainingItems = unshipped and uncanceled items (i.e. processsing items)
      let remainingItems = [];
      if (orderDetails.orderType === 'ECOM') {
        let processingItems = cartItems.filter(({itemInfo}) => itemInfo.quantityCanceled + itemInfo.quantityShipped !== itemInfo.quantity);

        if (processingItems.length > 0) {
          remainingItems = [{
            items: processingItems.map((item) => {
              // We only want to show quantity of processing items
              let quantity = item.itemInfo.quantity - (item.itemInfo.quantityCanceled + item.itemInfo.quantityShipped);
              return {
                itemInfo: {
                  ...item.itemInfo,
                  linePrice: item.itemInfo.offerPrice * parseInt(quantity),
                  quantity
                },
                productInfo: item.productInfo
              };
            }),
            status: 'order received'
          }];
        }
      } else {
        let uncanceledItems = cartItems.filter(({itemInfo}) => itemInfo.quantityCanceled !== itemInfo.quantity);

        if (uncanceledItems.length > 0) {
          remainingItems = [{ items: uncanceledItems }];
        }
      }

      let canceledItems = cartItems.filter(({itemInfo}) => itemInfo.quantityCanceled).map((item) => ({
        productInfo: { ...item.productInfo },
        itemInfo: {
          ...item.itemInfo,
          linePrice: extractFloat(item.paidUnitPrice) * item.itemInfo.quantityCanceled
        }
      }));

      let outOfStockItems = []; // cartItems.filter((item) => item.itemInfo.quantityOOS);

      let orderDetailsReturn = {
        orderNumber: orderDetails.orderId,
        orderDate: orderDetails.orderDate.replace('T', ' '),
        pickUpExpirationDate: res.body.orderLookupResponse.orderSummary.requestedDeliveryBy && res.body.orderLookupResponse.orderSummary.requestedDeliveryBy.replace('T', ' '),
        pickedUpDate: (orderDetails.dateShipped || '').replace('T', ' '),
        shippedDate: orderDetails.dateShipped.replace('T', ' '),
        status: orderStatusMapping(orderDetails.orderStatus).replace('-', ' '),
        trackingNumber: orderDetails.tracking,
        trackingUrl: orderDetails.trackingUrl !== 'N/A' ? sanitizeEntity(orderDetails.trackingUrl) : '#',
        isBopisOrder: orderDetails.orderType !== 'ECOM',
        summary: {
          currencySymbol: orderBilling.subtotal.replace(/[0-9]|\.|,|-/gi, ''),
          totalItems: orderCart.items.length ? orderCart.items.map((item) => parseInt(item.quantity)).reduce((a, b) => a + b) : 0,
          subTotal: extractFloat(orderBilling.subtotal),
          purchasedItems: parseInt(orderDetails.totalQuantityPurchased),
          shippedItems: parseInt(orderDetails.totalQuantityShipped),
          canceledItems: parseInt(orderDetails.totalQuantityCanceled),
          returnedItems: parseInt(orderDetails.totalQuantityReturned),
          returnedTotal: extractFloat(orderDetails.totalAmountReturned),
          couponsTotal: extractFloat(orderBilling.discount),
          shippingTotal: extractFloat(orderBilling.shipping),
          totalTax: extractFloat(orderBilling.tax),
          grandTotal: extractFloat(orderBilling.total)
        },
        appliedGiftCards: paymentCards.filter((card) => card.cardType === giftCardType),
        canceledItems: canceledItems,
        purchasedItems: shipments.concat(remainingItems),
        outOfStockItems: outOfStockItems,
        checkout: {
          shippingAddress: orderDetails.orderType === 'ECOM'
            ? {
              firstName: orderShipping.firstName,
              lastName: orderShipping.lastName,
              addressLine1: orderShipping.addressLine1,
              addressLine2: orderShipping.addressLine2,
              city: orderShipping.city,
              state: orderShipping.state,
              zipCode: orderShipping.zipCode,
              country: orderShipping.country
            }
            : null,
          pickUpStore: orderDetails.orderType !== 'ECOM'
            ? { // NOTE: WE WILL NEVER SHOW AN ECOM ORDER AND BOPIS ORDER AT THE SAME TIME, SHIPPING IS SHARED IN THE SAME VAR AS PER BACKEND
              basicInfo: {
                id: null,
                storeName: orderShipping.addressLine1.split('|')[0],
                address: {
                  addressLine1: (orderShipping.addressLine1.split('|')[1] || '') + ' ' + orderShipping.addressLine2,
                  city: orderShipping.city,
                  state: orderShipping.state,
                  zipCode: orderShipping.zipCode
                },
                phone: orderShipping.phone
              },
              distance: null,
              pickUpPrimary: {
                firstName: orderShipping.firstName,
                lastName: orderShipping.lastName,
                emailAddress: orderShipping.email
              },
              pickUpAlternative: (orderShipping.altFirstName && orderShipping.altFirstName.length > 0) ? {
                firstName: orderShipping.altFirstName,
                lastName: orderShipping.altLastName,
                emailAddress: orderShipping.altEmail
              } : null
            }
            : null,
          billing: {
            card: paymentCards.find((card) => card.cardType !== giftCardType),
            sameAsShipping: false,
            // Backend returns billing address as an empty object for gift card orders
            billingAddress: Object.keys(orderBillingAddress).length > 0
              ? {
                firstName: orderBillingAddress.firstName,
                lastName: orderBillingAddress.lastName,
                addressLine1: orderBillingAddress.addressLine1,
                addressLine2: orderBillingAddress.addressLine2,
                city: orderBillingAddress.city,
                state: orderBillingAddress.state,
                zipCode: orderBillingAddress.zipCode,
                country: orderBillingAddress.country
              }
              : null
          }
        }
      };

      // Parse Store Hours
      if (orderShipping.storeHours && orderShipping.storeHours.length) {
        orderDetailsReturn.checkout.pickUpStore.hours = {
          regularHours: parseStoreHours(orderShipping.storeHours)
        };
      }

      return orderDetailsReturn;
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function reservationLookUp
   * @summary
   * @param {type} paramName -
   * @return TDB
  */
  reservationLookUp (orderId, emailId) {
    let payload = {
      header: {
        orderId,
        emailId
      },
      webService: endpoints.newReservationLookUp
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      let order = res.body[0];
      let store = res.body[0].storeDetails[0];
      let pickedUpItem = order.orderItems.find((item) => item.pickedUpDate !== 'N/A'); // DT-17869 - the pickedUpDate is on the item level not order level so we extract the pickedUpDate date of the first item that has a pickUpDate

      return {
        orderNumber: order.reservationNumber,
        orderDate: order.reserveDate.replace('T', ' '),
        pickUpExpirationDate: (new Date(order.expiryDate)).toLocaleString('en-us', { year: 'numeric', month: 'long', day: 'numeric' }),
        status: orderStatusMapping(order.reservationStatus),
        pickedUpDate: pickedUpItem ? pickedUpItem.pickedUpDate : null,
        checkout: {
          pickUpStore: {
            basicInfo: {
              id: null, // DT-17869
              storeName: store.storeName,
              address: {
                addressLine1: store.storeAddress.line1,
                city: store.city,
                state: store.state,
                zipCode: store.zipCode
              },
              phone: store.storePhoneNo
            },
            hours: {
              regularHours: ((store.storeHours && store.storeHours.length) || null) && parseStoreHours(store.storeHours),
            }
          }
        },
        purchasedItems: order.orderItems.map((item) => ({
          productInfo: {
            name: sanitizeEntity(item.productName),
            imagePath: `${item.imagePath}`,
            pickedUpDate: item.pickedUpDate,
            upc: item.itemPartNumber,
            size: item.skusAtrributes.TCPSize,
            fit: item.skusAtrributes.TCPFit,
            pdpUrl: item.productURL,
            color: {
              name: item.color,
              imagePath: item.imagePath
            }
          },
          itemInfo: {
            status: orderStatusMapping(item.itemStatus),
            quantity: item.quantity,
            listPrice: item.original,
            offerPrice: item.price,
            quantityCanceled: parseInt(item.quantityCanceled) || 0
          }
        })),
        canceledItems: []
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }
}

// Note: DT-20442
function orderStatusMapping (orderStatus) {
  switch (orderStatus) {
    case 'Pending payment approval':
      return ORDER_STATUS.ORDER_RECEIVED;
    case 'Order In Process':
      return ORDER_STATUS.ORDER_RECEIVED;
    case 'Order Expired':
      return ORDER_STATUS.ORDER_EXPIRED;
    case 'Order Canceled':
    case 'Order Cancelled':
      return ORDER_STATUS.ORDER_CANCELED;
    case 'Order Shipped':
      return ORDER_STATUS.ORDER_SHIPPED;
    case 'Partially Shipped':
    case 'Order Partially Shipped':
      return ORDER_STATUS.ORDER_PARTIALLY_SHIPPED;
    case 'Order Received':
      return ORDER_STATUS.ITEMS_RECEIVED;
    case 'Ready for Pickup':
      return ORDER_STATUS.ITEMS_READY_FOR_PICKUP;
    case 'Reservation Received':
      return ORDER_STATUS.ORDER_RECEIVED;
    case 'Picked Up':
      return ORDER_STATUS.ITEMS_PICKED_UP;
    case 'Order Picked Up':
      return ORDER_STATUS.ITEMS_PICKED_UP;
    case 'Confirmed':
      return ORDER_STATUS.ORDER_RECEIVED;
    case 'Expired':
      return ORDER_STATUS.ORDER_EXPIRED;
    case 'Completed':
      return ORDER_STATUS.ITEMS_PICKED_UP;
    case 'Canceled':
      return ORDER_STATUS.ORDER_CANCELED;
    case 'N/A':
      return ORDER_STATUS.NA;
    case 'Please contact our Customer Service':
      return ORDER_STATUS.ORDER_USER_CALL_NEEDED;
      // case 'Unavailable':
      //   return ORDER_STATUS.;
      // case 'Please contact our Customer Service':
      //   return ORDER_STATUS.;
      // case 'Currently edited by the store':
      //   return ORDER_STATUS.;
      // case 'Currently locked by the store':
      //   return ORDER_STATUS.;
      // case 'Back ordered':
      //   return ORDER_STATUS.;
      // case 'Return associated':
      //   return ORDER_STATUS.;
    default:
      return orderStatus;
  }
}

