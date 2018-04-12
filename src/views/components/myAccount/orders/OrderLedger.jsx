/**
 * @module OrderLedger
 * Shows purchase order ledger.
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import React from 'react';
import {PropTypes} from 'prop-types';

class OrderLedger extends React.Component {
  static propTypes = {
    summary: PropTypes.shape({
      /** number of items included in the original order */
      totalItems: PropTypes.number.isRequired,
      /**
       * total price of the items included in the original order, before taxes,
       * shipping, coupons, etc.
       */
      subTotal: PropTypes.number.isRequired,
      /**
       * number of items ordered that bacame out of stock after the order was
       * submitted
       */
      outOfStockItems: PropTypes.number,
      /** total amount discounted from the order because of out of stock items */
      outOfStockTotal: PropTypes.number,

      /** number of items canceled by the user or us */
      // canceledItems: PropTypes.number, // DESCOPED DT-22711
      /** total amount discounted from the order because of canceled items */
      // canceledTotal: PropTypes.number, // DESCOPED DT-22711

      /** total amount of discounted by coupons applied to the order */
      couponsTotal: PropTypes.number,
      /** total shipping amount. If it's value is 0, we'll show 'Free' */
      shippingTotal: PropTypes.number,
      /** total amount of taxes applied. */
      totalTax: PropTypes.number,
      /**
       * total amount that the user has finally payed, event after refunds because
       * of out of stock and canceled items.
       */
      grandTotal: PropTypes.number.isRequired
    }).isRequired,
    /** flags if the user will pick-up the items in a store */
    isBopisOrder: PropTypes.bool.isRequired,
    /** flags if the order has been fully canceled */
    isCanceledOrder: PropTypes.bool.isRequired,
    /** This is used to display the correct currency symbol */
    currencySymbol: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props);
    this.formatAmount = this.formatAmount.bind(this);
  }

  formatAmount (value) {
    let {currencySymbol} = this.props;
    let simbol = value < 0 ? '-' : '';
    return simbol + currencySymbol + Math.abs(value).toFixed(2);
  }

  render () {
    let {summary: {
        purchasedItems, canceledItems, subTotal, outOfStockItems, outOfStockTotal, couponsTotal, shippingTotal, totalTax, grandTotal},
        isBopisOrder, isCanceledOrder} = this.props;

    let shippingValue = shippingTotal > 0 ? this.formatAmount(shippingTotal) : 'Free';
    let outOfStockLine = outOfStockItems && outOfStockItems > 0
      ? <li className="items-total">Out of Stock Items ({outOfStockItems}) <strong>{this.formatAmount(outOfStockTotal)}</strong></li>
      : null;
    let storePickUpLine = isBopisOrder
      ? <li className="items-total">Store Pickup <strong>Free</strong></li>
      : null;

    return (
      <div className="billing-section ledger-section">
        <p className="title-description title-order-summary">Order Summary</p>
        <ol className="order-summary">
          <li className="items-total">Items ({isCanceledOrder ? canceledItems : purchasedItems}) <strong>{this.formatAmount(subTotal)}</strong></li>

          {!isCanceledOrder && (
            <div>
              {outOfStockLine && outOfStockLine}
              <li className="items-total">Coupons &amp; Promotions <strong>{this.formatAmount(couponsTotal)}</strong></li>
              {storePickUpLine && storePickUpLine}
              {!isBopisOrder && <li className="items-total">Shipping <strong>{shippingValue}</strong></li>}
              <li className="tax-total">Tax <strong>{this.formatAmount(totalTax)}</strong></li>
            </div>
          )}
          <li className="balance-total"><span>Total</span><strong>{this.formatAmount(grandTotal)}</strong></li>
        </ol>
      </div>
    );
  }
}

export {OrderLedger};
