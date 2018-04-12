/**
 * @module Ledger
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * Shows the summary of price totals, so that the user can gain an understanding
 * of how much the final order will cost. This component has two variations:
 * full -for shopping cart page- and condensed -for mini cart drawer-.
 * The condensed variation only includes subtotal and total savings amounts, and
 * the full variation includes the following totals:
 *  * number of items
 *  * subtotal
 *  * applied coupons
 *  * shipping by fullfilment center (cost of shipping for each store, or
 *    online)
 *  * final estimated
 *  * savings
 *
 * Style (ClassName) Elements description/enumeration
 *  .order-summary: main class for the order summary list
 *
 * Uses
 *  -
 */
import React from 'react';
import {PropTypes} from 'prop-types';

if (DESKTOP) { // eslint-disable-line
  require('./_d.cart-ledger.scss');
}

export class Ledger extends React.Component {
  static propTypes = {

    /** Flags if to use condensed version for mini-bag use. */
    isCondense: PropTypes.bool.isRequired,

    /** Number of items in the cart. */
    itemsCount: PropTypes.number.isRequired,

    /** Total estimation, before applying taxes */
    grandTotal: PropTypes.number,
    /** Flag if the total prop will be receiving an estimated total or a final total */
    // FIXME: we should have a single "Estimated" flag and reuse it accordanly across all estimated values
    isTotalEstimated: PropTypes.bool.isRequired,

    /** Total savings applied in the cart */
    savingsTotal: PropTypes.number,

    /** Subtotal price of the items, before taxes, shipping, etc. */
    subTotal: PropTypes.number.isRequired,
    /**
     * Total cost of taxes. If it's value is undefined, corresponding line will
     * only be shown if the isShowUndefinedTax prop is true.
     */
    taxesTotal: PropTypes.number,

    /** Total discount coming from coupons. */
    couponsTotal: PropTypes.number,
    /**
     * Total cost of shipping. If it's value is 0, the 'Free' copy will be
     * shown. If it's undefined, corresponding line won't be rendered.
     */
    shippingTotal: PropTypes.number,
    /**
     * Total discount of gift cards applied. If it's value is falsy,
     * corresponding line won't be rendered.
     */
    giftCardsTotal: PropTypes.number,

    /**
     * Total cost of gift wrapping. If it's value is falsy, corresponding line
     * won't be rendered.
     */
    giftWrappingTotal: PropTypes.number,

    /**
     * Map of total costs by fulfillment center (ex.: online, store A, store B)
     */
    totalsByFullfillmentCenterMap: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired
    })),

    /** Flags if the tax line should be rendered even when the taxesTotal prop value is undefined */
    isShowUndefinedTax: PropTypes.bool,
    /** Flag if shipping should be shown in the ledger */
    isShowShipping: PropTypes.bool,
    /** Flags if the order has items for shipping */
    isOrderHasShipping: PropTypes.bool.isRequired,
    /** This is used to display the correct currency symbol */
    currencySymbol: PropTypes.string.isRequired,

    orderBalanceTotal: PropTypes.number
  }

  renderFull () {
    let {itemsCount, grandTotal, savingsTotal, couponsTotal, subTotal, shippingTotal,
      giftWrappingTotal, giftCardsTotal, taxesTotal, isShowUndefinedTax,
      isTotalEstimated, isShowShipping, isOrderHasShipping, currencySymbol, orderBalanceTotal} = this.props;

    return (
      <ol className="order-summary">
        <li className="items-total">Items ({itemsCount}) <strong>{currencySymbol + subTotal.toFixed(2)}</strong></li>

        {giftWrappingTotal > 0 && <li className="gift-wrap-total">Gift Service <strong>{currencySymbol + giftWrappingTotal.toFixed(2)}</strong></li>}

        {savingsTotal ? <li className="savings-total">Promotions <strong>-{currencySymbol + savingsTotal.toFixed(2)}</strong></li> : null}

        {couponsTotal ? <li className="coupons-total">Coupon(s) <strong>-{currencySymbol + couponsTotal.toFixed(2)}</strong></li> : null}

        {isShowShipping && isOrderHasShipping &&
          <li className="shipping-total">Shipping <strong>
            {shippingTotal !== undefined ? (shippingTotal > 0 ? currencySymbol + [shippingTotal.toFixed(2)] : 'Free') : '-'}
          </strong></li>
        }

        {(!isNaN(taxesTotal) || isShowUndefinedTax) &&
          <li className="tax-total">{isTotalEstimated && 'Estimated'} Tax <strong>{isNaN(taxesTotal) ? '-' : currencySymbol + [taxesTotal.toFixed(2)]}</strong></li>
        }

        {giftCardsTotal > 0 ? [
          <li className="estimated-total">
            {isTotalEstimated && <span>Estimated Total</span>}
            {!isTotalEstimated && <span>Total</span>}
            <strong>{currencySymbol + grandTotal.toFixed(2)}</strong>
          </li>,
          <li className="giftcards-total">Gift Card(s) <strong>-{currencySymbol + giftCardsTotal.toFixed(2)}</strong></li>
        ] : null}

        <li className="balance-total">
          <span>{giftCardsTotal ? 'Balance' : isTotalEstimated ? 'Estimated Total' : 'Total'}</span>
          <strong>{currencySymbol + orderBalanceTotal.toFixed(2)}</strong>
        </li>
      </ol>
    );
  }

  renderCondensed () {
    let {subTotalWithDiscounts, currencySymbol} = this.props;

    return (
      <ol className="order-summary-overlay">
        <li className="subtotal">Subtotal <span>{currencySymbol + subTotalWithDiscounts.toFixed(2)}</span></li>
      </ol>
    );
  }

  render () {
    let {isCondense} = this.props;

    if (isCondense) {
      return this.renderCondensed();
    }
    return this.renderFull();
  }
}
