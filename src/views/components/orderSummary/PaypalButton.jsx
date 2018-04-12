/**
/** @module PaypalButton
 * @summary Component that render the Paypal button and yours modal.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 * REVIEW: review the open modal when the Paypal button was pressed.
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {ModalConfirmPaypalPayment} from 'views/components/checkout/billing/ModalConfirmPaypalPayment.jsx';
import {ModalPaypalPayment} from 'views/components/checkout/billing/ModalPaypalPayment.jsx';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import cssClassName from 'util/viewUtil/cssClassName.js';

class PaypalButton extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,

    /** callback to start the paypal flow */
    onStartPaypalPaypal: PropTypes.func.isRequired,

    isPaypalModalOpened: PropTypes.bool.isRequired,
    paypalModalSettings: PropTypes.shape({
      centinelPostbackUrl: PropTypes.string.isRequired,
      centinelTermsUrl: PropTypes.string.isRequired,
      centinelPayload: PropTypes.string.isRequired,
      centinelOrderId: PropTypes.string.isRequired
    }),

    /** error message received from paypal post-back */
    error: PropTypes.string,

    /** optional props for styling */
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    className: PropTypes.string,

    /* indicates the user can skip paypal payment (because it was already selected - user came back from review to billing and hit review again) */
    isSkipPaymentEnabled: PropTypes.bool.isRequired,

    /** callback to use when skip is enabled */
    skipPaypalPayment: PropTypes.func
  }

  constructor (props) {
    super(props);

    this.state = {
      isConfirmPaypalPayment: false,
      error: props.error
    };

    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleOpenClick = this.handleConfirmPaypalToggle.bind(this);
    this.handleStartPaypalPaypal = this.handleStartPaypalPaypal.bind(this);
    this.handleAbandonPaypal = this.handleAbandonPaypal.bind(this);
  }

  componentWillUnmount () {
    this.props.setInitPayPalPayment(false);
  }

  handleConfirmPaypalToggle () {
    this.props.setInitPayPalPayment(true);
    if (this.props.isSkipPaymentEnabled) {
      return this.props.skipPaypalPayment();
    }

    this.setState({
      isConfirmPaypalPayment: !this.state.isConfirmPaypalPayment,
      error: null
    });
  }

  handleCloseClick (event) {
    this.handleConfirmPaypalToggle();
    this.props.onClose(event);
  }

  handleStartPaypalPaypal (event) {
    this.handleConfirmPaypalToggle();

    this.props.onStartPaypalPaypal(event).catch((err) => {
      if (err) {
        this.setState({
          error: err.errors._error
        });
      }
    });
  }

  handleAbandonPaypal () {
    this.props.onAbandonPaypal();
  }

  render () {
    let {isConfirmPaypalPayment} = this.state;
    let {isPaypalModalOpened, paypalModalSettings, text, isMobile, className, isAddToBagModal} = this.props;
    let {error} = this.state;
    let containerClassName = cssClassName('paypal-button-container ', {'service-error': !!error});
    let textPaypalDefault = <span>Pay with <img src="/wcsstore/static/images/paypal-button-logo-100x26.png" alt="PayPal" /> </span>;

    return (
      <div className={containerClassName}>
        {(error && !isAddToBagModal) && <ErrorMessage error={error} />}
        <button onClick={this.handleOpenClick} className={className || 'button-secondary'}>{text || textPaypalDefault}</button>
        {(error && isAddToBagModal) && <ErrorMessage error={error} />}
        {isConfirmPaypalPayment && <ModalConfirmPaypalPayment isMobile={isMobile} onStartPaypalPayment={this.handleStartPaypalPaypal} onClose={this.handleCloseClick} />}
        {isPaypalModalOpened && <ModalPaypalPayment settings={paypalModalSettings} onClose={this.handleAbandonPaypal} />}
      </div>
    );
  }
}

export {PaypalButton};
