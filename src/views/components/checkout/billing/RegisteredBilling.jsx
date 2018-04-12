/**
 * @author Agu
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {CheckoutSectionTitleDisplay} from 'views/components/checkout/CheckoutSectionTitleDisplay.jsx';
import {PaymentMethodFormSection} from './PaymentMethodFormSection.jsx';
import {CreditCardSelect} from 'views/components/billing/CreditCardSelect.jsx';
import {SelectOrNewCreditCardFormPart} from 'views/components/billing/SelectOrNewCreditCardFormPart.jsx';
import {ViewOrEditCreditCardFormPart} from 'views/components/billing/ViewOrEditCreditCardFormPart.jsx';
import {AddressBookSelect} from 'views/components/address/AddressBookSelect.jsx';
import {getAdaptiveFormPart} from 'reduxStore/util/adaptiveFormPart.js';

let BillingDetailsFormPart = getAdaptiveFormPart((props) => {
  let {addressBookEntries, creditCardEntries, isEditing, isSaveCCToAccountEnabled,
    isSameAsShippingEnabled, selectedCardId, cardType, isPLCCEnabled,
    isSetCCAsDefaultEnabled, handleCardSelectionChange, onEditCardSubmit,
    handleEditModeChange, currentShippingDetails
  } = props;

  if (props.isPaypalSelected) {
    return (<div className="message-paypal">
      <p className="message-paypal-selected">
        By selecting PayPal, you will leave childrensplace.com to complete the order process with PayPal's site.<br />
        Upon PayPal payment completion, you will be returned to childrensplace.com
      </p>
      <p className="message-paypal-selected">Please review your purchase and delivery details before proceeding.</p>
    </div>);
  } else {
    let selectedCreditCardEntry = creditCardEntries.find((entry) => { return entry.onFileCardId === selectedCardId; });

    // DT-33012 - "Same As Shipping" checkbox should be checked by default
    if (isSameAsShippingEnabled && selectedCreditCardEntry && selectedCreditCardEntry.address) {
      selectedCreditCardEntry.address.sameAsShipping = true;
    }

    return (<div>
      <SelectOrNewCreditCardFormPart key="1" addressBookEntries={addressBookEntries} creditCardEntries={creditCardEntries}
        isDisableCardSelection={isEditing} isShowSaveToAccount={isSaveCCToAccountEnabled}
        isShowSetAsDefault={isSetCCAsDefaultEnabled} isSameAsShippingEnabled={isSameAsShippingEnabled}
        onCardSelectionChange={handleCardSelectionChange}
        currentShippingDetails={currentShippingDetails}
        />

      {selectedCardId && <ViewOrEditCreditCardFormPart key="2" title="Card Details"
        addressBookEntries={addressBookEntries} id={selectedCardId}
        onEditModeChange={handleEditModeChange}
        initialValues={selectedCreditCardEntry}
        isPLCCEnabled={isPLCCEnabled}
        cardType={cardType}
        isSetAsDefaultEnabled={!selectedCreditCardEntry.isDefault}
        isSameAsShippingEnabled={isSameAsShippingEnabled}
        currentShippingDetails={currentShippingDetails}
        onSubmit={onEditCardSubmit}
        />}

      {/* (!selectedCreditCardEntry || !selectedCreditCardEntry.isDefault) && isSetCCAsDefaultEnabled &&
        <Field key="3" component={LabeledCheckbox} className="label-checkbox checkbox-set-default" name="setAsDefault"
          subtitle="Set as default payment method" /> */}
    </div>);
  }
});

export class RegisteredBilling extends React.Component {
  static propTypes = {
    /** A map of the saved addresses */
    addressBookEntries: AddressBookSelect.propTypes.addressBookEntries,

    /** A map of the saved cards */
    creditCardEntries: CreditCardSelect.propTypes.creditCardEntries,

    /** Flags to indicate 'save cc to account' option enabled */
    isSaveCCToAccountEnabled: PropTypes.bool.isRequired,

    /** Flags to indicate 'set cc as default' option enabled */
    isSetCCAsDefaultEnabled: PropTypes.bool.isRequired,

    /** bopis orders don't require shipping, so "same as shipping" shouldn't be visible */
    isSameAsShippingEnabled: PropTypes.bool.isRequired,

    /** the selected shipping address details. Required if isSameAsShippingEnabled is true */
    currentShippingDetails: ViewOrEditCreditCardFormPart.propTypes.currentShippingDetails,

    /** This is a flag to enable us to toggle between copy changes for internationalization */
    isCountryUS: PropTypes.bool,

    /**
     * A callback to call whenever opening or closing the editing card details sub-form.
     * Will accept a single Boolean parameter that is true when entering edit mode
     * and is false when exiting the edit mode.
     */
    onEditModeChange: PropTypes.func
  }

  constructor (props) {
    super(props);
    this.state = {
      isEditing: false
    };
    this.handleEditModeChange = this.handleEditModeChange.bind(this);
    this.handleCardSelectionChange = this.handleCardSelectionChange.bind(this);
    this.mapValuesToBillingAddressProps = this.mapValuesToBillingAddressProps.bind(this);
  }

  handleEditModeChange (isEditMode) {
    this.props.change('cvv', '');
    this.props.untouch('cvv');
    this.setState({
      isEditing: isEditMode
    });
    if (this.props.onEditModeChange) {
      this.props.onEditModeChange(isEditMode);
    }
  }

  handleCardSelectionChange (onFileCardId) {
    this.setState({
      isEditing: this.state.isEditing
    });
  }

  mapValuesToBillingAddressProps (values) {
    return {
      isPaypalSelected: values.paymentMethod === 'paypal',
      selectedCardId: values.onFileCardId
    };
  }

  render () {
    let {isPLCCEnabled, isPaypalEnabled, isCountryUS} = this.props;

    return (
      <section className="checkout-billing-section">
        <CheckoutSectionTitleDisplay title="Payment Method" className="payment-method-section" />

        {isPaypalEnabled &&
          <PaymentMethodFormSection isCountryUS={isCountryUS} />
        }

        <BillingDetailsFormPart adaptTo={'paymentMethod,onFileCardId'}
          isPLCCEnabled={isPLCCEnabled}
          mapValuesToProps={this.mapValuesToBillingAddressProps}
          handleCardSelectionChange={this.handleCardSelectionChange}
          handleEditModeChange={this.handleEditModeChange}
          {...this.props}
          isEditing={this.state.isEditing}
        />
      </section>
    );
  }
}
