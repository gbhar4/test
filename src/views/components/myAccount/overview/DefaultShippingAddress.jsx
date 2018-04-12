/**
* @module DefaultShippingAddress
* @summary Module to show default shipping address in My Account
*
* @author Florencia Acosta <facosta@minutentag.com>
* @author Miguel <malvarez@minutentag.com>
*
*/
import React from 'react';
import {PropTypes} from 'prop-types';
import {ContactInfoDisplay} from 'views/components/address/ContactInfoDisplay.jsx';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';

class DefaultShippingAddress extends React.Component {
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
    }),
    phoneNumber: PropTypes.string
  }

  render () {
    let {addressId, address, phoneNumber} = this.props;

    return (
      <section className="default-shipping-address-container">
        <strong className="default-shipping-address-title">Default Shipping Address</strong>
        {address && phoneNumber ? (
          <div>
            <ContactInfoDisplay address={address} phoneNumber={phoneNumber} isShowAddress isShowPhone />

            <HyperLink destination={MY_ACCOUNT_SECTIONS.addressBook.subSections.editAddress} className="button-primary button-update"
              pathSuffix={addressId} aria-label="Update shipping address">Update</HyperLink>
          </div>
        ) : (
          <div>
            <span className="empty-shipping-address-title">Save A Shipping Address</span>
            <p className="empty-shipping-address-message">You can save up to 5 shipping addresses in your Address Book.</p>

            <HyperLink destination={MY_ACCOUNT_SECTIONS.addressBook.subSections.addNewAddress} className="button-primary button-add-address"
              aria-label="Update shipping address">Add an Address</HyperLink>
          </div>
        )}
      </section>
    );
  }
}

export {DefaultShippingAddress};
