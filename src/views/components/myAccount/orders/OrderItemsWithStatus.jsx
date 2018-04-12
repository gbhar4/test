/**
 * @module OrderItemsWithStatus
 * Shows a list of items in a submitted purchase order with tracking details.
 *
 * @author Carla <carla.crandall@sapientrazorfish.com>
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {OrderStatus} from './OrderStatus.jsx';
import {OrderItemsList} from './OrderItemsList.jsx';
import {ORDER_STATUS} from 'reduxStore/storeReducersAndActions/user/orders/reducer';

class OrderItemsWithStatus extends React.Component {
  static propTypes = {
    currencySymbol: PropTypes.string.isRequired,

    /** flags whether the order is for pick-up in store */
    isBopisOrder: PropTypes.bool.isRequired,

    /** flag indicating if we're rendering for mobile */
    isMobile: PropTypes.bool.isRequired,

    /** a group of order items **/
    orderGroup: PropTypes.shape({
      status: PropTypes.oneOf(Object.keys(ORDER_STATUS).map((key) => ORDER_STATUS[key])).isRequired,
      items: OrderItemsList.propTypes.items.isRequired,
      trackingNumber: PropTypes.string,
      trackingUrl: PropTypes.string,
      shippedDate: PropTypes.string
    })
  };

  render () {
    let {
      currencySymbol,
      isMobile,
      isBopisOrder,
      orderGroup
    } = this.props;

    let {
      items,
      shippedDate,
      status,
      trackingNumber,
      trackingUrl
    } = orderGroup;

    let isShowWriteReview = status === ORDER_STATUS.ORDER_SHIPPED ||
      status === ORDER_STATUS.ORDER_PARTIALLY_SHIPPED;

    let header = <OrderStatus {...{isMobile, status, trackingNumber, trackingUrl, shippedDate, isBopisOrder}} />;

    return (
      <OrderItemsList {...{isMobile, isShowWriteReview, currencySymbol, header, items}} className="processing-list" />
    );
  }
}

export {OrderItemsWithStatus};
