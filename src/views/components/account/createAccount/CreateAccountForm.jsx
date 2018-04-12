import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, reduxForm, change, propTypes as reduxFormPropTypes} from 'redux-form';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {InputPassword} from 'views/components/common/form/InputPassword.jsx';
import {LabeledCheckbox} from 'views/components/common/form/LabeledCheckbox.jsx';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';
import {AuthenticationErrorMessageContainer} from 'views/components/globalElements/AuthenticationErrorMessageContainer';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {briteVerifyStatusExtraction} from 'util/formsValidation/briteVerifyEmailValidator';
import {validatorMethods} from 'util/formsValidation/validatorMethods';

import {PAGES} from 'routing/routes/pages';

if (DESKTOP) { // eslint-disable-line
  require('./_d.create-account.scss');
} else {
  require('./_m.create-account.scss');
}

class _CreateAccountForm extends React.Component {
  static propTypes = {
    /** whether or not rewards are enabled */
    isRewardsEnabled: PropTypes.bool.isRequired,

    /** whether or not to show espot **/
    isHideESpot: PropTypes.bool.isRequired,

    /** whether or not to show top <p> in the message **/
    isAuthModal: PropTypes.bool.isRequired,

    /** the country to which the current user's entered zipcode will be associeted to  */
    country: PropTypes.string.isRequired,

    /** This is a flag to enable us to toggle between copy changes for internationalization */
    isCountryUS: PropTypes.bool,

    /** last for digits of plcc card - to show checkbox when available */
    plccCardNumber: PropTypes.string,

    /**
     * A callback to change the displayed form in this drawer.
     * Accepts a single prop which is the ID of the form (see LOGIN_FORM_TYPES)
     */
    onForgotPasswordClick: PropTypes.func,

    ...reduxFormPropTypes
  }

  /**
   * Extract valid email status from briteVerify api
   */
  extractEmailStatus = (emailAddress) => {
    if (validatorMethods.email(emailAddress)) {
      briteVerifyStatusExtraction(emailAddress).then((response) => {
        this.props.dispatch(change('createAccountForm', 'response', response));
      });
    }
  }

  render () {
    let {
      error, pristine, submitting, submitSucceeded,
      handleSubmit, isRewardsEnabled, isHideESpot, isAuthModal, isCountryUS,
      onForgotPasswordClick, plccCardNumber
    } = this.props;

    return (
      <form className="form-create-account" onSubmit={handleSubmit}>
        {!isHideESpot && <ContentSlot className="create-account-banner" contentSlotName="create_account_drawer" />}

        {isRewardsEnabled && isCountryUS && !isAuthModal
          ? <div className="message message-container">
            <p className="message-item-container">Create a <strong>MY PLACE REWARDS</strong> account to earn points on every purchase. <br />
              <span><strong>$1 SPENT = 1 POINT</strong></span>
              <br />
              <span><strong>100 POINTS = $5 REWARD</strong></span>
            </p>

            <p className="second-message-create-account message-item-container" >Signed up in store? <br />
              An online account has been created with your email! <button className="button-click-reset-password" type="button" onClick={onForgotPasswordClick}>Reset your password.</button>
            </p>
          </div>

          : isRewardsEnabled && isCountryUS && isAuthModal
          ? <div className="message message-container">
            <p className="second-message-create-account message-item-container" >Signed up in store? <br />
              An online account has been created with your email! <button className="button-click-reset-password" type="button" onClick={onForgotPasswordClick}>Reset your password.</button>
            </p>
          </div>

          : <div className="message message-container">
            <h3 className="message-title-container">EASIER, FASTER SHOPPING!</h3>
            <p className="message-item-container">Create a MY PLACE account today.</p>
          </div>
        }

        {error && <AuthenticationErrorMessageContainer error={error} />}

        {submitSucceeded && <p className="success-box">Yay! Your account has been created.
          {isCountryUS && ' Log in every time you shop to earn points.'}
        </p>}

        <div className="inputs-create-account">
          <Field className="first-name-input" name="firstName" component={LabeledInput} title="First Name" type="text" />
          <Field className="last-name-input" name="lastName" component={LabeledInput} title="Last Name" type="text" />

          <Field className="email-input" name="emailAddress" validate={this.extractEmailStatus} component={LabeledInput} title="Email Address" type="text" />
          <Field className="confirm-email-input" name="confirmEmailAddress" component={LabeledInput} title="Confirm Email Address" type="text" />

          <Field className="password-input" component={InputPassword} title="Password" name="password" />

          <Field className="confirm-password-input" name="confirmPassword" component={InputPassword} title="Confirm Password" disabledTooltip />

          <Field className="input-zipcode" name="zipCode" component={LabeledInput} title={isCountryUS ? 'Zip Code' : 'Postal Code'} type={isCountryUS ? 'tel' : 'text'} />
          <Field className="input-phone-number" name="phoneNumber" component={LabeledInput} title="Phone Number" type="tel" />
          <Field name="response" component={LabeledInput} type="hidden"/>
        </div>

        {plccCardNumber && <Field component={LabeledCheckbox} className="login-save-plcc" name="savePlcc" title={'Save My Place Rewards Credit Card ending in ' + plccCardNumber + ' to my account for future purchases.'} subtitle="" />}

        <Field name="termsAndConditions" component={LabeledCheckbox} className="terms-and-conditions">
          I agree to the <HyperLink destination={PAGES.helpCenter} target="_blank" pathSuffix="#fullTermsli" target="_blank">terms & conditions</HyperLink>&nbsp;
          of the My Place Rewards Program, and I understand I will receive marketing&nbsp;
          emails from The Children's Place. I can withdraw my consent to receive marketing emails at any time.&nbsp;
          <HyperLink destination={PAGES.helpCenter} pathSuffix="contact-us" className="contact-us-link" target="_blank">Contact us.</HyperLink>
        </Field>

        <Field name="rememberMe" component={LabeledCheckbox} className="remember-me" title="Remember me." subtitle="Not recommended on shared devices." />

        <button type="submit" className="button-secondary button-create-account" disabled={pristine || submitting || this.props.invalid}>Create Account</button>
      </form>
    );
  }
}

let validateMethod = createValidateMethod(getStandardConfig([
  'firstName',
  'lastName',
  'emailAddress',
  'confirmEmailAddress',
  'password',
  'confirmPassword',
  'phoneNumber',
  'termsAndConditions',
  {zipCode: 'zipcodeForUSorCA'}
]));

let CreateAccountForm = reduxForm({
  form: 'createAccountForm',  // a unique identifier for this form
  ...validateMethod,
  briteVerifyStatusExtraction
})(_CreateAccountForm);

export {CreateAccountForm};
