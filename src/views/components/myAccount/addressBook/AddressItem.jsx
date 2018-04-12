/**
 * @module AddressItem
 * Show an address item inside the address book list, with CTAs for editing,
 * deleting and setting as default address.
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {ContactInfoDisplay} from 'views/components/address/ContactInfoDisplay.jsx';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';

const ADDRESS_BOOK_ENTRY_PROPTYPE = PropTypes.shape({
  addressId: PropTypes.string.isRequired,
  address: ContactInfoDisplay.propTypes.address.isRequired,
  phoneNumber: PropTypes.string,
  isDefault: PropTypes.bool.isRequired
});

class AddressItem extends React.Component {
  static propTypes = {
    /** The list of addresses to choose from */
    addressBookEntry: ADDRESS_BOOK_ENTRY_PROPTYPE.isRequired,

    /**
     * callback to handle request to delete an address item. It should accept a
     * single parameter that is the addressBookEntry id.
     */
    onDeleteItem: PropTypes.func.isRequired,

    /**
    * callback to handle request to mark an address as default. It should accept
    * a single parameter that is the addressBookEntry id.
    */
    onSetAsDefaultAddress: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);

    this.handleDeleteItem = this.handleDeleteItem.bind(this);
    this.handleSetAsDefaultAddress = this.handleSetAsDefaultAddress.bind(this);
  }

  handleDeleteItem () {
    return this.props.onDeleteItem(this.props.addressBookEntry);
  }

  handleSetAsDefaultAddress () {
    return this.props.onSetAsDefaultAddress(this.props.addressBookEntry);
  }

  render () {
    let {addressBookEntry} = this.props;
    return (
      <li className="address-item-container">
        <ContactInfoDisplay address={addressBookEntry.address} phoneNumber={addressBookEntry.phoneNumber} isShowAddress isShowPhone />
        <button className="button-close" onClick={this.handleDeleteItem}></button>

        {addressBookEntry.isDefault
          ? <span className="default-shipping-method">Default Shipping Address</span>
          : <button className="button-default-shipping-method" onClick={this.handleSetAsDefaultAddress}>Make Default</button>
        }

        <HyperLink destination={MY_ACCOUNT_SECTIONS.addressBook.subSections.editAddress}
          pathSuffix={addressBookEntry.addressId} className="edit">Edit</HyperLink>
      </li>
    );
  }
}

export {AddressItem, ADDRESS_BOOK_ENTRY_PROPTYPE};
