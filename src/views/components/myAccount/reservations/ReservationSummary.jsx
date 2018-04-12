/**
 * @module ReservationSummary
 * Shows purchase order number, dates, shipping, pick-up, billing and ledger.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {OrderNumberAndDates} from 'views/components/myAccount/orders/OrderNumberAndDates.jsx';
import {OrderShipping} from 'views/components/myAccount/orders/OrderShipping.jsx';

export class ReservationSummary extends React.Component {
  static propTypes = {
    ...OrderNumberAndDates.propTypes,
    checkout: PropTypes.shape({
      pickUpStore: OrderShipping.propTypes.pickUpStore.isRequired
    }).isRequired
  }

  render () {
    let {orderNumber, orderDate, pickUpExpirationDate,
      checkout: {
        pickUpStore
      }} = this.props;

    return (
      <div className="actual-order-display">
        <OrderNumberAndDates {...{orderNumber, orderDate, pickUpExpirationDate}} />
        <OrderShipping pickUpStore={pickUpStore} />
      </div>
    );
  }
}
