/**  @module ViewOrEditCreditCardFormPart
 * @summary a form part for displaying/editing a given address.
 *
 * @author Agu
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, FormSection, reduxForm} from 'redux-form';

import {CreditCardFormPartContainer} from './CreditCardFormPartContainer.js';
import {ContactInfoDisplay} from 'views/components/address/ContactInfoDisplay.jsx';
import {ExpressCVVFormPartContainer} from 'views/components/checkout/billing/ExpressCVVFormPartContainer.jsx';
import {AddressBookSelectContainer} from 'views/components/address/AddressBookSelectContainer';
import {AddressFormSectionContainer} from 'views/components/address/AddressFormSectionContainer.js';
import {TitlePlusEditButton} from 'views/components/checkout/TitlePlusEditButton.jsx';
import {getAdaptiveFormPart} from 'reduxStore/util/adaptiveFormPart.js';
import {LabeledCheckbox} from 'views/components/common/form/LabeledCheckbox.jsx';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {GuestBillingFormPart} from 'views/components/checkout/billing/GuestBillingFormPart.jsx';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {CheckoutSectionTitleDisplay} from 'views/components/checkout/CheckoutSectionTitleDisplay.jsx';
import {SaveAndCancelButton} from 'views/components/checkout/SaveAndCancelButton.jsx';
import {SaveAndDefaultBillingBoxesFormPart} from 'views/components/billing/SaveAndDefaultBillingBoxesFormPart.jsx';
import {scrollToFirstFormError} from 'util/formsValidation/scrollToFirstFormError';
import {ADDRESS_PROP_TYPES_SHAPE} from 'views/components/common/propTypes/addressPropTypes';

const RegisteredViewOrEditBillingAddress = getAdaptiveFormPart((props) => {
  let {sameAsShipping, handleSelectionChange, addressBookEntries, mapValuesToExistingAddressProps, handleExitEditModeClick,
    handleSubmit, address, isSetAsDefaultEnabled} = props;
  return !sameAsShipping
    ? <div className="billing-address-section">
      <FormSection name="address" className="">
        <Field component={AddressBookSelectContainer} name="onFileAddressKey" className="dropdown-address-book" title="Select from address book"
          addressBookEntries={addressBookEntries} onChange={handleSelectionChange} />
      </FormSection>

      <SelectOrNewBillingAddressFormPart handleSubmit={handleSubmit} handleExitEditModeClick={handleExitEditModeClick}
        adaptTo={'address.onFileAddressKey'} addressBookEntries={addressBookEntries} mapValuesToProps={mapValuesToExistingAddressProps} />

      {isSetAsDefaultEnabled && <Field component={LabeledCheckbox} className="set-as-default-checkbox" name="isDefault" title="Set as default payment method" />}

      <SaveAndCancelButton isDisabledForm onSubmit={handleSubmit} onCancel={handleExitEditModeClick} />
    </div>
    : <div className="address-shipping-view">
      <ContactInfoDisplay address={address} isShowAddress />

      {isSetAsDefaultEnabled &&
        <Field component={LabeledCheckbox} className="set-as-default-checkbox" name="isDefault" title="Set as default payment method" />
      }

      <SaveAndCancelButton isDisabledForm onSubmit={handleSubmit} onCancel={handleExitEditModeClick} />
    </div>;
});

const SelectOrNewBillingAddressFormPart = getAdaptiveFormPart((props) => {
  let addressEntry = props.addressBookEntries.find((entry) => { return entry.addressKey === props.onFileAddressKey; });

  return (
    props.onFileAddressKey
      ? <ContactInfoDisplay address={addressEntry.address} phoneNumber={addressEntry.phoneNumber} isShowAddress isShowPhone />
      : <div>
        <AddressFormSectionContainer />
      </div>
  );
});

export class ViewOrEditCreditCardFormPart extends React.Component {

  static propTypes = {
    /** Flags if this form should initially show in the editing state */
    initiallyEditing: PropTypes.bool,

    /** The list of addresses to choose from */
    addressBookEntries: AddressBookSelectContainer.propTypes.addressBookEntries,

    /** The text to display as a title for this form */
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

    /**
     * A callback to call whenever switching between the read-only and editing modes.
     * Will accept a single Boolean parameter that is true when entering edit mode
     * and is false when exiting the edit mode.
     */
    onEditModeChange: PropTypes.func,

    /** bopis orders don't require shipping, so "same as shipping" shouldn't be visible */
    isSameAsShippingEnabled: PropTypes.bool.isRequired,

    /** the selected shipping address details
     * Required if the prop isSameAsShippingEnabled is true.
     */
    currentShippingDetails: PropTypes.shape({
      onFileAddressKey: PropTypes.string.isRequired,
      address: ADDRESS_PROP_TYPES_SHAPE.isRequired,
      phoneNumber: PropTypes.string
    }),

    /** indicates PLCC is enabled as payment method (for validation) **/
    isPLCCEnabled: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props);
    this.state = {
      isEditing: !!props.initiallyEditing
    };
    this.handleEnterEditModeClick = this.setEditingMode.bind(this, true);
    this.handleExitEditModeClick = this.setEditingMode.bind(this, false);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
  }

  render () {
    return this.state.isEditing ? this.renderEditing() : this.renderReadOnly();
  }

  handleEditSubmit (formData) {
    return this.props.onSubmit(formData).then(() => {
      this.handleExitEditModeClick();
    });
  }

  // --------------- private methods --------------- //
  setEditingMode (isEditMode) {
    this.setState({
      isEditing: isEditMode
    });
    if (this.props.onEditModeChange) {
      this.props.onEditModeChange(isEditMode);
    }
  }

  renderReadOnly () {
    let {title, initialValues} = this.props;

    return (initialValues
      ? <div className="credit-card-form-container">
        <TitlePlusEditButton title={title} onEdit={this.handleEnterEditModeClick} />

        <div className="payment-method-container">
          <div className="card-container">
            <strong className="title-payment-method">Payment Method</strong>
            <img src={initialValues.imgPath} alt={initialValues.cardType} />
            <span className="card-suffix">ending in {initialValues.cardEndingNumbers}</span>
          </div>

          {initialValues.isCVVRequired && <ExpressCVVFormPartContainer />}

          {!initialValues.isDefault && <SaveAndDefaultBillingBoxesFormPart isShowSetAsDefault />}
        </div>

        <ContactInfoDisplay title="Billing Address" address={initialValues.address} isShowAddress />
      </div>
      : null
    );
  }

  renderEditing () {
    let {
      title,
      isSameAsShippingEnabled,
      addressBookEntries,
      currentShippingDetails,
      initialValues,
      isPLCCEnabled,
      cardType,
      isSetAsDefaultEnabled
    } = this.props;

    cardType = cardType || initialValues.cardType;

    return (
      <EditCreditCardForm title={title} isSameAsShippingEnabled={isSameAsShippingEnabled}
        isPLCCEnabled={isPLCCEnabled}
        onSubmit={this.handleEditSubmit}
        initialValues={initialValues}
        cardType={cardType}
        isSetAsDefaultEnabled={isSetAsDefaultEnabled}
        addressBookEntries={addressBookEntries}
        currentShippingDetails={currentShippingDetails}
        handleExitEditModeClick={this.handleExitEditModeClick}
      />
    );
  }

  // --------------- end of private methods --------------- //
}

