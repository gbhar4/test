/**  @module SelectOrNewBillingAddressFormPart
 * @summary A form part for selecting an address from a dropdown of addresses or adding a new address.
 *
 * Provides the user with a AddressFormSection,
 *
 * @author Agu
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, FormSection} from 'redux-form';
import {AddressBookSelectContainer} from 'views/components/address/AddressBookSelectContainer';
import {AddressFormSectionContainer} from './AddressFormSectionContainer';
import {LabeledCheckbox} from 'views/components/common/form/LabeledCheckbox.jsx';
import {ContactInfoDisplay} from 'views/components/address/ContactInfoDisplay.jsx';
import {getAdaptiveFormPart} from 'reduxStore/util/adaptiveFormPart';
import {ADDRESS_PROP_TYPES_SHAPE} from 'views/components/common/propTypes/addressPropTypes';

export class SelectOrNewBillingAddressFormPart extends React.Component {
  static propTypes = {
    /** The list of addresses to choose from */
    addressBookEntries: AddressBookSelectContainer.propTypes.addressBookEntries,

    /**
     * A callback to call whenever a change in the selected address is made.
     * Receives as a parameter the id of the selected address;
     * or null to indicate the "add new address" was selected
     */
    onAddressSelectionChange: PropTypes.func,

    /**
    * A callback to call whenever a change in the same-as-shipping checkbox
    */
    onSameAsShippingChange: PropTypes.func,

    /** bopis orders don't require shipping, so "Same as shipping address" shouldn't be visible */
    isSameAsShippingEnabled: PropTypes.bool,

    /** the selected shipping address details.
     * Required if the prop isSameAsShippingEnabled is true */
    currentShippingDetails: PropTypes.shape({
      phoneNumber: PropTypes.string,
      address: ADDRESS_PROP_TYPES_SHAPE.isRequired
    })
  }

  constructor (props) {
    super(props);

    this.mapValuesToAddAddressProps = this.mapValuesToAddAddressProps.bind(this);
    this.mapValuesToSameAsShippingViewProps = this.mapValuesToSameAsShippingViewProps.bind(this);
    this.mapValuesToBillingAddressViewProps = this.mapValuesToBillingAddressViewProps.bind(this);
  }

  mapValuesToAddAddressProps (values) {
    return {
      isAddNew: !values.address || (!values.address.sameAsShipping && !values.address.onFileAddressKey)
    };
  }

  mapValuesToSameAsShippingViewProps (values) {
    return {
      isSameAsShipping: values.sameAsShipping || (values.address && values.address.sameAsShipping),
      mapValuesToBillingAddressViewProps: this.mapValuesToBillingAddressViewProps
    };
  }

  mapValuesToBillingAddressViewProps (values) {
    let selectedAddressEntry = values.address ? this.props.addressBookEntries.find((entry) => entry.addressKey === values.address.onFileAddressKey) || {} : {};
    return {
      isAddNew: values.address && !values.address.onFileAddressKey,
      ...selectedAddressEntry
    };
  }

  render () {
    let {addressBookEntries, isSameAsShippingEnabled, currentShippingDetails} = this.props;

    return (
      <div className="select-or-new-billing-address">
        {addressBookEntries.length > 0 && <FormSection name="address" className="select-address-billing">
          <h2 className="title-billing-address">Billing Address</h2>
          {isSameAsShippingEnabled && <Field component={LabeledCheckbox} name="sameAsShipping" value="1" title="Same as shipping address" className="checkbox-same-shipping" />}

          <AddressBookSelectFormPart adaptTo="sameAsShipping" mapValuesToProps={this.mapValuesToSameAsShippingViewProps} addressBookEntries={addressBookEntries} />
        </FormSection>}

        <AddNewBillingAddressFromSection adaptTo="address.sameAsShipping,address.onFileAddressKey" mapValuesToProps={this.mapValuesToAddAddressProps} />

        <SameAsShippingOrBillingAddressView adaptTo="address.sameAsShipping,address.onFileAddressKey" mapValuesToProps={this.mapValuesToSameAsShippingViewProps} {...currentShippingDetails} />
      </div>
    );
  }
}

/**
 * REVIEW: looks a big abusive of getAdaptiveFormPart, should I use FormValuesChangeTrigger and some internal states?
 * Looks simpler (to me) this way tho
*/
let AddressBookSelectFormPart = getAdaptiveFormPart((props) => {
  let {isSameAsShipping, addressBookEntries} = props;

  return !isSameAsShipping ? <Field component={AddressBookSelectContainer} name="onFileAddressKey" className="dropdown-address-book"
    title="Select from address book" addressBookEntries={addressBookEntries} /> : null;
});

let AddNewBillingAddressFromSection = getAdaptiveFormPart((props) => {
  return props.isAddNew ? <AddressFormSectionContainer /> : null;
});

let SameAsShippingOrBillingAddressView = getAdaptiveFormPart((props) => {
  return props.isSameAsShipping
    ? <ContactInfoDisplay className="same-as-shipping-or-billing-address-view-form" address={props.address} isShowAddress isShowPhone phoneNumber={props.phoneNumber} />
    : <SelectedBillingAddressView adaptTo="address.onFileAddressKey" mapValuesToProps={props.mapValuesToBillingAddressViewProps} />;
});

let SelectedBillingAddressView = getAdaptiveFormPart((props) => {
  return (!props.isAddNew && props.address) ? <ContactInfoDisplay className="selected-billing-address-view-form" address={props.address} isShowAddress isShowPhone phoneNumber={props.phoneNumber} /> : null;
});
