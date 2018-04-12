/** @module AuthenticationErrorMessage
 * A component for displaying error messages in user authentication forms (login, create account, reset password, request reset password)
 *
 * @author Agustin
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';

let ERROR_CODES = {
  EXISTING_ACCOUNT: 10001,
  ACCOUNT_LOCKED: 10002,
  TOKEN_EXPIRED: 10003
};

export class AuthenticationErrorMessage extends React.Component {
  static propTypes = {
    error: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.object.isRequired]).isRequired,

    /* Flag representing whether the user is 'remembered' or not */
    isRememberedUser: PropTypes.bool.isRequired
  }

  render () {
    let {error, onOpenForgotPassword, isRememberedUser} = this.props;

    if (error.errorCode === ERROR_CODES.EXISTING_ACCOUNT) {
      return (<p className="error-box">
        <i className="error-icon">Error </i>
        <span className="error-text">The email address you entered matches an existing account.
        Did you forget your password? To reset it, <button type="button" onClick={onOpenForgotPassword}>click here</button>.</span>
      </p>);
    } else if (error.errorCode === ERROR_CODES.ACCOUNT_LOCKED) {
      return (<p className="error-box">
              <i className="error-icon">Error</i>
              <span className="error-text">
              Sorry, you've entered an incorrect password multiple times. For your security, the account has been locked.
              {!isRememberedUser ? 'Please ' : null}
              {!isRememberedUser ? <button type="button" onClick={onOpenForgotPassword}>click here</button> : null}
              {!isRememberedUser ? ' to reset your password.' : null}
              </span>
            </p>);
    } else if (error.errorCode === ERROR_CODES.TOKEN_EXPIRED) {
      return (<p className="error-box">
        <i className="error-icon">Error</i>
        <span className="error-text">This password reset link has expired. Please <button type="button" onClick={onOpenForgotPassword}>click here</button> to request a new password reset.</span>
      </p>);
    } else {
      return (<p className="error-box">
        <i className="error-icon">Error</i>
        <span className="error-text">{error}</span>
      </p>);
    }
  }
}
