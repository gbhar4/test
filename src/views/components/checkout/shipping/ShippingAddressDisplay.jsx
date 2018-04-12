/**
* @module ShippingAddressDisplay
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* Module to show shipping address details
*
* Usage:
*  var ShippingAddressDisplay = require("./ShippingAddressDisplay.jsx");
*
* @example
* <code>
*   <ShippingAddressDisplay address=[object] />
* </code>
*
* Component Props description/enumeration:
*  @param {object} person: the additional pickup person details
*
* Style (ClassName) Elements description/enumeration
*  checkout-review-shipping-address
*/

import React from 'react';
import {ContactInfoDisplay} from 'views/components/address/ContactInfoDisplay.jsx';

class ShippingAddressDisplay extends React.Component {
  static propTypes = {
    address: ContactInfoDisplay.propTypes.address,
    emailAddress: ContactInfoDisplay.propTypes.emailAddress,
    phoneNumber: ContactInfoDisplay.propTypes.phoneNumber
  }

  render () {
    let {address, emailAddress, phoneNumber} = this.props;

    return (
      <section className="checkout-review-shipping-address">
        <ContactInfoDisplay title="Shipping Address" address={address} emailAddress={emailAddress}
          phoneNumber={phoneNumber} isShowAddress isShowCountry isShowPhone isShowEmail />
      </section>
    );
  }
}

export {ShippingAddressDisplay};
