/**
 * @module OrderStatus
 * Shows purchase order status and tracking number.
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {ORDER_STATUS} from 'reduxStore/storeReducersAndActions/user/orders/reducer';
import invariant from 'invariant';
import formatTime from 'util/formatTime.js';
import moment from 'moment';

class OrderStatus extends React.Component {
  static propTypes = {
    /** status of the order */
    status: PropTypes.oneOf(Object.keys(ORDER_STATUS).map((key) => ORDER_STATUS[key])).isRequired,
    /** number to track the shipping status of the order */
    trackingNumber: PropTypes.string,
    /** third party url to follow to see the status of the order */
    trackingUrl: PropTypes.string,
    /** date when the order was shipped */
    shippedDate: PropTypes.string,
    /** date when a BOPIS order expires */
    pickUpExpirationDate: PropTypes.string,
    /** date when a BOPIS order has been picked up by the user */
    pickedUpDate: PropTypes.string,
    /** time at which a BOPIS order has been picked up by the user */
    pickedUpTime: PropTypes.string,
    /** flags whether the order is for pick-up in store */
    isBopisOrder: PropTypes.bool.isRequired
  }

  static dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  getLabelAndMessage () {
    let label, message;
    let {status, shippedDate, pickUpExpirationDate,
      pickedUpDate, isBopisOrder} = this.props;

    switch (status) {
      case ORDER_STATUS.ORDER_RECEIVED:
      case ORDER_STATUS.ORDER_USER_CALL_NEEDED:
        if (isBopisOrder) {
          label = 'Order in Process';
          message = '- We will notify you when your order is ready for pickup';
          break;
        }
        label = 'Order Received:';
        message = 'Processing';
        break;
      case ORDER_STATUS.ORDER_SHIPPED:
      case ORDER_STATUS.ORDER_PARTIALLY_SHIPPED:
        label = 'Shipped on:';
        message = shippedDate === 'N/A' ? shippedDate : moment(shippedDate).format('LL');
        break;
      case ORDER_STATUS.ORDER_CANCELED:
      case ORDER_STATUS.ORDER_EXPIRED:
        label = '';
        message = 'This order has been canceled.';
        break;
      case ORDER_STATUS.ITEMS_RECEIVED:
        label = 'Order in Process';
        message = '- We will notify you when your order is ready for pickup';
        break;
      case ORDER_STATUS.ITEMS_READY_FOR_PICKUP:
        label = 'Please pick up by:';
        message = `${moment(pickUpExpirationDate).format('LL')}`;
        break;
      case ORDER_STATUS.ITEMS_PICKED_UP:
        label = 'Picked up on:';
        message = `${moment(pickedUpDate).format('LL')}`;
        break;
      default:
        invariant(false, `${status} is not one of the expected values for the order status.`);
    }

    return {label, message};
  }

  render () {
    let {isMobile, isBopisOrder, trackingNumber, trackingUrl} = this.props;

    let {label, message} = this.getLabelAndMessage();

    return (
      <div className="order-status-container">
        {(label && message) &&
          <div className="internal-notification">
            {label && <strong className="status">{label}</strong>}
            {message && <strong className="message"> {message}</strong>}
          </div>
        }

        {!isBopisOrder &&
          <div className="tracking-number">
            <strong className="title-description">Tracking{isMobile ? '#' : ':  #'}</strong>
            <a href={trackingUrl} target="_blank" className="button-tracking-number">{trackingNumber ||  'N/A'}</a>
          </div>}
      </div>
    );
  }
}

export {OrderStatus};
