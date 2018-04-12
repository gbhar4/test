import Immutable from 'seamless-immutable';

let defaultSummaryStore = Immutable({
  itemsTotal: 0,
  itemsCount: null, // DT-31130: Don't show cart count until service returns value
  savingsTotal: 0,
  giftCardsTotal: 0,
  giftWrappingTotal: 0,
  couponsTotal: 0,
  taxesTotal: 0,
  shippingTotal: 0,
  estimatedRewards: 0,
  estimatedAirMiles: 0,
  subTotal: 0,
  subTotalWithDiscounts: 0,
  grandTotal: 0,
  rewardsToBeEarned: 0,   // FIXME: this should have been part of another namespace, however it had to be done.
  totalsByFullfillmentCenterMap: []
});

const summaryReducer = function (summary = defaultSummaryStore, action) {
  switch (action.type) {
    case 'CART_SUMMARY_SET_ESTIMATED_REWARDS':
      return summary.set('estimatedRewards', action.estimatedRewards);
    case 'CART_SUMMARY_SET_ESTIMATED_AIRMILES':
      return summary.set('estimatedAirMiles', action.estimatedAirMiles);
    case 'CART_SUMMARY_SET_SHIPPINGTOTAL':
      return summary.set('shippingTotal', action.shippingTotal);
    case 'CART_SUMMARY_SET_GIFTWRAP_TOTAL':
      return summary.set('giftWrappingTotal', action.giftWrappingTotal);
    case 'CART_SUMMARY_SET_GIFTCARD_TOTAL':
      return summary.set('giftCardsTotal', action.giftCardsTotal);
    case 'CART_SUMMARY_SET_TAXESTOTAL':
      return summary.set('taxesTotal', action.taxesTotal);
    case 'CART_SUMMARY_SET_SAVINGSTOTAL':
      return summary.set('savingsTotal', action.savingsTotal);
    case 'CART_SUMMARY_SET_COUPONSTOTAL':
      return summary.set('couponsTotal', action.couponsTotal);
    case 'CART_SUMMARY_SET_ITEMS_TOTAL':
      return summary.set('itemsTotal', action.itemsTotal);
    case 'CART_SUMMARY_SET_ITEMCOUNT':
      return summary.set('itemsCount', action.itemsCount);
    case 'CART_SUMMARY_SET_SUBTOTAL':
      return summary.set('subTotal', action.subTotal);
    case 'CART_SUMMARY_SET_SUBTOTAL_WITH_DISCOUNTS':
      return summary.set('subTotalWithDiscounts', action.subTotalWithDiscounts);
    case 'CART_SUMMARY_SET_GRANDTOTAL':
      return summary.set('grandTotal', action.grandTotal);
    case 'CART_SUMMARY_SET_ORDER_ID':
      return summary.set('orderId', action.orderId);
    case 'CART_SUMMARY_SET_REWARDS_TO_BE_EARNED':
      return summary.set('rewardsToBeEarned', action.rewardsToBeEarned);
    case 'CART_SUMMARY_SET_TOTALS_BY_CENTER':
      return summary.set('totalsByFullfillmentCenterMap', action.map);
    default:
      return summary;
  }
};

export {summaryReducer};
