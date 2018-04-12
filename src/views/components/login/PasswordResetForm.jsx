/** @module PasswordResetForm
 * Form to enter new password once the reset password flow was started (link from email).
 * If the children prop is provide, that element will
 * render instead of the default footer.
 *
 * @author Agu
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {InputPassword} from 'views/components/common/form/InputPassword.jsx';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';
import {AuthenticationErrorMessageContainer} from 'views/components/globalElements/AuthenticationErrorMessageContainer';

if (DESKTOP) { // eslint-disable-line
  require('./_d.resetPassword.scss');
} else {  // eslint-disable-line
  require('./_m.resetPassword.scss');
}

class _PasswordResetForm extends React.Component {

  static propTypes = {
    /** Flags if the button to go back to login should be hidden */
    isHideBackButton: PropTypes.bool,
    /** calback for clicks on "back to login button" */
    onBackToLoginClick: PropTypes.func.isRequired,

    ...reduxFormPropTypes
  }

  render () {
    let {error, children, isHideBackButton, onBackToLoginClick, handleSubmit, pristine, submitting} = this.props;

    return (
      <div className="reset-password reset-new-password">
        <form onSubmit={handleSubmit}>
          <div className="message message-container">
            {!isHideBackButton && <button type="button" className="back-to-login-button" onClick={onBackToLoginClick}> &lt; Log In</button>}

            <h3>Reset your password</h3>
            <b>Password Requirements:</b>
            <ul>
              <li>
                - Must be at least 8 characters long
              </li>
              <li>
                - Must have at least 1 uppercase letter
              </li>
              <li>
                - Must contain 1 number
              </li>
              <li>
                - Must contain 1 special character: &#33;&#64;&#35;&#36;&#37;&#94;&amp;&#42;&#40;&#41;&lt;&gt;&#63;
              </li>
            </ul>
            <p> Note: It can’t be your last used password or your email address.</p>
          </div>

          {error && <AuthenticationErrorMessageContainer error={error} />}

          <Field component={InputPassword} title="New Password" name="password" />
          <Field component={InputPassword} title="Confirm Password" name="confirmPassword" placeholder="" className="confirm-password" disabledTooltip />

          <button type="submit" className="button-primary reset-button" disabled={pristine || submitting}>Reset password</button>
          {children}
        </form>
      </div>
    );
  }

}

let validateMethod = createValidateMethod(getStandardConfig(['password', 'confirmPassword']));

let PasswordResetForm = reduxForm({
  form: 'PasswordResetForm',  // a unique identifier for this form
  ...validateMethod
})(_PasswordResetForm);

export {PasswordResetForm};
