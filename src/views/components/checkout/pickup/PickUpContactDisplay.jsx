/**
* @module PickUpContactDisplay
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* Form to enter additional pickup person details
*/
import React from 'react';
import {PropTypes} from 'prop-types';
import {ContactInfoDisplay} from 'views/components/address/ContactInfoDisplay.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.checkout-pickup-display.scss');
} else {  // eslint-disable-line
  require('./_m.checkout-pickup-display.scss');
}

export class PickUpContactDisplay extends React.Component {
  static propTypes = {
    /** the pickup person details */
    contactDetails: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      emailAddress: PropTypes.string,
      phoneNumber: PropTypes.string.isRequired
    }).isRequired
  }

  render () {
    let { contactDetails: {emailAddress, phoneNumber, ...address} } = this.props;
    return (
      <section className="checkout-review-pickup-person">
        <ContactInfoDisplay title="Pickup Contact" address={address} emailAddress={emailAddress}
          phoneNumber={phoneNumber} isShowPhone isShowEmail />
        <aside className="checkout-review-pickup-note">A government issued ID is required to pick up the order.</aside>
      </section>
    );
  }
}
