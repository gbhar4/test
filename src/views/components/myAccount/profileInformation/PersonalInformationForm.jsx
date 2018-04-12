/**
 * @module PersonalInformationForm
 * @summary a form to edit the user's personal information.
 *
 * @author Miguel <malvarez@d3sistemas.com.ar>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, reduxForm, change, propTypes as reduxFormPropTypes} from 'redux-form';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {LabeledCheckbox} from 'views/components/common/form/LabeledCheckbox.jsx';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {getAdaptiveFormPart} from 'reduxStore/util/adaptiveFormPart.js';
import { briteVerifyStatusExtraction } from 'util/formsValidation/briteVerifyEmailValidator';
import { validatorMethods } from 'util/formsValidation/validatorMethods';

class _PersonalInformationForm extends React.Component {

  static propTypes = {
    /** Flags if we are in Canada (to show Air Mails input) */
    isCanada: PropTypes.bool.isRequired,
    /** callback to call when cancelling the form */
    onCancel: PropTypes.func,
    /** props passed by the wrapping redux form */
    ...reduxFormPropTypes
  }

  state = {
    emailAddressChanged: false
  }

  constructor (props) {
    super(props);

    this.state = {
      pristineError: false
    };

    this.mapValuesToEmployeeFormPartProps = this.mapValuesToEmployeeFormPartProps.bind(this);
    this.handleEmailAddressChange = this.handleEmailAddressChange.bind(this);
    this.handlePristineError = this.handlePristineError.bind(this);
  }

  handlePristineError () {
    this.setState({
      pristineError: true
    });
  }

  /**
  * Extract valid email status from briteVerify api
  */
  extractEmailStatus = (emailAddress) => {
    if (validatorMethods.email(emailAddress)) {
      briteVerifyStatusExtraction(emailAddress).then((status) => {
        this.props.dispatch(change('personalInformationForm', 'status', status));
      });
    }
  }

  handleEmailAddressChange () {
    this.setState({emailAddressChanged: true});
  }

  mapValuesToEmployeeFormPartProps (values) {
    return values;
  }

  render () {
    let {isCanada, error, pristine, handleSubmit, onCancel} = this.props;
    let {pristineError} = this.state;
    let {emailAddressChanged} = this.state;

    let titleEmailAddress = <div><span className="input-title">Email Address</span><strong className="hint-text">Your email will be used to login to your account</strong></div>;
    let titleAirMilesAccountNumber = <div><span className="input-title">AIR MILES Card <sup>&reg;</sup></span><strong className="hint-text">Provide your Collector Number to get Miles</strong></div>;

    return (
      <form onSubmit={handleSubmit} className="personal-information-form"> 

        <div className="my-account-title-section profile-information-header">
          <h2 className="profile-information-title">Personal Information</h2>
        </div>

        {pristineError && pristine && <ErrorMessage error="You have not made any changes. Please review or cancel to go back." />}
        {error && <ErrorMessage error={error} />}

        <Field component={LabeledInput} name="firstName" className="input-first-name" title="First" />

        <Field component={LabeledInput} name="lastName" title="Last" className="input-last-name" />

        <Field component={LabeledInput} name="emailAddress" title={titleEmailAddress}
          className="email-address" onChange={this.handleEmailAddressChange} validate={this.extractEmailStatus}>
          {emailAddressChanged &&
            <aside className="message-email">Changes to your email address will also change your login credentials</aside>}
        </Field>
        <Field name="status" component={LabeledInput} type="hidden" />

        <Field component={LabeledInput} name="phoneNumber" title="Mobile Phone Number" className="phone-number" />

        {isCanada && <Field component={LabeledInput} name="airMilesAccountNumber" title={titleAirMilesAccountNumber} className="air-miles-card" />}

        <Field component={LabeledCheckbox} name="isEmployee" title="I'm an employee of The Children's Place" className="checkbox-employee" />
        <EmployeeFormPart adaptTo="isEmployee" mapValuesToProps={this.mapValuesToEmployeeFormPartProps} />
        
        <div className="button-container">
          <button type="button" className="button-cancel-information" onClick={onCancel}>Cancel</button>
          <button type={pristine ? 'button' : 'submit'} className="button-save" onClick={pristine && this.handlePristineError}>Save</button>
        </div>
      </form>
    );
  }
}

let EmployeeFormPart = getAdaptiveFormPart((props) => {
  return props.isEmployee
    ? <Field component={LabeledInput} name="associateId" title="Associate ID" className="input-associated" />
    : null;
});

let validateMethod = createValidateMethod({
  ...getStandardConfig(['firstName', 'lastName', 'emailAddress', 'phoneNumber', 'associateId', 'airMilesAccountNumber'])
});

let PersonalInformationForm = reduxForm({
  form: 'personalInformationForm',
  ...validateMethod
})(_PersonalInformationForm);

export {PersonalInformationForm};
