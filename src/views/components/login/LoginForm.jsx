/** @module LoginForm
 * Core of the login form. This component renders given children at footer, if
 * specified, or else, a default footer with reset password and create account
 * links/buttons.
 *
 * @author Oliver Ramirez <oramirez@minutentag.com>
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {InputPassword} from 'views/components/common/form/InputPassword.jsx';
import {LabeledCheckbox} from 'views/components/common/form/LabeledCheckbox.jsx';
import {LogoutLinkContainer} from 'views/components/login/LogoutLinkContainer.js';

import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';
import {AuthenticationErrorMessageContainer} from 'views/components/globalElements/AuthenticationErrorMessageContainer';

if (DESKTOP) { // eslint-disable-line
  require('./_d.login.scss');
} else {
  require('./_m.login.scss');
}

class _LoginForm extends React.Component {
  static propTypes = {
    /** First level title. */
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,

    /** Second level title. */
    subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,

    /**
     * Notification that can be passed by the parent component, to show before
     * the form.
     */
    parentNotification: PropTypes.string,

    /** whether or not to show the remember be checkbox */
    isShowRemember: PropTypes.bool,

    /** whether or not to show the forgot password buttons */
    isShowForgot: PropTypes.bool,

    /** whether or not to show the remembered logout button */
    isShowRememberedLogOut: PropTypes.bool,
    /** optional extra callback for calling after a successfull logout */
    onSuccessfulLogout: PropTypes.func,

    /** whether or not to show reset password button (remembered login does not have it) */
    isShowResetPassword: PropTypes.bool,

    /** last for digits of plcc card - to show checkbox when available */
    plccCardNumber: PropTypes.string,

    /**
     * A callback to change the displayed form in this drawer.
     * Accepts a single prop which is the ID of the form (see LOGIN_FORM_TYPES)
     */
    onForgotPasswordClick: PropTypes.func,

    /** ths props is for hidden spot in shopping bag modal */
    isHideESpot: PropTypes.bool,

    /** This is a flag to enable us to toggle between copy changes for internationalization */
    isCountryUS: PropTypes.bool,

    /* Boolean flag to know if email address input should be disabled. It's will be valid when remembered user case is fired. */
    isEmailAddressDisabled: PropTypes.bool,

    ...reduxFormPropTypes
  }

  render () {
    let { title, subtitle, children, error, parentNotification, handleSubmit, isShowForgot, isShowRemember,
          isEmailAddressDisabled, isShowRememberedLogOut, onSuccessfulLogout, onForgotPasswordClick, pristine,
          submitting, isHideESpot, contentSlotName, plccCardNumber, isCountryUS } = this.props;

    return (
      <div className="form-login">
        {!isHideESpot && <ContentSlot contentSlotName={contentSlotName || 'minicart_login_banner'} className="login-banner" />}
        <form onSubmit={handleSubmit}>
          <div className="message message-container">
            <h3 className="login-form-title">{title}</h3>
            <p className="login-form-subtitle">{subtitle}</p>

            {isCountryUS && (!children && isShowForgot) &&
              <div className="reset-password-container">
                <p className="reset-password-text">Signed up in store? An online account has been created with your email! <button className="reset-password-button" type="button" onClick={onForgotPasswordClick}>Click here</button> to reset your password.</p>
              </div>
            }
          </div>

          {error && <AuthenticationErrorMessageContainer error={error} />}

          {parentNotification && <p className="parent-notification">{parentNotification}</p>}

          <Field component={LabeledInput} title="Email Address" className="input-email" type="text" name="emailAddress" disabled={isEmailAddressDisabled} />

          <Field component={InputPassword} title="Password" className="input-password" name="password" />

          {isShowRemember && <Field component={LabeledCheckbox} className="login-remember" name="rememberMe" title="Remember me." subtitle="Not recommended on shared devices." />}

          {plccCardNumber && <Field component={LabeledCheckbox} className="login-save-plcc" name="savePlcc" title={'Save My Place Rewards Credit Card ending in ' + plccCardNumber + ' to my account for future purchases.'} subtitle="" />}

          {isShowForgot && <button type="button" className="link-forgot" onClick={onForgotPasswordClick}>Forgot password?</button>}

          <button type="submit" className="button-primary login-button" disabled={pristine || submitting}>Log in</button>

          {isShowRememberedLogOut && <LogoutLinkContainer isShowNamePrefix onSuccessfulLogout={onSuccessfulLogout} />}

          {children}

        </form>
      </div>
    );
  }

}

let validateMethod = createValidateMethod(getStandardConfig([{
  'emailAddress': 'emailAddressNoAsync'
}, {
  'password': 'legacyPassword'
}]));

let LoginForm = reduxForm({
  form: 'loginForm',  // a unique identifier for this form
  enableReinitialize: true,
  ...validateMethod
})(_LoginForm);

export {LoginForm};