// FIXME: refactor this component, move edit form to a different file. all the maptos and handles should be part of the edit form, not editorview
class _EditCreditCardForm extends React.Component {
  constructor (props) {
    super(props);

    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.mapValuesToAddressProps = this.mapValuesToAddressProps.bind(this);
    this.mapValuesToExistingAddressProps = this.mapValuesToExistingAddressProps.bind(this);
    this.handleSameAsShippingChange = this.handleSameAsShippingChange.bind(this);
  }

  handleSameAsShippingChange (event) {
    if (event.nativeEvent.target.checked) {
      let {onFileAddressKey, address} = this.props.currentShippingDetails;

      this.props.change('address.onFileAddressKey', onFileAddressKey || '');
      this.props.change('address.firstName', address.firstName);
      this.props.change('address.lastName', address.lastName);
      this.props.change('address.addressLine1', address.addressLine1);
      this.props.change('address.addressLine2', address.addressLine2);
      this.props.change('address.city', address.city);
      this.props.change('address.state', address.state);
      this.props.change('address.zipCode', address.zipCode);
      this.props.change('address.country', address.country);
    }
  }

  mapValuesToAddressProps (values) {
    return {
      sameAsShipping: values.address && values.address.sameAsShipping,
      handleSelectionChange: this.handleSelectionChange
    };
  }

