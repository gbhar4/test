/**
* @module BillingAddressDisplay
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* Module to show shipping address details
*/

import React from 'react';
import {PropTypes} from 'prop-types';
import {ContactInfoDisplay} from 'views/components/address/ContactInfoDisplay.jsx';

class BillingAddressDisplay extends React.Component {
  static propTypes = {
    address: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      addressLine1: PropTypes.string.isRequired,
      addressLine2: PropTypes.string,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      zipCode: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired
    }).isRequired
  }

  render () {
    let {address} = this.props;

    return (
      <section className="checkout-review-billing-address">
        <ContactInfoDisplay title="Billing Address" address={address} isShowAddress isShowCountry />
      </section>
    );
  }
}

export {BillingAddressDisplay};
