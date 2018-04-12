/**
* @module ConfirmationCreateAccountForm
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* Form to create an account from order confirmation page (it's a bit different than the other)
*/
import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {InputPassword} from 'views/components/common/form/InputPassword.jsx';
import {LabeledCheckbox} from 'views/components/common/form/LabeledCheckbox.jsx';
import {AuthenticationErrorMessageContainer} from 'views/components/globalElements/AuthenticationErrorMessageContainer';
import {PAGES} from 'routing/routes/pages.js';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';

// import {WhatsThisTooltip} from 'views/components/checkout/confirmation/WhatsThisTooltip.jsx';
// import {ButtonTooltip} from 'views/components/tooltip/ButtonTooltip.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.confirmation-create-account-form.scss');
} else {
  require('./_m.confirmation-create-account-form.scss');
}

class _ConfirmationCreateAccountForm extends React.Component {
  static propTypes = {
    /** flags to show fields for entering the user name, zipcode and phone */
    isPromptForUserDetails: PropTypes.bool,

    /** the email address used in the order [used to create the account] */
    emailAddress: PropTypes.string.isRequired,

    /** This is a flag to enable us to toggle between copy changes for internationalization */
    isCountryUS: PropTypes.bool,

    ...reduxFormPropTypes
  }

  render () {
    let { error, isPromptForUserDetails, emailAddress, handleSubmit, submitSucceeded, isCountryUS } = this.props;

    return (
      <form className="create-account" onSubmit={handleSubmit}>
        <h2 className="confirmation-create-account-title">Create an account for easier, faster checkout.</h2>

        <div className="user-email">
          <h4 className="user-email-title">Email Address</h4>
          <p className="user-email-message">{emailAddress}</p>
        </div>

        {error && <AuthenticationErrorMessageContainer error={error}/>}

        {submitSucceeded && <p className="success-box">Yay! Your account has been created. {isCountryUS && ' Log in every time you shop to earn points.'}
        </p>}

        <div className="inputs-create-account">
          {isPromptForUserDetails && <Field component={LabeledInput} title="First Name" type="text" name="firstName" placeholder="" />}
          {isPromptForUserDetails && <Field component={LabeledInput} title="Last Name" type="text" name="lastName" placeholder="" />}
          <Field className="input-password" component={InputPassword} title="Password" name="password" placeholder="" />
          <Field className="input-confirm-password" component={InputPassword} title="Confirm Password" name="confirmPassword" disabledTooltip />
          {isPromptForUserDetails && <Field component={LabeledInput} title="Zip Code" type={isCountryUS ? 'tel' : 'text'} name="zipCode" placeholder="" />}
          {isPromptForUserDetails && <Field component={LabeledInput} title="Phone Number" type="tel" name="phoneNumber" placeholder="" />}
        </div>

        <Field component={LabeledCheckbox} className="checkbox-terms-and-conditions" name="termsAndConditions" value="Filled Checkbox Button">
          I agree to the <HyperLink destination={PAGES.helpCenter} pathSuffix="#termsAndConditionsli" className="link-terms" target="_blank">Terms & Conditions</HyperLink> of the My Place Rewards Program, and I understand I will receive marketing emails from The Children's Place. I can withdraw my consent to receive marketing emails at any time. <HyperLink destination={PAGES.helpCenter} pathSuffix="contact-us" className="contact-us-link" target="_blank">Contact us.</HyperLink>
        </Field>

        <button className="button-primary" type="submit">Create Account</button>
      </form>
    );
  }
}

let validateMethod = createValidateMethod(getStandardConfig([
  'firstName',
  'lastName',
  'password',
  'confirmPassword', {
    zipCode: 'zipcodeForUSorCA'
  },
  'phoneNumber',
  'termsAndConditions'
]));

let ConfirmationCreateAccountForm = reduxForm({
  form: 'confirmnationCreateAccountForm', // a unique identifier for this form
  ...validateMethod
})(_ConfirmationCreateAccountForm);

export {ConfirmationCreateAccountForm};
