/**
 * @module ResetPwdRequestForm
 * @author Oliver Ramirez <oramirez@minutentag.com>
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 *
 * Reset password request form. If the children prop is provided, that element will
 * render instead of the default footer.
 *
 * Style (ClassName) Elements description/enumeration
 *  reset-password
 *
 * Uses
 *  <Field /> (from 'redux-form')
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';
import {AuthenticationErrorMessageContainer} from 'views/components/globalElements/AuthenticationErrorMessageContainer';

if (DESKTOP) { // eslint-disable-line
  require('./_d.resetPassword.scss');
} else {  // eslint-disable-line
  require('./_m.resetPassword.scss');
}

class _ResetPwdRequestForm extends React.Component {
  static propTypes = {
    /** Whether the reset password succeded (email was sent). */
    resetServerSuccess: PropTypes.bool,
    /** Flags if the button to go back to login should be hidden */
    isHideBackButton: PropTypes.bool,
    /** calback for clicks on "back to login button" */
    onBackToLoginClick: PropTypes.func.isRequired,

    ...reduxFormPropTypes
  }

  static defaultProps = {
    resetServerSuccess: false
  }

  render () {
    let {
      error,
      resetServerSuccess,
      children,
      isHideBackButton,
      onBackToLoginClick,
      handleSubmit,
      pristine,
      submitting
    } = this.props;

    return (
      <div className="reset-password">
        <form onSubmit={handleSubmit}>
          <div className="message message-container">
            {!isHideBackButton && <button type="button" className="back-to-login-button" onClick={onBackToLoginClick}> &lt; Back to Log In</button>}
            <h3 className="reset-password-form-title">Forgot your password? <br />No worries!</h3>
            <p>Enter your email address, and we’ll send you instructions to reset your password.</p>
          </div>

          {error && <AuthenticationErrorMessageContainer error={error} />}

          {resetServerSuccess && <p className="success-box" aria-describedby="lname_error">Password reset instructions have been sent to your email address.</p>}

          <Field component={LabeledInput} title="Email Address" type="text" name="emailAddress" placeholder="" />

          <button type="submit" className="button-primary reset-button" disabled={pristine || submitting}>Reset password</button>

          {children}
        </form>
      </div>
    );
  }
}

let validateMethod = createValidateMethod(getStandardConfig(['emailAddress']));

let ResetPwdRequestForm = reduxForm({
  form: 'ResetPwdRequestForm',  // a unique identifier for this form
  ...validateMethod
})(_ResetPwdRequestForm);

export {ResetPwdRequestForm};
