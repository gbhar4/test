/** @module DesktopDrawerLogin
 * Destkop drawer for showing Login, or request-reset password, or reset password or create-account forms.
 * This is needed because there's only one tab (Log In) for both of them.
 *
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {ResetPwdRequestFormContainer} from './ResetPwdRequestFormContainer';
import {ResetPwdConfirm} from './ResetPwdConfirm.jsx';
import {PasswordResetFormContainer} from './PasswordResetFormContainer';
import {DrawerFooterContainer} from 'views/components/globalElements/header/DrawerFooterContainer';
import {LoginFormContainer} from './LoginFormContainer.js';
import {DRAWER_IDS, LOGIN_FORM_TYPES} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator.js';

if (DESKTOP) { // eslint-disable-line
  require('./_d.login.scss');
} else {  // eslint-disable-line
  require('./_m.login.scss');
}

export class DesktopDrawerLogin extends React.Component {
  static propTypes = {
    /** Flags indicates whether the user is a remembered guest */
    isRemembered: PropTypes.bool,

    /** optional extra callback for calling after a successfull logout */
    onSuccessfulLogout: PropTypes.func,

    /** The type of form to show in this drawer */
    activeFormId: PropTypes.oneOf([
      LOGIN_FORM_TYPES.REQUEST_PASSWORD_RESET,
      LOGIN_FORM_TYPES.PASSWORD_RESET,
      LOGIN_FORM_TYPES.PASSWORD_RESET_CONFIRM,
      LOGIN_FORM_TYPES.LOGIN,
      LOGIN_FORM_TYPES.LOGIN_AFTER_PWD_RESET
    ]).isRequired,

    /** whether or not rewards are enabled */
    isRewardsEnabled: PropTypes.bool.isRequired,

    /**
     * A callback to change the displayed form in this drawer.
     * Accepts a single prop which is the ID of the form (see LOGIN_FORM_TYPES)
     */
    changeForm: PropTypes.func.isRequired,
    /**
     * A callback to change the displayed form.
     * Accepts a single prop which is the ID of the drawer (see DRAWER_IDS)
     */
    changeDrawer: PropTypes.func.isRequired,

    /** This is a flag to enable us to toggle between copy changes for internationalization */
    isCountryUS: PropTypes.bool
  }

  constructor (props) {
    super(props);

    this.handleBackToLoginClick = () => this.props.changeForm(LOGIN_FORM_TYPES.LOGIN);
    this.handleForgotPasswordClick = () => this.props.changeForm(LOGIN_FORM_TYPES.REQUEST_PASSWORD_RESET);
    this.onSuccessfulLogin = () => this.props.changeDrawer(DRAWER_IDS.MY_ACCOUNT);
  }

  render () {
    let {activeFormId, isRemembered, isRewardsEnabled, onSuccessfulLogout, isCountryUS} = this.props;
    let loginTitle = 'Welcome back!';
    let loginSubtitle;

    if (isRewardsEnabled && isCountryUS) {
      loginSubtitle = <span>Log in to earn points for <b>MY PLACE REWARDS</b></span>;
    } else {
      loginSubtitle = 'Please log into your MY PLACE account for faster checkout.';
    }

    return (
      <div className="login-drawer-container">
        {activeFormId === LOGIN_FORM_TYPES.REQUEST_PASSWORD_RESET &&
          <ResetPwdRequestFormContainer onBackToLoginClick={this.handleBackToLoginClick} />}

        {activeFormId === LOGIN_FORM_TYPES.PASSWORD_RESET &&
          <PasswordResetFormContainer onBackToLoginClick={this.handleBackToLoginClick} />}

        {activeFormId === LOGIN_FORM_TYPES.LOGIN &&
          <LoginFormContainer title={loginTitle} subtitle={loginSubtitle} isShowRemember
            isShowForgot={!isRemembered} isShowRememberedLogOut={isRemembered} isEmailAddressDisabled={isRemembered}
            onSubmitSuccess={this.onSuccessfulLogin} onForgotPasswordClick={this.handleForgotPasswordClick}
            onSuccessfulLogout={onSuccessfulLogout} />}

        {activeFormId === LOGIN_FORM_TYPES.LOGIN_AFTER_PWD_RESET &&
          <LoginFormContainer title="Thanks! Your password has been updated"
            onSubmitSuccess={this.onSuccessfulLogin} onSuccessfulLogout={onSuccessfulLogout}
            subtitle="Login with your new credentials below." isShowRemember isEmailAddressDisabled={isRemembered} />}

        {activeFormId === LOGIN_FORM_TYPES.PASSWORD_RESET_CONFIRM &&
          <ResetPwdConfirm onBackToLoginClick={this.handleBackToLoginClick} isShowBackToLoginButton />}

        {!isRemembered && <DrawerFooterContainer />}
      </div>
    );
  }

}
