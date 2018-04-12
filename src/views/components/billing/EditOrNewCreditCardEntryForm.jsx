/**
 * @author Agu
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';

import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {CreditCardFormPartContainer} from 'views/components/billing/CreditCardFormPartContainer.js';

import {GuestBillingFormPart} from 'views/components/checkout/billing/GuestBillingFormPart.jsx';
import {RegisteredBillingAddressMobileContainer} from 'views/components/checkout/billing/RegisteredBillingAddressMobileContainer.js';
import {SaveAndDefaultBillingBoxesFormPart} from './SaveAndDefaultBillingBoxesFormPart.jsx';

class _EditOrNewCreditCardEntryForm extends React.Component {

  static propTypes = {
    /** The text to display for the submit button */
    submitButtonText: PropTypes.string.isRequired,

    /** Flags if the phone number field should be shown */
    isHavePhoneField: PropTypes.bool,

    /** Flags if the country dropdown should be disabled */
    isDisableCountry: PropTypes.bool,

    /** Flags if 'set as default' checkbox should be shown */
    isShowSetAsDefault: PropTypes.bool.isRequired,

    /** callback for the cancel button. if undefined, no 'cancel' button is shown */
    onCancelClick: PropTypes.func,

    isOpenModalShippingAddress: PropTypes.func,

    ...reduxFormPropTypes
  }

  render () {
    let {
      error,
      handleSubmit,
      submitButtonText,
      isShowSaveToAccount,
      isShowSetAsDefault,
      onCancelClick,
      change,
      cardType
    } = this.props;

    return (
      <form onSubmit={handleSubmit} className="edit-payment-method-container">
        <div className="add-new-card-and-address-container">
          <div className="new-credit-card-container">
            {error && <ErrorMessage error={error} />}

            <CreditCardFormPartContainer formName="editOrAddCreditCardForm" cardType={cardType} />
            <SaveAndDefaultBillingBoxesFormPart isShowSaveToAccount={isShowSaveToAccount} isShowSetAsDefault={isShowSetAsDefault} />
          </div>

          <RegisteredBillingAddressMobileContainer change={change} />

          <button type="submit" className="button-select-shipping-address select">{submitButtonText}</button>
          {onCancelClick && <button type="button" className="button-select-shipping-address select" onClick={onCancelClick}>cancel</button>}
        </div>
      </form>);
  }
}

let validateMethod = createValidateMethod(GuestBillingFormPart.defaultValidation);

let EditOrNewCreditCardEntryForm = reduxForm({
  form: 'editOrAddCreditCardForm',
  ...validateMethod,
  enableReinitialize: true
})(_EditOrNewCreditCardEntryForm);

export {EditOrNewCreditCardEntryForm};
