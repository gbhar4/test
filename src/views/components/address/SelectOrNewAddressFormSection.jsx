/**  @module SelectOrNewAddressFormSection
 * @summary A desktop form section for selecting an address from a dropdown of addresses; or adding a new address.
 *
 * Provides the user with a AddressFormSection,
 * an optional phoneNumber, an optional emialAddress,
 * an optional checkbox named setAsDefault, an optional checkbox named saveToAccount,
 * and an optional checkbox named "emailSignup.
 *
 * @author Ben
 * @author Florencia Acosta <facosta@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, FormSection} from 'redux-form';
import {CheckoutSectionTitleDisplay} from 'views/components/checkout/CheckoutSectionTitleDisplay.jsx';
import {FormValuesChangeTrigger} from 'reduxStore/util/FormValuesChangeTrigger.jsx';
import {AddressBookSelectContainer} from 'views/components/address/AddressBookSelectContainer';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {AddressFormSectionContainer} from './AddressFormSectionContainer';
import {SaveAndDefaultAddressBoxesFormPart} from './SaveAndDefaultAddressBoxesFormPart.jsx';

// note that we are extending FormSection (and not React.Component) just so that we can provide a default 'name' prop.
export class SelectOrNewAddressFormSection extends FormSection {
  static propTypes = {
    /** The list of addresses to choose from */
    addressBookEntries: AddressBookSelectContainer.propTypes.addressBookEntries,

    /** Flags if the selection dropdown should be disabled */
    isDisableAddressSelection: PropTypes.bool,

    /** Flags if 'set as default' checkbox should be shown */
    isShowSetAsDefault: PropTypes.bool.isRequired,
    /** Flags if 'save to account' checkbox should be shown */
    isShowSaveToAccount: PropTypes.bool.isRequired,
    /** Flags if 'set as default' checkbox should be disabled */
    isSetAsDefaultDisabled: PropTypes.bool,
    /** indicates the checkbox is always checked when my account is checked **/
    isAlwaysChecked: PropTypes.bool,
    /** Flags if 'save to account' checkbox should be disabled */
    isSaveToAccountDisabled: PropTypes.bool,

    /**
     * A callback to call whenever a change in the selected address is made.
     * Receives as a parameter the id of the selected address;
     * or null to indicate the "add new address" was selected
     */
    onAddressSelectionChange: PropTypes.func,

    /** see AddressFormSection.PropTypes.onStateZipOrLineChange  **/
    onStateZipOrLineChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    /** the default name of this form section */
    name: 'shipTo'
  }

  constructor (props, context) {
    super(props, context);
    this.state = {};
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
  }

  renderAddNewAddress () {
    let {
      onStateZipOrLineChange,
      isShowSaveToAccount, isShowSetAsDefault, isSaveToAccountDisabled, isSetAsDefaultDisabled,
      isAlwaysChecked
    } = this.props;

    return (<div className="container-form-add-new-address">
      <CheckoutSectionTitleDisplay title="Shipping Details" />
      <AddressFormSectionContainer onStateZipOrLineChange={onStateZipOrLineChange} isShowInternationalShipping isDisableCountry />
      <Field name="phoneNumber" component={LabeledInput} className="input-phone" title="Mobile Number" type="tel" />

      <SaveAndDefaultAddressBoxesFormPart className="save-set-address"
        isAlwaysChecked={isAlwaysChecked}
        isShowSaveToAccount={isShowSaveToAccount} isSaveToAccountDisabled={isSaveToAccountDisabled}
        isShowSetAsDefault={isShowSetAsDefault} isSetAsDefaultDisabled={isSetAsDefaultDisabled}
      />
    </div>);
  }

  render () {
    let {addressBookEntries, isDisableAddressSelection} = this.props;

    if (addressBookEntries.length === 0) {
      return this.renderAddNewAddress();
    }

    return (
      <div className="address-shipping">
        <FormValuesChangeTrigger adaptTo={'onFileAddressKey'} onChange={this.handleSelectionChange} />

        {addressBookEntries.length > 0 &&
          <Field component={AddressBookSelectContainer} name="onFileAddressKey" className="dropdown-address-book"
            title="Select from address book" addressBookEntries={addressBookEntries} disabled={isDisableAddressSelection} />
        }

        {this.state.isAddNew && this.renderAddNewAddress()}
      </div>
    );
  }

  handleSelectionChange (values) {
    this.setState({isAddNew: !values.onFileAddressKey});

    if (this.props.onAddressSelectionChange) {
      this.props.onAddressSelectionChange(values.onFileAddressKey);
    }
  }
}
