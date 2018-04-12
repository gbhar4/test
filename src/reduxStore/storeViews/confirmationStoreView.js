/** @module addressesStoreView
 *
 * @author Noam
 * @updated Agu
 */
import {PAGES} from 'routing/routes/pages';
import {buildStorePageUrlSuffix} from 'reduxStore/storeViews/storesStoreView';
import {routingStoreView} from 'reduxStore/storeViews/routing/routingStoreView.js';

export const confirmationStoreView = {
  getOrderConfirmation,
  getOrderEmailAddress,
  getItemsCount,
  getSubTotal,
  getGrandTotal,
  getSummary,
  getFullfilmentCentersMap,
  getHoldDate,
  getInitialCreateAccountValues,
  getIsOrderHasShipping,
  getEarnedPlaceCashValue,
  getPlaceCashSpotEnabled
};

function getOrderEmailAddress (state) {
  let confirmation = getOrderConfirmation(state);
  return confirmation.userDetails.emailAddress;
}

function getItemsCount (state) {
  return getOrderConfirmation(state).summary.itemsCount;
}

function getSubTotal (state) {
  return getOrderConfirmation(state).summary.subTotal;
}

function getGrandTotal (state) {
  return getOrderConfirmation(state).summary.grandTotal;
}

function getSummary (state) {
  let confirmation = getOrderConfirmation(state);
  return {
    ...confirmation.summary,
    orderBalanceTotal: confirmation.summary.grandTotal - confirmation.summary.giftCardsTotal
  };
}

function getHoldDate (state) {
  return getOrderConfirmation(state).holdDate;
}

function getIsOrderHasShipping (state) {
  let orderConfirmation = getOrderConfirmation(state);
  return orderConfirmation.shipping && orderConfirmation.shipping.itemsCount > 0;
}

function getFullfilmentCentersMap (state) {
  let orderConfirmation = getOrderConfirmation(state);
  let bopis = orderConfirmation.totalsByFullfillmentCenterMap ? orderConfirmation.totalsByFullfillmentCenterMap.map((elem) => {
    return {
      ...elem,
      storeLink: routingStoreView.getLocationFromPageInfo(state, {
        page: PAGES.storeDetails,
        pathSuffix: buildStorePageUrlSuffix(elem)
      }).pathname
    };
  }) : null;
  let shipping = orderConfirmation.shipping;
  let sth;

  if (shipping) {
    sth = [{
      shippingFullname: shipping.address.firstName + ' ' + shipping.address.lastName,
      productsCount: shipping.itemsCount,

      orderDate: shipping.orderDate,
      orderNumber: orderConfirmation.orderDetails.orderNumber,
      orderLink: shipping.orderLink,
      orderTotal: shipping.orderTotal,

      emailAddress: shipping.emailAddress
    }];
  } else {
    return bopis;
  }

  return bopis && sth ? bopis.concat(sth) : null;
}

function getInitialCreateAccountValues (state) {
  return getOrderConfirmation(state).userDetails;
}

function getOrderConfirmation (state) {
  return state.confirmation.orderConfirmation;
}

function getEarnedPlaceCashValue (state) {
  return state.confirmation.orderConfirmation.summary.valueOfEarnedPcCoupons;
}

function getPlaceCashSpotEnabled (state) {
  return getEarnedPlaceCashValue(state) > 0;
}
