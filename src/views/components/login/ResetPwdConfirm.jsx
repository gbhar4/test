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
import {HELP_CENTER_SECTIONS} from 'routing/routes/helpCenterRoutes.js';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.resetPassword.scss');
} else {  // eslint-disable-line
  require('./_m.resetPassword.scss');
}

class ResetPwdConfirm extends React.Component {
  static propTypes = {
    /** calback for clicks on "back to login button" */
    onBackToLoginClick: PropTypes.func.isRequired,

    isShowBackToLoginButton: PropTypes.bool
  }

  render () {
    let { children, onBackToLoginClick, isShowBackToLoginButton } = this.props;

    return (
      <div className="reset-password reset-password-confirm">
        <div className="message message-container">
          {isShowBackToLoginButton && <button type="button" className="back-to-login-button" onClick={onBackToLoginClick}> &lt; Log In</button>}
          <h3 className="reset-password-form-title">Forgot your password? <br /> Don&apos;t worry!</h3>
          <p>Enter your email address below and we&apos;ll send you instructions to reset your password.</p>
        </div>

        <p className="success-box" aria-describedby="lname_error">
          Check your email! We’ve just sent you instructions to reset your password. <br />
          Didn't get your email? Check your spam, or <HyperLink destination={HELP_CENTER_SECTIONS.contactUs} pathSuffix="#customer_service">click here</HyperLink> to contact customer service.
        </p>

        <button type="button" onClick={onBackToLoginClick} className="button-primary">Return to login</button>

        {children}
      </div>
    );
  }
}

export {ResetPwdConfirm};
