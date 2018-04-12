/**
 * @module OrderSummary
 * Shows purchase order number, dates, shipping, pick-up, billing and ledger.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {OrderNumberAndDates} from './OrderNumberAndDates.jsx';
import {OrderShipping} from './OrderShipping.jsx';
import {OrderBilling} from './OrderBilling.jsx';
import {OrderLedger} from './OrderLedger.jsx';

class OrderSummary extends React.Component {
  static propTypes = {
    ...OrderNumberAndDates.propTypes,
    checkout: PropTypes.shape({
      ...OrderShipping.propTypes,
      billing: OrderBilling.propTypes.billing
    }).isRequired,
    appliedGiftCards: OrderBilling.propTypes.appliedGiftCards,
    summary: OrderLedger.propTypes.summary,
    /** flags if the user will pick-up the items in a store */
    isBopisOrder: PropTypes.bool.isRequired
  }

  render () {
    let {orderNumber, orderDate, pickUpExpirationDate,
      checkout: {
        shippingAddress,
        pickUpStore,
        billing
      }, summary, isBopisOrder, appliedGiftCards, isCanceledOrder} = this.props;

    return (
      <div className="actual-order-display">
        <OrderNumberAndDates {...{orderNumber, orderDate, pickUpExpirationDate}} />
        <OrderShipping {...{shippingAddress, pickUpStore}} />
        <OrderBilling {...{billing, appliedGiftCards}} />
        <OrderLedger {...{summary, isBopisOrder, isCanceledOrder, currencySymbol: summary.currencySymbol}} />
      </div>
    );
  }
}

export {OrderSummary};
