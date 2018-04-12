// TODO: rename actions to start with get and end with actions
export function setEstimatedRewards (estimatedRewards) {
  return {
    estimatedRewards,
    type: 'CART_SUMMARY_SET_ESTIMATED_REWARDS'
  };
}

export function getSetEstimatedAirMilesActn (estimatedAirMiles) {
  return {
    estimatedAirMiles,
    type: 'CART_SUMMARY_SET_ESTIMATED_AIRMILES'
  };
}

export function setShippingTotal (shippingTotal) {
  return {
    shippingTotal,
    type: 'CART_SUMMARY_SET_SHIPPINGTOTAL'
  };
}

export function getSetItemsTotalAction (itemsTotal) {
  return {
    itemsTotal: itemsTotal,
    type: 'CART_SUMMARY_SET_ITEMS_TOTAL'
  };
}

export function getSetGiftWrappingTotalActn (giftWrappingTotal) {
  return {
    giftWrappingTotal,
    type: 'CART_SUMMARY_SET_GIFTWRAP_TOTAL'
  };
}

export function getSetGiftCardTotalActn (giftCardsTotal) {
  return {
    giftCardsTotal,
    type: 'CART_SUMMARY_SET_GIFTCARD_TOTAL'
  };
}

export function setTaxesTotal (taxesTotal) {
  return {
    taxesTotal,
    type: 'CART_SUMMARY_SET_TAXESTOTAL'
  };
}

export function setSavingsTotal (savingsTotal) {
  return {
    savingsTotal,
    type: 'CART_SUMMARY_SET_SAVINGSTOTAL'
  };
}

export function getSetCouponsTotalActn (couponsTotal) {
  return {
    couponsTotal,
    type: 'CART_SUMMARY_SET_COUPONSTOTAL'
  };
}

export function setItemsCount (itemsCount) {
  return {
    itemsCount: itemsCount,
    type: 'CART_SUMMARY_SET_ITEMCOUNT'
  };
}

export function getSetSubTotal (subTotal) {
  return {
    subTotal: subTotal,
    type: 'CART_SUMMARY_SET_SUBTOTAL'
  };
}

export function getSetSubTotalWithDiscountsActn (subTotalWithDiscounts) {
  return {
    subTotalWithDiscounts,
    type: 'CART_SUMMARY_SET_SUBTOTAL_WITH_DISCOUNTS'
  };
}

export function getSetGrandTotal (grandTotal) {
  return {
    grandTotal: grandTotal,
    type: 'CART_SUMMARY_SET_GRANDTOTAL'
  };
}

export function getSetRewardsToBeEarnedActn (rewardsToBeEarned) {
  return {
    rewardsToBeEarned: rewardsToBeEarned,
    type: 'CART_SUMMARY_SET_REWARDS_TO_BE_EARNED'
  };
}

export function getSetCurrentOrderIdActn (orderId) {
  return {
    orderId,
    type: 'CART_SUMMARY_SET_ORDER_ID'
  };
}

export function getSetTotalsByFullfillmentCenterMap (map) {
  return {
    map,
    type: 'CART_SUMMARY_SET_TOTALS_BY_CENTER'
  };
}
