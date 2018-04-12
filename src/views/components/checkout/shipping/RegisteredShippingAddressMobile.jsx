/**  @module RegisteredShippingAddressMobile
 * @summary A component allowing a registered user to select an address, edit an address, or add an address.
 *
 * https://projects.invisionapp.com/share/T39T1TD2F#/screens/207731136 (pages 8 - 11)
 *
 * @author Agu
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {AddressBookSelectModal} from 'views/components/address/AddressBookSelectModal.jsx';
import {AddressBookSelect} from 'views/components/address/AddressBookSelect.jsx';
import {SimpleShippingAddress} from 'views/components/checkout/shipping/SimpleShippingAddress.jsx';

import {CheckoutSectionTitleDisplay} from 'views/components/checkout/CheckoutSectionTitleDisplay.jsx';
import {ContactInfoDisplay} from 'views/components/address/ContactInfoDisplay.jsx';
import {getAdaptiveFormPart} from 'reduxStore/util/adaptiveFormPart.js';

if (DESKTOP) { // eslint-disable-line
  require('./_d.shipping-registered.scss');
} else {
  require('./_m.shipping-registered.scss');
}

let RegisteredShippingFormPart = getAdaptiveFormPart((props) => {
  let {addressBookEntries} = props;
  let selectedAddressBookEntry = addressBookEntries.find((entry) => { return entry.addressKey === props.addressKey; });
  let viewOrEditFormInitialValues = selectedAddressBookEntry && {
    address: selectedAddressBookEntry.address,
    emailAddress: selectedAddressBookEntry.emailAddress,
    phoneNumber: selectedAddressBookEntry.phoneNumber
  };

  return (!viewOrEditFormInitialValues
  ? <SimpleShippingAddress onStateZipOrLineChange={props.onStateZipOrLineChange} isShowSaveToAccount isShowSetAsDefault />
  : <div className="checkout-shipping-section checkout-registered-shipping-section">
    {/* display of selected value, and cta to open selection modal */}

    <div className="address-shipping-view">
      <div className="container-shipping-section-title">
        <CheckoutSectionTitleDisplay title="Shipping Details" />
        <button type="button" aria-label="edit" className="button-edit-address"
          onClick={props.handleOpenAddressBookModal}>Edit</button>
      </div>

      <button type="button" className="button-add-address" onClick={props.handleNewAddressClick}>+ Add new address</button>

      {/** first render doesn't have initial values */}
      <ContactInfoDisplay address={viewOrEditFormInitialValues.address} isShowAddress isShowPhone
        phoneNumber={viewOrEditFormInitialValues.phoneNumber} />
    </div>

    {/* Address book modal */}
    {props.isAddressBookOpen && <AddressBookSelectModal
      isDisableCountry
      isAdding={props.isAddNewAddress}
      defaultCountry={props.defaultCountry}
      isShowSetAsDefault isShowSaveToAccount isHavePhoneField
      addressBookEntries={addressBookEntries}
      selectedAddressKey={props.addressKey}
      onClose={props.handleExitAddressBookModal}
      onAddressSelectionChange={props.handleAddressSelectionChange}
      onEditAddressSubmit={props.onEditAddressSubmit}
      onNewAddressSubmit={props.onNewAddressSubmit}
    />}
  </div>);
});

export class RegisteredShippingAddressMobile extends React.Component {
  static propTypes = {
    /** A map of the saved addresses */
    addressBookEntries: AddressBookSelect.propTypes.addressBookEntries,

    /** see AddressFormSection.PropTypes.onStateZipOrLineChange  **/
    onStateZipOrLineChange: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);

    this.state = {
      isAddressBookOpen: false,
      isAddNew: false,
      selectedAddressKey: this.props.selectedAddressKey
    };

    this.handleAddressBookModalChange = this.handleAddressBookModalChange.bind(this);
    this.handleOpenAddressBookModal = this.handleAddressBookModalChange.bind(this, true);
    this.handleExitAddressBookModal = this.handleAddressBookModalChange.bind(this, false);
    this.handleNewAddressClick = this.handleNewAddressClick.bind(this, false);

    this.mapValuesToAddressSelectionProps = this.mapValuesToAddressSelectionProps.bind(this);
    this.handleAddressSelectionChange = this.handleAddressSelectionChange.bind(this);
  }

  handleNewAddressClick () {
    this.setState({
      isAddressBookOpen: true,
      isAddNewAddress: true
    });
  }

  handleAddressBookModalChange (isOpen) {
    this.setState({isAddressBookOpen: isOpen, isAddNewAddress: false});
  }

  mapValuesToAddressSelectionProps (values) {
    let addressKey = values.shipTo && values.shipTo.onFileAddressKey;

    return {
      handleOpenAddressBookModal: this.handleOpenAddressBookModal,
      handleExitAddressBookModal: this.handleExitAddressBookModal,
      handleAddressSelectionChange: this.handleAddressSelectionChange,
      handleNewAddressClick: this.handleNewAddressClick,

      addressKey: addressKey
    };
  }

  /** Observer to refresh shipping methods selection -
  * it's shared between desktop and mobile so there's a little bit of repetition
  * but I wanted to keep mobile and desktop completely disconnected
  * on this case to simplify code
  */
  handleAddressSelectionChange (addressKey) {
    if (addressKey !== this.state.selectedAddressKey) {
      this.props.change('shipTo.onFileAddressKey', addressKey);
    }

    let selectedAddressBookEntry = this.props.addressBookEntries.find((entry) => { return entry.addressKey === addressKey; });

    if (selectedAddressBookEntry) {     // if user did not select the "add new address option"
      // assume all fields changed
      this.props.onStateZipOrLineChange(selectedAddressBookEntry.address, {state: true, zipCode: true, addressLine1: true, addressLine2: true});
    }

    this.setState({
      isAddressBookOpen: false,
      isAddNewAddress: false,
      selectedAddressKey: addressKey
    });
  }

  render () {
    return (<RegisteredShippingFormPart adaptTo={'shipTo.onFileAddressKey'}
      mapValuesToProps={this.mapValuesToAddressSelectionProps}
      {...this.props}
      {...this.state} />);
  }
}
