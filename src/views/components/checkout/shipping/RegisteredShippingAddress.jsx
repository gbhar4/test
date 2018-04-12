/**  @module RegisteredShippingAddress
 * @summary A component allowing a registered user to select an address, edit an address, or add an address.
 *
 * Note: this is not a form, instead it renders a few forms of the shipping part of the checkout process.
 *
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {SelectOrNewAddressFormSection} from 'views/components/address/SelectOrNewAddressFormSection.jsx';
import {ViewOrEditAddressForm} from 'views/components/address/ViewOrEditAddressForm.jsx';
// import {ViewOrEditAddressFormMobile} from 'views/components/address/ViewOrEditAddressFormMobile.jsx';
import {AddressBookSelect} from 'views/components/address/AddressBookSelect.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.shipping-registered.scss');
} else {
  require('./_m.shipping-registered.scss');
}

export class RegisteredShippingAddress extends React.Component {

  static propTypes = {
    /** A map of the saved addresses */
    addressBookEntries: AddressBookSelect.propTypes.addressBookEntries,

    /** see AddressFormSection.PropTypes.onStateZipOrLineChange  **/
    onStateZipOrLineChange: PropTypes.func.isRequired,

    /**
     * A callback to call whenever switching between the read-only and editing an address modes.
     * Will accept a single Boolean parameter that is true when entering edit mode
     * and is false when exiting the edit mode.
     */
    onEditModeChange: PropTypes.func
  }

  constructor (props) {
    super(props);

    this.state = {
      isEditing: false,
      isSetDefaultChecked: !this.props.addressBookEntries.length,
      selectedAddressKey: null        // null indicates that this value was not yet set by a call to handleAddressSelectionChange
    };

    this.handleEditModeChange = this.handleEditModeChange.bind(this);
    this.exitEditMode = this.handleEditModeChange.bind(this, false);
    this.handleAddressSelectionChange = this.handleAddressSelectionChange.bind(this);
    this.handleEditAddressSubmit = this.handleEditAddressSubmit.bind(this);
  }

  handleEditModeChange (isEditMode) {
    this.setState({isEditing: isEditMode});
    if (this.props.onEditModeChange) {
      this.props.onEditModeChange(isEditMode);
    }
  }

  handleAddressSelectionChange (addressKey) {
    this.setState({selectedAddressKey: addressKey});

    let selectedAddressBookEntry = this.props.addressBookEntries.find((entry) => { return entry.addressKey === addressKey; });
    if (selectedAddressBookEntry) {     // if user changed the selection but not to the "add new address" option
      // assume all fields changed
      this.props.onStateZipOrLineChange(selectedAddressBookEntry.address, {state: true, zipCode: true, addressLine1: true, addressLine2: true});
    }
  }

  handleEditAddressSubmit (values) {
    this.props.onEditAddressSubmit({...values, addressKey: this.state.selectedAddressKey});
  }

  render () {
    let {addressBookEntries, onStateZipOrLineChange} = this.props;
    let selectedAddressBookEntry = addressBookEntries.find((entry) => { return entry.addressKey === this.state.selectedAddressKey; });
    let viewOrEditForminitialValues = selectedAddressBookEntry && {
      address: selectedAddressBookEntry.address,
      emailAddress: selectedAddressBookEntry.emailAddress,
      phoneNumber: selectedAddressBookEntry.phoneNumber,
      setAsDefault: selectedAddressBookEntry.isDefault,
      saveToAccount: true
    };

    return (
      <div className="checkout-shipping-section checkout-registered-shipping-section">
        {
          // product has requested to remove the option to save to account bacause backend is ALWAYS saving the address to the addressbook
          // regardsless of this flag being set. to talk with 'product': disabled add to address checkbox to be checked always
        }
        <SelectOrNewAddressFormSection addressBookEntries={addressBookEntries}
          isSetAsDefaultDisabled={addressBookEntries.length === 0}
          isAlwaysChecked={this.state.isSetDefaultChecked}
          isDisableAddressSelection={this.state.isEditing} onAddressSelectionChange={this.handleAddressSelectionChange}
          onStateZipOrLineChange={onStateZipOrLineChange} isShowSetAsDefault isShowSaveToAccount />

        {/* Note: Due to a bug in redux-form 6.5.0 (see issue 2572)  we need to pass a fake prop called _workaround_
          that changes every time the initialValues prop changes, otherwise the the new initialValues do not propagate to the wrapped form component. */}
        {this.state.selectedAddressKey &&
          <ViewOrEditAddressForm title="Shipping Details" _workaround_={this.state.selectedAddressKey}
            isHavePhoneField onChangeEditMode={this.handleEditModeChange} initialValues={viewOrEditForminitialValues}
            onSubmit={this.handleEditAddressSubmit} onSubmitSuccess={this.exitEditMode} isEditing={this.state.isEditing}
            isShowSetAsDefault isShowSaveToAccount={false} onStateZipOrLineChange={onStateZipOrLineChange} />
        }
      </div>
    );
  }
}
