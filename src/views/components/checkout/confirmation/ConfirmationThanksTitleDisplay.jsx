/**
* @module ConfirmationThanksTitleDisplay
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* Order confirmation page
*/

import React from 'react';
import {PropTypes} from 'prop-types';

if (DESKTOP) { // eslint-disable-line
  require('./_d.confirmation-thanks-display.scss');
} else {
  require('./_m.confirmation-thanks-display.scss');
}

class ConfirmationThanksTitleDisplay extends React.Component {
  static propTypes: {
    isOrderPending: PropTypes.bool.isRequired,
    emailAddress: PropTypes.string.isRequired,

    /* Three flags to indicates the type of order -shipping only, bopis only, mixed order- */
    /* These show an confirmation message */
    isShowShippingMessage: PropTypes.bool,
    isShowBopisMessage: PropTypes.bool,
    isShowMixedMessage: PropTypes.bool
  }

  render () {
    let {emailAddress, isOrderPending, isShowShippingMessage, isShowBopisMessage, isShowMixedMessage} = this.props;

    let confirmationMessage = '';
    if (isShowMixedMessage) {
      confirmationMessage = <p className="confirmation-email">
        You’ll receive emails confirming your pickup status and order info at <strong className="mixed-order-message">{emailAddress}</strong>.
        If a different email address was provided for pickup, status updates will be sent to that email instead.
      </p>;
    } else {
      confirmationMessage = <p className="confirmation-email">
        You’ll receive an email confirmation shortly with {isShowShippingMessage ? 'your order' : isShowBopisMessage && 'pickup'} info at <strong>{emailAddress}</strong>
      </p>;
    }

    return (<header className="confirmation-title">
      <h1>Thanks for your order!</h1>

      {isOrderPending && <p className="pending-notification">Your Children's Place order is currently pending payment approval.</p>}

      {confirmationMessage}
    </header>);
  }
}

export {ConfirmationThanksTitleDisplay};
