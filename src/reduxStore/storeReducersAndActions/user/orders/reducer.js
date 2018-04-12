import Immutable from 'seamless-immutable';

export const ORDER_STATUS = Immutable({
  /** The order is placed and is in process */
  ORDER_RECEIVED: 'order received',
  /** The order is shipped */
  ORDER_SHIPPED: 'order shipped',
  /**
   * The order is in one of the following 2 scenarios:
   *  - The order has been short-shipped, meaning that part of the order is
   *    actually out of stock
   *  - Part of the order was canceled by the customer and the rest of the
   *    items have been shipped
   */
  ORDER_PARTIALLY_SHIPPED: 'partially shipped',
  /**
   * The order is in one of the following 2 scenarios:
   *  -The order has been canceled due to suspected fraud
   *  -The customer has canceled his entire order
   */
  ORDER_CANCELED: 'canceled',
  /**
   * (BOPIS) Items have been received by TCP but are not yet ready for the user
   * to pick up
   */
  ITEMS_RECEIVED: 'received',
  /** (BOPIS) An order is ready for the user to pick up in-store */
  ITEMS_READY_FOR_PICKUP: 'ready for pickup',
  /** (BOPIS) The order has been picked up in-store */
  ITEMS_PICKED_UP: 'picked up',
  /**
   * (BOPIS) The order has not been picked up within the expiration period and the user
   * will not be able to pick up the order.
   */
  ORDER_EXPIRED: 'expired',

  ORDER_PROCESSING: 'processing',

  NA: 'N/A',

  ORDER_USER_CALL_NEEDED: 'call needed'
});

let studDefaultOrdersStore = Immutable({
  lastOrder: {
    // trackingNumber: null,
    // orderId: null,
    // status: null
  },
  historyPages: {
    us: [
      // undefined (page 1)
      // [ (page 2)
      //  {
      //    pointsEarned: 590,
      //    orderDate: '4/4/2018',
      //    orderNumber: '58322656564',
      //    orderStatus: 'Shipped',
      //    orderTotal: 589.63,
      //    orderTracking: 'JKHSBFs7658675F6sa',
      //    isEcomOrder: true
      //  },
      //  ...
      // ]
    ],
    ca: []
  },
  historyTotalPages: {
    us: 0,
    ca: 0
  },
  /** complete details of an order already submitted by the user */
  submittedOrderDetails: null,
  ordersNotificationsThreshold: 0
});

const setLastOrder = function (orders, trackingNumber, orderId, orderStatus) {
  return Immutable.merge(orders, {
    lastOrder: {
      trackingNumber,
      orderId,
      orderStatus
    }
  });
};

const ordersReducer = function (orders = studDefaultOrdersStore, action) {
  switch (action.type) {
    case 'USER_ORDERS_SET_LAST_ORDER':
      return setLastOrder(orders, action.trackingNumber, action.orderId, action.orderStatus);
    case 'USER_ORDERS_SET_SITE_HISTORY_TOTAL_PAGES':
      return Immutable.setIn(orders, ['historyTotalPages', action.siteId], action.totalPages);
    case 'USER_ORDERS_CLEAR_SITE_HISTORY':
      return Immutable.merge(orders, {
        historyTotalPages: {
          us: 0,
          ca: 0
        },
        historyPages: {
          us: [],
          ca: []
        }
      });
    case 'USER_ORDERS_SET_SITE_HISTORY_PAGE':
      let pages = Immutable.asMutable(orders.historyPages[action.siteId]);
      pages[action.pageNumber - 1] = action.pageOrders;
      return Immutable.setIn(orders, ['historyPages', action.siteId], Immutable(pages));
    case 'USER_ORDERS_SET_SUBMITTED_ORDER_DETAILS':
      return Immutable.merge(orders, {submittedOrderDetails: action.order});
    case 'USER_ORDERS_SET_PICK_UP_STORE_DISTANCE':
      return Immutable.setIn(orders, ['submittedOrderDetails', 'checkout', 'pickUpStore', 'distance'], action.distance);
    case 'USER_ORDERS_SET_ORDERS_NOTIFICATION_THRESHOLD':
      return Immutable.merge(orders, {ordersNotificationsThreshold: action.ordersNotificationsThreshold});
    default:
      return orders;
  }
};

export * from './actionCreators';
export {ordersReducer};
