/**
 * @module AuthModal
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * Modal for showing one of the forms related to authentication, i.e.,
 * Login, creat-account, and request reset password.
 *
 * Component Props description/enumeration:
 *  @param {string} activeForm: authentication related form to show.
 *  @param {bool} isOpen: whether the modal should be open.
 *  @param {bool} backToLogInVisible: whether the button to return to login
 *    should be visible.
 *  @param {bool} isGuestCheckout: whether the modal was opened to start with
 *    checkout.
 *  @param {string} checkoutLoginNotification: notification to show to the user
 *    along with the login form.
 *
 * Style (ClassName) Elements description/enumeration
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {Modal} from 'views/components/modal/Modal.jsx';
import cssClassName from 'util/viewUtil/cssClassName';
import {CreateAccountFormContainer} from 'views/components/account/createAccount/CreateAccountFormContainer';
import {LoginFormContainer} from './LoginFormContainer';
import {ResetPwdRequestFormContainer} from './ResetPwdRequestFormContainer';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';
import {ResetPwdConfirm} from 'views/components/login/ResetPwdConfirm.jsx';
import {AUTHENTICATION_MODAL_FORM_IDS} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';
import {PAGES} from 'routing/routes/pages';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';

class AuthModal extends React.Component {
  static propTypes = {
    activeForm: PropTypes.oneOf([
      AUTHENTICATION_MODAL_FORM_IDS.REQUEST_PASSWORD_RESET,
      AUTHENTICATION_MODAL_FORM_IDS.LOGIN,
      AUTHENTICATION_MODAL_FORM_IDS.LOGIN_FOR_CHECKOUT,
      AUTHENTICATION_MODAL_FORM_IDS.CREATE_ACCOUNT
    ]),
    isOpen: PropTypes.bool.isRequired,
    backToLogInVisible: PropTypes.bool,
    checkoutLoginNotification: PropTypes.string,

    globalSignalsOperator: PropTypes.object.isRequired,

    /** Callback for handling submit of login form */
    submitLogin: PropTypes.func.isRequired,

    /** Callback for handling submit of create account form */
    submitCreateAccount: PropTypes.func.isRequired,

    /** whether or not rewards are enabled */
    isRewardsEnabled: PropTypes.bool.isRequired,

    /** This is a flag to enable us to toggle between copy changes for internationalization */
    isCountryUS: PropTypes.bool
  }

  constructor (props) {
    super(props);

    this.handleCreateAccount = this.handleCreateAccount.bind(this);
    this.handleStartGuestCheckout = () => this.props.startGuestCheckout();
  }

  handleCreateAccount () {
    this.props.globalSignalsOperator.openAuthRegistrationModal(true);
  }

  renderLoginOrResetFooter () {
    let {activeForm, isRemembered, isRewardsEnabled, isCountryUS} = this.props;

    if (isRemembered) {
      return null;
    }

    if (activeForm === AUTHENTICATION_MODAL_FORM_IDS.LOGIN_FOR_CHECKOUT) {
      return (<div className="continue-guest-container">
        <HyperLink destination={PAGES.checkout} className="button-secondary continue-guest">Continue as Guest</HyperLink>

        {isRewardsEnabled && isCountryUS
          ? <p className="button-guest-message new-account">Don't have an account?<br />
            <button type="button" className="button-create-account" onClick={this.handleCreateAccount}>Create one</button> now to earn points on this purchase!</p>
          : <p className="button-guest-message new-account">Don’t have an account? No problem!<br />
          You can create a MY PLACE account after checkout.</p>
        }
      </div>);
    }

    return (isRewardsEnabled && isCountryUS
      ? <p className="new-account">Don&apos;t have an account? <br />
        <button type="button" onClick={this.handleCreateAccount} className="button-create-account no-margin">Create one</button> now to start earning points!
      </p>
      : <p className="new-account">Don&apos;t have an account? <br />
        <button type="button" onClick={this.handleCreateAccount} className="button-create-account no-margin">Create one</button> now for faster checkout.
      </p>);
  }

  render () {
    let {isCountryUS, activeForm, isRemembered, isRewardsEnabled, isOpen, backToLogInVisible, checkoutLoginNotification,
      submitLogin, submitCreateAccount, submitResetPassword,
      globalSignalsOperator: {openBackToLoginModal, closeAuthModal, openAuthForgotPasswordModal} } = this.props;
    let containerModalClass = cssClassName('react-overlay ', 'overlay-center ', 'overlay-login-and-reset-form');

    if (!isOpen) {
      return null;
    }

    let modalTitle = isCountryUS ? 'Welcome Back!' : '';
    return (
      <Modal contentLabel="Authentication Modal" className="overlay-container" overlayClassName={containerModalClass} onRequestClose={closeAuthModal} preventEventBubbling isOpen>
        {backToLogInVisible && <button type="button" onClick={openBackToLoginModal} className="back-to-login-button"> &lt; Back to Log In</button>}

        <ModalHeaderDisplayContainer onCloseClick={closeAuthModal} />

        {(activeForm === AUTHENTICATION_MODAL_FORM_IDS.LOGIN || activeForm === AUTHENTICATION_MODAL_FORM_IDS.LOGIN_FOR_CHECKOUT) &&
          <LoginFormContainer title={modalTitle}
            subtitle={
              isRewardsEnabled && isCountryUS
              ? <span>Log in to earn points for <b>MY PLACE REWARDS</b>.</span>
              : <span>Please log into your MY PLACE account <br />for faster checkout.</span>
            }
            parentNotification={checkoutLoginNotification} isShowRemember
            isShowForgot={!isRemembered}
            isShowRememberedLogOut={isRemembered}
            onForgotPasswordClick={openAuthForgotPasswordModal}
            onSubmit={submitLogin}
            isHideESpot isEmailAddressDisabled={isRemembered}>

            {this.renderLoginOrResetFooter()}
          </LoginFormContainer>}

        {activeForm === AUTHENTICATION_MODAL_FORM_IDS.CREATE_ACCOUNT && <CreateAccountFormContainer
          isAuthModal={true} onSubmit={submitCreateAccount}
          onForgotPasswordClick={openAuthForgotPasswordModal}
        />}

        {activeForm === AUTHENTICATION_MODAL_FORM_IDS.REQUEST_PASSWORD_RESET &&
          <ResetPwdRequestFormContainer onSubmit={submitResetPassword} isHideBackButton>
            {this.renderLoginOrResetFooter()}
          </ResetPwdRequestFormContainer>
        }

        {activeForm === AUTHENTICATION_MODAL_FORM_IDS.PASSWORD_RESET_CONFIRM &&
          <ResetPwdConfirm onBackToLoginClick={openBackToLoginModal} />
        }
      </Modal>
    );
  }
}

export {AuthModal};
