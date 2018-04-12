/**  @module SelectOrNewCreditCardFormPart
 * @summary A form part for selecting an address from a dropdown of addresses or adding a new address.
 *
 * Provides the user with a AddressFormSection,
 * an optional phoneNumber, an optional emialAddress,
 * an optional checkbox named setAsDefault, an optional checkbox named saveToAccount,
 * and an optional checkbox named "emailSignup.
 *
 * @author Agu
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Field} from 'redux-form';
import {AddressBookSelect} from 'views/components/address/AddressBookSelect.jsx';
import {CreditCardSelect} from 'views/components/billing/CreditCardSelect.jsx';
import {SelectOrNewBillingAddressFormPart} from 'views/components/address/SelectOrNewBillingAddressFormPart.jsx';
import {CreditCardFormPartContainer} from 'views/components/billing/CreditCardFormPartContainer.js';
import {FormValuesChangeTrigger} from 'reduxStore/util/FormValuesChangeTrigger.jsx';
import {SaveAndDefaultBillingBoxesFormPart} from './SaveAndDefaultBillingBoxesFormPart.jsx';

export class SelectOrNewCreditCardFormPart extends React.Component {

  static propTypes = {
    addressBookEntries: AddressBookSelect.propTypes.addressBookEntries,

    /** The list of addresses to choose from */
    creditCardEntries: CreditCardSelect.propTypes.creditCardEntries,

    /** Flags if the selection dropdown should be disabled */
    isDisableCardSelection: PropTypes.bool,

    /** Flags to indicate 'save to account' option enabled */
    isShowSaveToAccount: PropTypes.bool.isRequired,

    /** Flags to indicate 'set as default' option enabled */
    isShowSetAsDefault: PropTypes.bool.isRequired,

    /**
     * A callback to call whenever a change in the selected address is made.
     * Receives as a parameter the id of the selected address;
     * or null to indicate the "add new address" was selected
     */
    onCardSelectionChange: PropTypes.func,

    /** bopis orders don't require shipping, so "same as shipping" shouldn't be visible */
    isSameAsShippingEnabled: PropTypes.bool.isRequired,

    /** the selected shipping address details.
     * Required if the prop isSameAsShippingEnabled is true */
    currentShippingDetails: SelectOrNewBillingAddressFormPart.propTypes.currentShippingDetails
  }

  constructor (props) {
    super(props);

    this.state = {
      isAddNew: props.creditCardEntries.length === 0
    };

    this.handleSelectionChange = this.handleSelectionChange.bind(this);
  }

  handleSelectionChange (values) {
    this.setState({
      isAddNew: !values.onFileCardId
    });

    if (this.props.onCardSelectionChange) {
      this.props.onCardSelectionChange(values.onFileCardId);
    }
  }

  render () {
    let {
      creditCardEntries,
      addressBookEntries,
      isDisableCardSelection,
      isShowSaveToAccount,
      isShowSetAsDefault,
      isSameAsShippingEnabled,
      currentShippingDetails
    } = this.props;

    return (
      <div className="address-billing">
        {creditCardEntries.length > 0 && <div className="credit-card-select-form">
          <FormValuesChangeTrigger adaptTo={'onFileCardId'} onChange={this.handleSelectionChange} />
          <Field name="onFileCardId" component={CreditCardSelect} className="dropdown-address-book" title="Select from card on file"
            creditCardEntries={creditCardEntries} disabled={isDisableCardSelection} />
        </div>}

        {this.state.isAddNew && <div className="add-new-card-and-address-container">
          <div className="new-credit-card-container">
            <CreditCardFormPartContainer />
            <SaveAndDefaultBillingBoxesFormPart isShowSaveToAccount={isShowSaveToAccount} isShowSetAsDefault={isShowSetAsDefault} />
          </div>

          <SelectOrNewBillingAddressFormPart addressBookEntries={addressBookEntries} isSameAsShippingEnabled={isSameAsShippingEnabled} currentShippingDetails={currentShippingDetails} />
        </div>}
      </div>
    );
  }

}
