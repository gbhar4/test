import {getUserAbstractor} from 'service/userServiceAbstractor';
import {logErrorAndServerThrow, getSubmissionError} from '../operatorHelper';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {getUserOperator} from 'reduxStore/storeOperators/userOperator';
import {getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';
import {setIsGuest, setIsRemembered} from 'reduxStore/storeReducersAndActions/user/user';
import {LOGIN_FORM_TYPES} from 'reduxStore/storeReducersAndActions/globalComponents/header/reducer.js';
import {getR3Abstractor} from 'service/R3ServiceAbstractor';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {getRoutingOperator} from 'reduxStore/storeOperators/routingOperator';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';
import {PAGES} from 'routing/routes/pages';
import {matchPath} from 'react-router';

let previous = null;
let getUserFormOperator = function (store) {
  if (!previous || previous.store !== store) {
    previous = new UserFormOperator(store);
  }
  return previous;
};

class UserFormOperator {
  constructor (store) {
    this.store = store;
    // create this-bound varsions of all methods of this class whoes name that start with 'submit'
    bindAllClassMethodsToThis(this, 'submit');

    // #if LEGACY
    window.userLoggedIn = () => {
      return getUserOperator(store).setUserBasicInfo().catch((err) => {
        logErrorAndServerThrow(store, 'submitLoginForm,setUserBasicInfo', err);
        store.dispatch([setIsGuest(false), setIsRemembered(false)]);
      });
    };
    // #endif
  }

  get userServiceAbstractor () {
    return getUserAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  get r3ServiceAbstractor () {
    return getR3Abstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  submitLogin (formData) {
    let storeState = this.store.getState();
    let {emailAddress, password, rememberMe} = formData;
    let plccCardId = formData.savePlcc && userStoreView.getUserPlccCardId(storeState);

    return this.userServiceAbstractor.login(emailAddress, password, rememberMe, plccCardId).then((res) => {
      if (plccCardId) {
        return getRoutingOperator(this.store).gotoPage(MY_ACCOUNT_SECTIONS.paymentAndGiftCards); // routinng to payment require by Mark
      }

      // note that we catch in here beacuse we do not want a failed attempt to get the user info to
      // give the impression of a failed login
      let pendingPromises = [];
      let userOperator = getUserOperator(this.store);

      pendingPromises.push(userOperator.setUserBasicInfo().catch((err) => {
        logErrorAndServerThrow(this.store, 'submitLoginForm,setUserBasicInfo', err);
        this.store.dispatch([setIsGuest(false), setIsRemembered(false)]);
      }));

      return Promise.all(pendingPromises);
    }).catch((err) => {
      throw getSubmissionError(this.store, 'login', err);
    });
  }

  submitLogout () {
    return this.userServiceAbstractor.logout().then((res) => {
      let pathname = window.location.pathname;

      // checkout and cart get reset by the server when logging out, and myAccouint is not availbale
      // thus we redirect to home page
      if (matchPath(pathname, {path: PAGES.cart.pathPattern}) ||
        matchPath(pathname, {path: PAGES.checkout.pathPattern}) ||
        matchPath(pathname, {path: PAGES.myAccount.pathPattern}) ||
        matchPath(pathname, {path: PAGES.changePassword.pathPattern})) {
        return getRoutingOperator(this.store).gotoPage(PAGES.homePage);
      } else {
        // reload page to flush redux-store and refresh page personality if needed (e.g. in favorites)
        return window.location.reload(true); // eslint-disable-line no-undef
      }
    }).catch((err) => {
      throw getSubmissionError(this.store, 'logout', err);
    });
  }

  submitRegister (formData, modifiers) {
    let storeState = this.store.getState();
    let plccCardId = formData.savePlcc && userStoreView.getUserPlccCardId(storeState);

    return this.userServiceAbstractor.register({
      ...formData,
      plccCardId: plccCardId
    }).then((res) => {
      if (plccCardId && (!modifiers || modifiers.redirect)) {
        return getRoutingOperator(this.store).gotoPage(MY_ACCOUNT_SECTIONS.paymentAndGiftCards);
      }

      // NOTE: remove for R5 once global components are ours (vs Skava)
      // need to refresh because navigation changes (on Skava)
      let isMobile = routingInfoStoreView.getIsMobile(storeState);
      if (isMobile && (!modifiers || modifiers.redirect)) {
        window.location.reload(true); // eslint-disable-line no-undef
      }

      // #if LEGACY
      if (!modifiers || modifiers.redirect) {
        window.location.reload(true); // eslint-disable-line no-undef
      }
      // #endif

      setTimeout(() => {
        // note that we catch in here beacuse we do not want a failed attempt to get the user info to
        // give the impression of a failed registration
        getUserOperator(this.store).setUserBasicInfo().then(() => getGlobalSignalsOperator(this.store).closeAuthModal()).catch((err) => {
          logErrorAndServerThrow(this.store, 'submitRegister,setUserBasicInfo', err);
          this.store.dispatch([setIsGuest(false), setIsRemembered(false)]);
          getGlobalSignalsOperator(this.store).closeAuthModal();
        });
      }, 2000);

      return true;
    })
    .catch((err) => {
      throw getSubmissionError(this.store, 'submitRegister', err);
    });
  }

  submitForgotPasswordEmailRequest (formData, isAuth) {
    return this.userServiceAbstractor.getPasswordResetEmail(formData.emailAddress).then((res) => {
      if (isAuth === true) {
        return getGlobalSignalsOperator(this.store).openAuthForgotPasswordConfirmationModal();
      } else {
        return getGlobalSignalsOperator(this.store).openSelectedLoginDrawerForm(LOGIN_FORM_TYPES.PASSWORD_RESET_CONFIRM);
      }
    }).catch((err) => {
      throw getSubmissionError(this.store, 'forgotPasswordEmailRequest', err);
    });
  }

  submitResetPassword (formData) {
    return this.userServiceAbstractor.setNewPassword(formData.password, formData.confirmPassword).then(() => {
      return getGlobalSignalsOperator(this.store).openSelectedLoginDrawerForm(LOGIN_FORM_TYPES.LOGIN_AFTER_PWD_RESET);
    }).catch((err) => {
      throw getSubmissionError(this.store, 'submitResetPassword', err);
    });
  }

  submitNewPassword (formData) {
    let changePasswordData = {
      currentPassword: formData.currentPassword,
      newPassword: formData.password,
      newPasswordVerify: formData.confirmPassword
    };

    return this.r3ServiceAbstractor.updateProfileInfo(changePasswordData).catch((err) => {
      throw getSubmissionError(this.store, 'submitNewPassword', err);
    });
  }
}

export {getUserFormOperator};
