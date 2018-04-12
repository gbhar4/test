/**
* @module PickUpAlternateDisplay
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* Module to show altenate pickup person details
*/
import React from 'react';
import {PropTypes} from 'prop-types';
import {ContactInfoDisplay} from 'views/components/address/ContactInfoDisplay.jsx';

class PickUpAlternateDisplay extends React.Component {
  /** the alternative pickup person details */
  static propTypes = {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    emailAddress: PropTypes.string.isRequired,
    isHasPickUpAlternatePerson: PropTypes.bool.isRequired
  }
  render () {
    let {emailAddress, isHasPickUpAlternatePerson, ...address} = this.props;

    return (
      isHasPickUpAlternatePerson && <section className="checkout-review-pickup-alternate">
        <ContactInfoDisplay title="Alternative Pickup Contact" address={address} emailAddress={emailAddress} className="contact-pickup" isShowEmail />
      </section>
    );
  }
}

export {PickUpAlternateDisplay};
