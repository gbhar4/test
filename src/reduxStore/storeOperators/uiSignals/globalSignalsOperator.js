import Immutable from 'seamless-immutable';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {getCartOperator} from 'reduxStore/storeOperators/cartOperator';
import {globalSignalsStoreView} from 'reduxStore/storeViews/globalSignalsStoreView.js';
import {
  DRAWER_IDS, LOGIN_FORM_TYPES,
  setCountrySelectorVisible,
  setTrackOrderVisible,
  setTrackReservationVisible,
  setActiveDrawer,
  setActiveLoginDrawerForm,
  getSetAuthActiveFormActn,
  getSetIsAuthBackToLoginEnabledActn,
  getSetIsCheckoutLoginModalActiveAction,
  getSetAddedToBagNotificationVisible,
  setIsHamburgerMenuOpenActn
} from 'reduxStore/storeReducersAndActions/globalComponents/globalComponents';

import {getUserOperator} from 'reduxStore/storeOperators/userOperator';
import {getOrdersOperator} from 'reduxStore/storeOperators/ordersOperator';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {observeStore} from 'reduxStore/util/observeStore';
import {couponsAndPromosStoreView} from 'reduxStore/storeViews/couponsAndPromosStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';
import {getRoutingOperator} from 'reduxStore/storeOperators/routingOperator';

export {DRAWER_IDS, LOGIN_FORM_TYPES};

export const AUTHENTICATION_MODAL_FORM_IDS = Immutable({
  REQUEST_PASSWORD_RESET: 'request-password-reset',
  CREATE_ACCOUNT: 'create-account',
  LOGIN: 'login',
  LOGIN_FOR_CHECKOUT: 'login-for-checkout',
  PASSWORD_RESET_CONFIRM: 'password-reset-confirm',
  NONE: null
});

let previous = null;
export function getGlobalSignalsOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new GlobalSignalsOperator(store);
  }
  return previous;
}

class GlobalSignalsOperator {
  constructor (store) {
    this.store = store;

    // create this-bound varsions of all methods of this class
    bindAllClassMethodsToThis(this);
  }

  get routingOperator () {
    return getRoutingOperator(this.store);
  }

  openTrackOrderModal () {
    return this.store.dispatch(setTrackOrderVisible(true));
  }

  openTrackReservationModal () {
    return this.store.dispatch(setTrackReservationVisible(true));
  }

  closeTrackOrderModal () {
    return this.store.dispatch(setTrackOrderVisible(false));
  }

  closeAddedToBagNotification () {
    return this.store.dispatch(getSetAddedToBagNotificationVisible(false));
  }

  openLoginForTrackOrder () {
    this.closeTrackOrderModal();

    let gotoPage = this.routingOperator.gotoPage;
    let unsubscribeToLogin = observeStore(
      this.store,
      (state) => userStoreView.isGuest(state),
      (oldIsGuest, newIsGuest) => {
        !newIsGuest && gotoPage(MY_ACCOUNT_SECTIONS.orders);
        unsubscribeToLogin();
        unsubscribeToDrawerClose();
      },
      true
    );

    // if the modal closed without logging-in, we shouldn't listen to the login event anymore
    let unsubscribeToDrawerClose = observeStore(
      this.store,
      (state) => globalSignalsStoreView.getActiveDrawer(state),
      (oldOpened, newOpened) => {
        if (!newOpened || newOpened === DRAWER_IDS.EMPTY) {
          unsubscribeToLogin();
          unsubscribeToDrawerClose();
        }
      },
      true
    );

    return this.openSelectedDrawer(DRAWER_IDS.LOGIN);
  }

  closeTrackReservationModal () {
    return this.store.dispatch(setTrackReservationVisible(false));
  }

  openCountrySelectorModal () {
    return this.store.dispatch(setCountrySelectorVisible(true));
  }

  closeCountrySelectorModal () {
    return this.store.dispatch(setCountrySelectorVisible(false));
  }

  openSelectedDrawer (drawerReference) {
    if (!drawerReference || drawerReference === DRAWER_IDS.EMPTY) {
      return this.closeDrawers();
    }

    if (drawerReference === DRAWER_IDS.LOGIN) {
      this.openSelectedLoginDrawerForm();
    } else if (drawerReference === DRAWER_IDS.MINI_CART) {
      this.store.dispatch(setActiveDrawer(DRAWER_IDS.MINI_CART));
      getCartOperator(this.store).loadFullCartDetails();
    } else if (drawerReference === DRAWER_IDS.MY_ACCOUNT) {
      this.store.dispatch(setActiveDrawer(DRAWER_IDS.MY_ACCOUNT));
      let siteId = sitesAndCountriesStoreView.getCurrentSiteId(this.store.getState());
      // Safely call getSiteOrdersHistoryPage always because it implements its
      // own cache.
      getOrdersOperator(this.store).getSiteOrdersHistoryPage(siteId, 1);
      if (!couponsAndPromosStoreView.isPromosLoaded(this.store.getState())) {
        getUserOperator(this.store).getAllAvailableCouponsAndPromos();
      }
    } else {
      this.store.dispatch(setActiveDrawer(drawerReference));
    }
  }

