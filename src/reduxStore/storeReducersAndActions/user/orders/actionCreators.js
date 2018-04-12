export function getSetLastOrderActn (trackingNumber, orderId, orderStatus) {
  return {
    trackingNumber,
    orderId,
    orderStatus,
    type: 'USER_ORDERS_SET_LAST_ORDER'
  };
}

export function getSetSiteOrdersHistoryTotalPagesActn (siteId, totalPages) {
  return {
    siteId,
    totalPages,
    type: 'USER_ORDERS_SET_SITE_HISTORY_TOTAL_PAGES'
  };
}

export function getSetSiteOrdersHistoryPageActn (siteId, pageNumber, pageOrders) {
  return {
    siteId,
    pageOrders,
    pageNumber,
    type: 'USER_ORDERS_SET_SITE_HISTORY_PAGE'
  };
}

export function getSetClearSiteOrdersHistoryActn () {
  return {
    type: 'USER_ORDERS_CLEAR_SITE_HISTORY'
  };
}

export function getSetSubmittedOrderDetailsActn (order) {
  return {
    order,
    type: 'USER_ORDERS_SET_SUBMITTED_ORDER_DETAILS'
  };
}

export function getSetPickupStoreDistanceActn (distance) {
  return {
    distance,
    type: 'USER_ORDERS_SET_PICK_UP_STORE_DISTANCE'
  };
}

export function getSetOrdersNotificationsThresholdActn (ordersNotificationsThreshold) {
  return {
    ordersNotificationsThreshold,
    type: 'USER_ORDERS_SET_ORDERS_NOTIFICATION_THRESHOLD'
  };
}
