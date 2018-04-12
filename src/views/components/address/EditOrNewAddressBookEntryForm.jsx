/**  @module EditOrNewAddressBookEntryForm
 * @summary a form to edit or add a new entry to the address book
 *
 * @author Agu
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {AddressFormSectionContainer} from './AddressFormSectionContainer';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {SaveAndDefaultAddressBoxesFormPart} from './SaveAndDefaultAddressBoxesFormPart.jsx';
import {scrollToFirstFormError} from 'util/formsValidation/scrollToFirstFormError';

class _EditOrNewAddressBookEntryForm extends React.Component {

  static propTypes = {
    /** The text to display for the submit button */
    submitButtonText: PropTypes.string.isRequired,

    /** Flags if the phone number field should be shown */
    isHavePhoneField: PropTypes.bool,

    /** Flags if the country dropdown should be disabled */
    isDisableCountry: PropTypes.bool,

    /** Flags if 'set as default' checkbox should be shown */
    isShowSetAsDefault: PropTypes.bool.isRequired,

    /** Flags if 'set as default' checkbox should be disabled */
    isSetAsDefaultDisabled: PropTypes.bool,

    /** callback for the cancel button. if undefined, no 'cancel' button is shown */
    onCancelClick: PropTypes.func,

    isOpenModalShippingAddress: PropTypes.func,

    ...reduxFormPropTypes
  }

  render () {
    let {
      isHavePhoneField,
      error, pristine, submitting,
      handleSubmit,
      submitButtonText,
      isShowSaveToAccount,
      isShowSetAsDefault,
      isDisableCountry,
      isSetAsDefaultDisabled,
      onCancelClick
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        {error && <ErrorMessage error={error} />}

        <AddressFormSectionContainer isDisableCountry={isDisableCountry} />
        {isHavePhoneField && <div className="box-ghost"><Field component={LabeledInput} name="phoneNumber" className="input-phone" title="Phone Number" type="tel" /></div>}

        <SaveAndDefaultAddressBoxesFormPart isShowSaveToAccount={isShowSaveToAccount} isShowSetAsDefault={isShowSetAsDefault} isSetAsDefaultDisabled={isSetAsDefaultDisabled} />
        <div className="button-container">
          <button type="submit" className="button-select-shipping-address select" disabled={pristine || submitting}>{submitButtonText}</button>
          {onCancelClick && <button type="button" className="button-select-shipping-address cancel select" onClick={onCancelClick}>cancel</button>}
        </div>
      </form>);
  }
}

let validateMethod = createValidateMethod({
  address: AddressFormSectionContainer.defaultValidation,
  ...getStandardConfig(['phoneNumber'])
});

let EditOrNewAddressBookEntryForm = reduxForm({
  form: 'editOrAddAddressForm',
  ...validateMethod,
  enableReinitialize: true,
  onSubmitFail: (errors, dispatch, submitError, props) => scrollToFirstFormError(props.form)
})(_EditOrNewAddressBookEntryForm);

export {EditOrNewAddressBookEntryForm};
