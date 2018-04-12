/**
 * @module OrderDetails
 * Shows the details of a purchase order.
 *
 * @author Miguel <malvarez@minutentag.com>
 * @author Florencia <facosta@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {OrderSummary} from './OrderSummary.jsx';
import {OrderStatus} from './OrderStatus.jsx';
import {OrderItemsList} from './OrderItemsList.jsx';
import {OrderItemsWithStatus} from './OrderItemsWithStatus.jsx';
import {ORDER_STATUS} from 'reduxStore/storeReducersAndActions/user/orders/reducer';
import {Spinner} from 'views/components/common/Spinner.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./orderDetails/_d.order-details.scss');
  require('./orderDetails/_d.order-display.scss');
  require('./orderDetails/_d.actual-order-display.scss');
  require('./orderDetails/_d.order-products.scss');
} else {
  require('./orderDetails/_m.order-details.scss');
  require('./orderDetails/_m.order-display.scss');
  require('./orderDetails/_m.actual-order-display.scss');
  require('./orderDetails/_m.order-products.scss');
}

class OrderDetails extends React.Component {
  static propTypes = {
    /** id of the order whose details to show */
    orderId: PropTypes.string.isRequired,
    /** for guest user, email address to use to search for the order */
    emailAddress: PropTypes.string,
    /**
     * Function to call to have the order details loaded. It must receive two
     * parameters:
     *  -orderId: number/id of the order to load
     *  -emailAddress (optional): email of the guest user which generated the
     *  order.
     */
    onLoadOrderDetails: PropTypes.func.isRequired,
    /** The whole information of the order. */
    order: PropTypes.shape({
      ...OrderSummary.propTypes,
      ...OrderStatus.propTypes,
      purchasedItems: OrderItemsList.propTypes.orderItems,
      outOfStockItems: OrderItemsList.propTypes.orderItems,
      canceledItems: OrderItemsList.propTypes.orderItems
    }),
    /** flag indicating if we're rendering for mobile */
    isMobile: PropTypes.bool.isRequired,
    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool
  }

  loadingOrderId: null

  componentDidMount () {
    this.loadOrderDetails(this.props);
  }

  componentWillReceiveProps (nextProps) {
    this.loadOrderDetails(nextProps);
  }

  loadOrderDetails (props) {
    let {orderId, emailAddress} = props;
    if (this.loadingOrderId !== orderId) {
      this.loadingOrderId = orderId;
      this.props.onLoadOrderDetails(orderId, emailAddress);
    }
  }

  render () {
    if (!this.props.order) {
      return <section className="unavailable-order-details"><Spinner className="order-details-loading" /></section>;
    }

    let {order: {
      orderNumber, orderDate, pickUpExpirationDate,
      checkout, summary, appliedGiftCards, status,
      pickedUpDate, purchasedItems, outOfStockItems, canceledItems, isBopisOrder
    }, isMobile} = this.props;

    let isCanceledOrder = status === ORDER_STATUS.ORDER_CANCELED;
    let isPickedUpOrder = status === ORDER_STATUS.ITEMS_PICKED_UP;
    let currencySymbol = summary.currencySymbol;

    let bopisOrderStatus = <OrderStatus isMobile={isMobile} {...{status, pickUpExpirationDate, pickedUpDate, isBopisOrder}} />;

    return (
      <section className="order-details-section">
        {isMobile && isBopisOrder && bopisOrderStatus}
        <OrderSummary {...{orderNumber, orderDate, pickUpExpirationDate, checkout, summary, appliedGiftCards, isCanceledOrder, isBopisOrder}} />
        <div className="order-list-container">
          {!isMobile && isBopisOrder && bopisOrderStatus}

          {!isBopisOrder && purchasedItems.length > 0 && purchasedItems.map((orderGroup, index) => <OrderItemsWithStatus key={index} {...{currencySymbol, isMobile, isBopisOrder, orderGroup}} />)}

          {isBopisOrder && purchasedItems.length > 0 &&
            <OrderItemsList isMobile={isMobile} items={purchasedItems[0].items} currencySymbol={currencySymbol}
              className="processing-list" isShowWriteReview={isPickedUpOrder}
              header={<p className="header-status">Purchased Items: <strong>{summary.purchasedItems}</strong></p>}
            />}

          {outOfStockItems.length > 0 &&
            <OrderItemsList isMobile={isMobile} items={outOfStockItems} currencySymbol={currencySymbol}
              className="out-of-stock-list" isShowWriteReview={false}
              header={<p className="header-status">Out of Stock: <strong>{outOfStockItems.length}</strong></p>}
              notification={<p className="notification-list">Unfortunately some items were out of stock and could not be shipped. You have been fully refunded.</p>}
            />}

          {canceledItems.length > 0 &&
            <OrderItemsList isMobile={isMobile} items={canceledItems} currencySymbol={currencySymbol}
              className="canceled-list" isShowWriteReview={false} isCanceledList
              header={<p className="header-status">Canceled Items: <strong>{summary.canceledItems}</strong></p>}
              notification={<p className="notification-list">This order has been canceled and will not be shipped.</p>}
            />}
        </div>
      </section>
    );
  }
}

export {OrderDetails};