  /* Open Create Account Drawer */
  openCreateAccountDrawer () {
    this.openSelectedDrawer(DRAWER_IDS.CREATE_ACCOUNT);
  }

  /* Open Login Drawer */
  openLoginDrawer () {
    this.openSelectedLoginDrawerForm(DRAWER_IDS.LOGIN);
  }

  /* Open Wishlist Login Drawer */
  openWishlistLoginDrawer () {
    this.openSelectedDrawer(DRAWER_IDS.WISHLIST_LOGIN);
  }

  openForgotPasswordForm () {
    // auth is the centered modal
    let isAuthVisible = globalSignalsStoreView.getIsAuthVisible(this.store.getState());

    if (isAuthVisible) {
      this.openAuthForgotPasswordModal();
    } else {
      this.openSelectedLoginDrawerForm(LOGIN_FORM_TYPES.REQUEST_PASSWORD_RESET);
    }
  }

  openSelectedLoginDrawerForm (formReference = LOGIN_FORM_TYPES.LOGIN) {
    return this.store.dispatch([
      setActiveDrawer(DRAWER_IDS.LOGIN),
      setActiveLoginDrawerForm(formReference)
    ]);
  }

  setSelectedLoginDrawerForm (formReference) {
    return this.store.dispatch(setActiveLoginDrawerForm(formReference));
  }

  closeDrawers () {
    return this.store.dispatch(setActiveDrawer(DRAWER_IDS.EMPTY));
  }

  // Auth Modals signals
  openAuthRegistrationModal (isBackToLoginEnabled) {
    return this.store.dispatch([
      getSetIsAuthBackToLoginEnabledActn(isBackToLoginEnabled),
      getSetAuthActiveFormActn(AUTHENTICATION_MODAL_FORM_IDS.CREATE_ACCOUNT)
    ]);
  }

  openAuthForgotPasswordModal () {
    return this.store.dispatch([
      getSetIsAuthBackToLoginEnabledActn(true),
      getSetAuthActiveFormActn(AUTHENTICATION_MODAL_FORM_IDS.REQUEST_PASSWORD_RESET)
    ]);
  }

  openAuthForgotPasswordConfirmationModal () {
    return this.store.dispatch([
      getSetIsAuthBackToLoginEnabledActn(true),
      getSetAuthActiveFormActn(AUTHENTICATION_MODAL_FORM_IDS.PASSWORD_RESET_CONFIRM)
    ]);
  }

  openAuthLoginModal (loginCallback = Promise.resolve.bind(Promise), dismissCallback = Promise.resolve.bind(Promise)) {
    this.store.dispatch([
      getSetIsAuthBackToLoginEnabledActn(false),
      getSetAuthActiveFormActn(AUTHENTICATION_MODAL_FORM_IDS.LOGIN),
      getSetIsCheckoutLoginModalActiveAction(false)
    ]);

    return this.observeLogin(loginCallback, dismissCallback);
  }

  openAuthLoginForCheckoutModal (loginCallback = Promise.resolve.bind(Promise), dismissCallback = Promise.resolve.bind(Promise)) {
    this.store.dispatch([
      getSetIsAuthBackToLoginEnabledActn(false),
      getSetAuthActiveFormActn(AUTHENTICATION_MODAL_FORM_IDS.LOGIN_FOR_CHECKOUT),
      getSetIsCheckoutLoginModalActiveAction(true)
    ]);

    return this.observeLogin(loginCallback, dismissCallback);
  }

  openBackToLoginModal () {
    let CheckoutLoginModal = globalSignalsStoreView.getIsCheckoutLoginModalActive(this.store.getState());
    return CheckoutLoginModal ? this.openAuthLoginForCheckoutModal() : this.openAuthLoginModal();
  }

  closeAuthModal () {
    return this.store.dispatch([
      getSetAuthActiveFormActn(AUTHENTICATION_MODAL_FORM_IDS.NONE),
      getSetIsCheckoutLoginModalActiveAction(false)
    ]);
  }

  // callback returns a promise
  observeLogin (callback, dismissCallback) {
    return new Promise((resolve, reject) => {
      let unsubscribeToLogin = observeStore(
        this.store,
        (state) => userStoreView.isGuest(state),
        (oldIsGuest, newIsGuest) => {
          if (oldIsGuest && !newIsGuest) {
            resolve(callback());
            unsubscribeToLogin();
            unsubscribeToModalClose();
          }
        },
        true
      );

      // if the modal closed without logging-in, we shouldn't listen to the login event anymore
      let unsubscribeToModalClose = observeStore(
        this.store,
        (state) => globalSignalsStoreView.getAuthActiveForm(state),
        (oldOpened, newOpened) => {
          if (!newOpened || newOpened === AUTHENTICATION_MODAL_FORM_IDS.NONE) {
            resolve(dismissCallback());
            unsubscribeToLogin();
            unsubscribeToModalClose();
          }
        },
        true
      );
    });
  }

  setIsHamburgerMenuOpen (isHamburgerMenuOpen) {
    return this.store.dispatch(setIsHamburgerMenuOpenActn(isHamburgerMenuOpen));
  }

}
