/**
* @module PaymentMethodDisplay
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* Module to show used payment method (cc or paypal)
*
* Style (ClassName) Elements description/enumeration
*  checkout-review-billing-address
*/

import React from 'react';
import {PropTypes} from 'prop-types';

if (DESKTOP) { // eslint-disable-line
  require('./_d.payment-method.scss');
} else {
  require('./_m.payment-method.scss');
}

class PaymentMethodDisplay extends React.Component {
  static propTypes = {
    /** path to the icon image */
    icon: PropTypes.string.isRequired,

    /** enum ('visa', "mastercard"), not adding as enum because we're missing specs */
    cardType: PropTypes.string.isRequired,

    /** ending in numbers (or email address for paypal) */
    message: PropTypes.string.isRequired
  }

  render () {
    let {icon, cardType, message} = this.props;

    return (
      <section className="checkout-review-payment-method">
        <strong className="title-payment-method">Payment Method</strong>

        <p className="card-info">
          <img className="card-info-figure" src={icon} alt={cardType} />
          {message}
        </p>
      </section>
    );
  }
}

export {PaymentMethodDisplay};
