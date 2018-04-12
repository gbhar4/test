/**
 * @module CheckoutOrderSummary
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * Shows the summary of the order during checkout, including ledger and footer
 * with 'Submit Order' and 'PayPal' buttons.
 *
 * Usage:
 *
 *  .checkout-order-summary
 *
 * Uses
 *  <LedgerContainer />
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {LedgerContainer} from './LedgerContainer.js';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';
import {TermAndConditions} from 'views/components/checkout/TermAndConditions.jsx';
import {CustomSpinnerIcon} from 'views/components/common/Spinner.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.order-summary.scss');
} else { // eslint-disable-line
  require('./_m.order-summary.scss');
}

export class CheckoutOrderSummary extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool,

    /** Flags if PayPal payment is enabled. */
    isPayPalEnabled: PropTypes.bool.isRequired,

    /** flags to disable the 'next' button (usually since in the middle of submitting or other updates) */
    disableNext: PropTypes.bool,

    /**
     * Flags if the submit order should be rendered (it shouldn't be rendered,
     * for example, at the beginning of the CheckOut process)
     */
    showSubmitOrderButton: PropTypes.bool.isRequired
  }

  render () {
    let {isMobile, isPayPalEnabled, showSubmitOrderButton, disableNext} = this.props;
    let submitButtonText = disableNext ? <CustomSpinnerIcon className="submit-order-spinner" /> : 'Submit Order';
    return (
      <div className="checkout-order-summary">
        <LedgerContainer isCondense={false} isShowUndefinedTax isShowShipping />

        {(showSubmitOrderButton || isPayPalEnabled) &&
          <div className="button-container">
            {!isMobile && showSubmitOrderButton && <button className="button-primary" onClick={this.props.onSubmit} disabled={disableNext}>{submitButtonText}</button>}
            {isPayPalEnabled && <button className="button-secondary">Pay With Paypal</button>}
            {!isMobile && <TermAndConditions />}

            <ContentSlot contentSlotName="order-summary-espot" className="checkout-order-summary-espot" />
          </div>
        }
      </div>
    );
  }
}
