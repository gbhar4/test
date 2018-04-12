export const ordersStoreView = {
  getLastOrderDetails,
  getSiteOrdersHistoryPages,
  getSiteOrdersHistoryTotalPages,
  getSubmittedOrderDetails,
  getLastShipToHome,
  getLastBopis,
  getLimitToDisplayLastOrderNotification
};

function getLastOrderDetails (state) {
  return state.user.orders.lastOrder;
}

function getSiteOrdersHistoryPages (state, siteId) {
  return state.user.orders.historyPages[siteId];
}

function getSiteOrdersHistoryTotalPages (state, siteId) {
  return state.user.orders.historyTotalPages[siteId];
}

function getSubmittedOrderDetails (state) {
  return state.user.orders.submittedOrderDetails;
}

function getLastShipToHome (state, siteId) {
  return state.user.orders.historyPages[siteId].length > 0
    ? state.user.orders.historyPages[siteId][0].find((order) => order.isEcomOrder)
    : null;
}

function getLastBopis (state) {
  return state.user.orders.historyPages.us.length > 0
    ? state.user.orders.historyPages.us[0].find((order) => !order.isEcomOrder)
    : null;
}

function getLimitToDisplayLastOrderNotification (state) {
  return state.user.orders.ordersNotificationsThreshold;
}
