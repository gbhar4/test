/**
 * @module OrderNumberAndDates
 * Shows purchase order number, date and pick-up expiration date.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import moment from 'moment';

class OrderNumberAndDates extends React.Component {
  static propTypes = {
    orderNumber: PropTypes.string.isRequired,
    orderDate: PropTypes.string.isRequired,
    pickUpExpirationDate: PropTypes.string
  }

  static dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  render () {
    let {orderNumber, orderDate, pickUpExpirationDate} = this.props;
    let pickUpExpirationTime = pickUpExpirationDate && pickUpExpirationDate.split(' ')[1];
    let orderTime = orderDate.split(' ')[1];
    orderDate = moment(orderDate);
    orderTime = orderTime && moment(orderTime, 'HH:mm:ss');
    pickUpExpirationTime = pickUpExpirationTime && moment(orderTime, 'HH:mm:ss');

    return (
      <div className="order-display">
        <strong className="title-description">Order #</strong>
        <span className="order-number">{orderNumber}</span>
        <strong className="title-description">Order Date</strong>
        <span className="order-date">
          {orderDate.format('LL')} {orderTime && <strong className="order-hour">at {orderTime.format('hh:mma')}</strong>}
        </span>

        {pickUpExpirationDate &&
          <div className="expiration-date-container">
            <strong className="title-description">Expiration Date</strong>
            <span className="order-date">
              {moment(pickUpExpirationDate).format('LL')} {pickUpExpirationTime && <strong className="order-hour">at {pickUpExpirationTime.format('hh:mma')}</strong>}
            </span>
          </div>}
      </div>
    );
  }
}

export {OrderNumberAndDates};
