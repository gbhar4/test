/**
 * @module CartSummary
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * Shows the summary of the shopping cart, including ledger, closeness
 * qualifier message and footer with checkout and Paypal buttons.
 *
 * Style (ClassName) Elements description/enumeration
 *  .checkout-summary
 *
 * Uses
 *  <LedgerContainer />
 *  <ClosenessQualifierMessageContainer />
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName.js';
import {LedgerContainer} from 'views/components/orderSummary/LedgerContainer.js';
import {ClosenessQualifierMessageContainer} from './ClosenessQualifierMessageContainer.js';
import {PaypalButtonContainer} from 'views/components/orderSummary/PaypalButtonContainer.js';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';

class CartSummary extends React.Component {
  static propTypes = {
    /** Flags if PayPal payment is enabled. */
    isPayPalEnabled: PropTypes.bool.isRequired,

    /** Flags if closeness qualifier is enabled. */
    isClosenessQualifier: PropTypes.bool.isRequired,

    /**
     * Flag if the total prop will be receiving an estimated total or a final
     * total.
     */
    isTotalEstimated: PropTypes.bool.isRequired,

    /** callback to open the authentication login modal (should accept a Boolean saying if open ) */
    onStartCheckout: PropTypes.func.isRequired,

    /** Prop info the screen in action */
    isMobile: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props);
    this.state = {
      startCheckoutError: null
    };
    this.handleStartCheckout = this.handleStartCheckout.bind(this);
  }

  handleStartCheckout (event) {
    this.props.onStartCheckout().catch((err) => {
      this.setState({
        startCheckoutError: err.errorMessages._error
      });
    });
  }

  render () {
    let {isMobile, isPayPalEnabled, isClosenessQualifier, isTotalEstimated} = this.props;
    let {startCheckoutError} = this.state;
    let containerButtonsClass = cssClassName('button-container ', {'container-fixed': isMobile});

    return (
      <div className="checkout-order-summary">
        <LedgerContainer isCondense={false} isShowShipping isShowUndefinedTax={false} isTotalEstimated={isTotalEstimated} />
        {isClosenessQualifier && <ClosenessQualifierMessageContainer />}

        <div className={containerButtonsClass}>
          <div className="checkout-button-container">
            {startCheckoutError && <ErrorMessage error={startCheckoutError} />}
            <button type="button" onClick={this.handleStartCheckout} className="button-primary button-checkout">Checkout</button>
          </div>
          {isPayPalEnabled && <PaypalButtonContainer className="button-secondary button-pay-with-paypal" isSkipPaymentEnabled />}
        </div>
        <ContentSlot contentSlotName="bag_ledger_banner" className="message-free-shipping" />
      </div>
    );
  }
}

export {CartSummary};