  mapValuesToExistingAddressProps (values) {
    return {
      onFileAddressKey: values.address ? values.address.onFileAddressKey : ''
    };
  }

  handleSelectionChange (event, newValue, oldValue) {
    let addressEntry = this.props.addressBookEntries.find((entry) => { return entry.addressKey === newValue; });

    // dispatch actions to the redux store to change the values of the relevant form fields
    if (addressEntry) {
      let {address} = addressEntry;

      this.props.change('address.onFileAddressKey', address.onFileAddressKey || '');
      this.props.change('address.firstName', address.firstName);
      this.props.change('address.lastName', address.lastName);
      this.props.change('address.addressLine1', address.addressLine1);
      this.props.change('address.addressLine2', address.addressLine2);
      this.props.change('address.city', address.city);
      this.props.change('address.state', address.state);
      this.props.change('address.zipCode', address.zipCode);
      this.props.change('address.country', address.country);
    }
  }

  render () {
    let {
      title,
      handleSubmit,
      handleExitEditModeClick,
      isSameAsShippingEnabled,
      addressBookEntries,
      currentShippingDetails,
      error,
      cardType,
      isSetAsDefaultEnabled
    } = this.props;

    return (<div className="address-shipping">
      <div className="container-shipping-section-title">
        {title && <CheckoutSectionTitleDisplay title={title} />}
        {/* <button type="submit" aria-label="save" className="button-save-address">Save</button>
        <button type="button" aria-label="cancel" className="button-cancel-address" onClick={handleExitEditModeClick}>Cancel</button> */}
      </div>

      {error && <ErrorMessage error={error} />}

      <CreditCardFormPartContainer formName="editCreditCardForm" cardType={cardType} />

      <form className="address-billing-container" onSubmit={handleSubmit}>
        <h4>Billing Address</h4>

        {isSameAsShippingEnabled &&
          <FormSection name="address">
            <Field component={LabeledCheckbox} className="same-as-shipping-checkbox" name="sameAsShipping" title="Same as shipping" onChange={this.handleSameAsShippingChange} />
          </FormSection>
        }

        <RegisteredViewOrEditBillingAddress adaptTo={'address.sameAsShipping'} mapValuesToProps={this.mapValuesToAddressProps}
          addressBookEntries={addressBookEntries} address={currentShippingDetails.address} mapValuesToExistingAddressProps={this.mapValuesToExistingAddressProps}
          handleExitEditModeClick={handleExitEditModeClick} handleSubmit={handleSubmit} isSetAsDefaultEnabled={isSetAsDefaultEnabled} />
      </form>
    </div>);
  }
}

let validateMethod = createValidateMethod(GuestBillingFormPart.defaultValidation);

let EditCreditCardForm = reduxForm({
  form: 'editCreditCardForm',
  onSubmitFail: (errors, dispatch, submitError, props) => scrollToFirstFormError(props.form),
  ...validateMethod
  // forceUnregisterOnUnmount: true,
  // destroyOnUnmount: false
})(_EditCreditCardForm);
