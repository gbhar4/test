/**  @module ViewOrEditAddressForm
 * @summary a form for displaying/editing a given address.
 *
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {CheckoutSectionTitleDisplay} from 'views/components/checkout/CheckoutSectionTitleDisplay.jsx';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {AddressFormSectionContainer} from './AddressFormSectionContainer';
import {ContactInfoDisplay} from './ContactInfoDisplay.jsx';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {SaveAndDefaultAddressBoxesFormPart} from './SaveAndDefaultAddressBoxesFormPart.jsx';
import {SaveAndCancelButton} from 'views/components/checkout/SaveAndCancelButton.jsx';
import {scrollToFirstFormError} from 'util/formsValidation/scrollToFirstFormError';

class _ViewOrEditAddressForm extends React.Component {

  static propTypes = {
    /** Flags if this form should displayin the editing state */
    isEditing: PropTypes.bool.isRequired,

    /** The text to display as a title for this form */
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

    /** Flags if the phone number field should be shown */
    isHavePhoneField: PropTypes.bool,

    /** Flags if 'set as default' checkbox should be shown */
    isShowSetAsDefault: PropTypes.bool.isRequired,
    /** Flags if 'save to account' checkbox should be shown */
    isShowSaveToAccount: PropTypes.bool,
    /** Flags if 'set as default' checkbox should be disabled */
    isSetAsDefaultDisabled: PropTypes.bool,
    /** Flags if 'save to account' checkbox should be disabled */
    isSaveToAccountDisabled: PropTypes.bool,

    isOpenModalShippingAddress: PropTypes.func,

    /**
     * A callback to call whenever switching between the read-only and editing modes.
     * Will accept a single Boolean parameter that is true when entering edit mode,
     * and is false when exiting the edit mode.
     */
    onChangeEditMode: PropTypes.func.isRequired,

    /** see AddressFormSection.PropTypes.onStateZipOrLineChange  **/
    onStateZipOrLineChange: PropTypes.func.isRequired,

    ...reduxFormPropTypes
  }

  constructor (props) {
    super(props);
    this.handleEnterEditModeClick = () => this.props.onChangeEditMode(true);
    this.handleExitEditModeClick = () => this.props.onChangeEditMode(false);
  }

  render () {
    return this.props.isEditing ? this.renderEditing() : this.renderReadOnly();
  }

  // --------------- private methods --------------- //

  renderReadOnly () {
    let {title, initialValues, isHavePhoneField} = this.props;
    return (
      <div className="address-shipping-view">
        <div className="container-shipping-section-title">
          {title && <CheckoutSectionTitleDisplay title={title} />}
          <button type="button" aria-label="edit" className="button-edit-address"
            onClick={this.handleEnterEditModeClick} aria-label={`Edit ${title}`}>Edit</button>
        </div>
        <ContactInfoDisplay address={initialValues.address} isShowAddress isShowPhone
          phoneNumber={isHavePhoneField ? initialValues.phoneNumber : undefined} />
      </div>
    );
  }

  renderEditing () {
    let {title, isHavePhoneField, error, handleSubmit,
      isShowSaveToAccount, isShowSetAsDefault, isSaveToAccountDisabled, isSetAsDefaultDisabled, onStateZipOrLineChange} = this.props;
    return (
      <div className="address-shipping">
        <div className="container-shipping-section-title">
          {title && <CheckoutSectionTitleDisplay title={title} />}
        </div>

        {error && <ErrorMessage error={error} />}

        <AddressFormSectionContainer isShowInternationalShipping isDisableCountry onStateZipOrLineChange={onStateZipOrLineChange} />
        {isHavePhoneField &&
          <Field name="phoneNumber" component={LabeledInput} className="input-phone" title="Phone Number" type="tel" />
        }

        <SaveAndDefaultAddressBoxesFormPart isAddLineBreakBetweenBoxes
          isShowSaveToAccount={isShowSaveToAccount} isSaveToAccountDisabled={isSaveToAccountDisabled}
          isShowSetAsDefault={isShowSetAsDefault} isSetAsDefaultDisabled={isSetAsDefaultDisabled}
        />

        <SaveAndCancelButton onSubmit={handleSubmit} onCancel={this.handleExitEditModeClick} />
      </div>
    );
  }

  // --------------- end of private methods --------------- //

}

let validateMethod = createValidateMethod({
  address: AddressFormSectionContainer.defaultValidation,
  ...getStandardConfig(['phoneNumber'])
});

let ViewOrEditAddressForm = reduxForm({
  form: 'viewOrEditAddressForm',       // (a default value) unique identifier for this form
  ...validateMethod,
  enableReinitialize: true,
  onSubmitFail: (errors, dispatch, submitError, props) => scrollToFirstFormError(props.form)
})(_ViewOrEditAddressForm);

export {ViewOrEditAddressForm};
