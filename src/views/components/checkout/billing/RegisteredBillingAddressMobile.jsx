/**  @module RegisteredBillingAddressMobile
 * @summary A component allowing a registered user to select an address, edit an address, or add an address.
 *
 * https://projects.invisionapp.com/share/T39T1TD2F#/screens/207731136 (pages 8 - 11)
 *
 * @author Agu
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, FormSection} from 'redux-form';
import {AddressBookSelectModal} from 'views/components/address/AddressBookSelectModal.jsx';
import {AddressBookSelect} from 'views/components/address/AddressBookSelect.jsx';
import {AddressFormSectionContainer} from 'views/components/address/AddressFormSectionContainer.js';
import {LabeledCheckbox} from 'views/components/common/form/LabeledCheckbox.jsx';

import {ContactInfoDisplay} from 'views/components/address/ContactInfoDisplay.jsx';
import {getAdaptiveFormPart} from 'reduxStore/util/adaptiveFormPart.js';

let SameAsShippingOrBillingAddressFormPart = getAdaptiveFormPart((props) => {
  let {addressBookEntries, currentShippingDetails} = props;
  let selectedAddressBookEntry = addressBookEntries.find((entry) => { return entry.addressKey === props.addressKey; });
  let viewOrEditFormInitialValues = selectedAddressBookEntry && {
    address: selectedAddressBookEntry.address,
    emailAddress: selectedAddressBookEntry.emailAddress,
    phoneNumber: selectedAddressBookEntry.phoneNumber
  };

  return props.isSameAsShipping
    ? <ContactInfoDisplay address={currentShippingDetails.address} isShowAddress isShowPhone phoneNumber={currentShippingDetails.phoneNumber} />
    : !viewOrEditFormInitialValues
      ? <AddressFormSectionContainer />
      : <div className="address-billing-view">
        <div className="container-billing-section-title">
          <button type="button" aria-label="edit" className="button-edit-address"
            onClick={props.handleOpenAddressBookModal}>Edit</button>
        </div>

        <button type="button" className="button-add-address" onClick={props.handleNewAddressClick}>+ Add new address</button>

        {/** first render doesn't have initial values */}
        <ContactInfoDisplay address={viewOrEditFormInitialValues.address} isShowAddress isShowPhone
          phoneNumber={viewOrEditFormInitialValues.phoneNumber} />

          {/* Address book modal */}
          {props.isAddressBookOpen && <AddressBookSelectModal
            name="address"
            title="Billing Address"
            submitButtonText="Select this billing address"
            isAdding={props.isAddNewAddress}
            defaultCountry={props.defaultCountry}
            addressBookEntries={addressBookEntries}
            selectedAddressKey={props.addressKey}
            onClose={props.handleExitAddressBookModal}
            onAddressSelectionChange={props.handleAddressSelectionChange}
            onEditAddressSubmit={props.onEditAddressSubmit}
            onNewAddressSubmit={props.onNewAddressSubmit}
          />}
      </div>;
});

let RegisteredBillingFormPart = getAdaptiveFormPart((props) => {
  let {isSameAsShippingEnabled, mapValuesToSameAsShippingViewProps, ...otherProps} = props;

  return (<div className="checkout-shipping-section checkout-registered-shipping-section">
    <h2 className="title-billing-address">Billing Address</h2>

    <FormSection name="address" className="select-address-billing">
      {isSameAsShippingEnabled && <Field component={LabeledCheckbox} name="sameAsShipping" value="1" title="Same as shipping address" className="checkbox-same-shipping" />}
    </FormSection>

    <SameAsShippingOrBillingAddressFormPart adaptTo="address.sameAsShipping" mapValuesToProps={mapValuesToSameAsShippingViewProps} {...otherProps} />
  </div>);
});

export class RegisteredBillingAddressMobile extends React.Component {
  static propTypes = {

    isSameAsShippingEnabled: PropTypes.bool,

    /** the selected shipping address details. Required if isSameAsShippingEnabled is true */
    currentShippingDetails: PropTypes.shape({
      address: ContactInfoDisplay.propTypes.address.isRequired,
      phoneNumber: PropTypes.string
    }),

    // FIXME: the prop types below are a partial joke

    /** A map of the saved addresses */
    addressBookEntries: AddressBookSelect.propTypes.addressBookEntries,
    change: PropTypes.func
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
    this.mapValuesToSameAsShippingViewProps = this.mapValuesToSameAsShippingViewProps.bind(this);

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
    let addressKey = values.address && values.address.onFileAddressKey;

    return {
      handleOpenAddressBookModal: this.handleOpenAddressBookModal,
      handleExitAddressBookModal: this.handleExitAddressBookModal,
      handleAddressSelectionChange: this.handleAddressSelectionChange,
      handleNewAddressClick: this.handleNewAddressClick,
      mapValuesToSameAsShippingViewProps: this.mapValuesToSameAsShippingViewProps,

      addressKey: addressKey
    };
  }

  mapValuesToSameAsShippingViewProps (values) {
    return {
      isSameAsShipping: values.sameAsShipping || (values.address && values.address.sameAsShipping)
    };
  }

  /** Observer to refresh shipping methods selection -
  * it's shared between desktop and mobile so there's a little bit of repetition
  * but I wanted to keep mobile and desktop completely disconnected
  * on this case to simplify code
  */
  handleAddressSelectionChange (addressKey) {
    this.props.change && this.props.change('address.onFileAddressKey', addressKey);

    let selectedAddressBookEntry = this.props.addressBookEntries.find((entry) => { return entry.addressKey === addressKey; });

    if (selectedAddressBookEntry) {
      let {address} = selectedAddressBookEntry;

      if (address.state !== this.selectedState) {
        this.selectedState = address.state;
      }

      if (address.zipCode !== this.selectedZipCode) {
        this.selectedZipCode = address.zipCode;
      }

      if (addressKey !== this.state.selectedAddressKey) {
        this.setState({isAddressBookOpen: false, isAddNewAddress: false});
      }
    }

    this.setState({
      isAddressBookOpen: false,
      isAddNewAddress: false,
      selectedAddressKey: addressKey
    });
  }

  render () {
    return (<RegisteredBillingFormPart adaptTo={'address.onFileAddressKey'}
      mapValuesToProps={this.mapValuesToAddressSelectionProps}
      {...this.props} {...this.state} />);
  }
}
