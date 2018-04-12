export const globalSignalsStoreView = {
  getIsCountrySelectorVisible,
  getIsTrackOrderVisible,
  getIsTrackReservationVisible,
  getIsNavigationTreeActive,
  getActiveDrawer,
  getIsNewsLetterSignUpConfirming,
  getIsNewsLetterSignUpUpdating,
  getActiveForm,
  getActiveFormName,
  getIsCheckoutLoginModalActive,
  getIsAuthVisible,
  getAuthActiveForm,
  getIsAuthBackToLoginEnabled,
  getAuthNotification,
  getIsHamburgerMenuOpen
};

function getIsCountrySelectorVisible (state) {
  return state.globalComponents.footer.uiFlags.isCountrySelectorVisible;
}

function getIsCheckoutLoginModalActive (state) {
  return state.globalComponents.auth.uiFlags.isCheckoutLoginModalActive;
}

function getIsTrackOrderVisible (state) {
  return state.globalComponents.footer.uiFlags.isTrackOrderVisible;
}

function getIsTrackReservationVisible (state) {
  return state.globalComponents.footer.uiFlags.isTrackReservationVisible;
}

function getIsNavigationTreeActive (state) {
  return state.globalComponents.header.isNavigationTreeActive;
}

function getActiveDrawer (state) {
  return state.globalComponents.header.activeDrawer;
}

function getActiveForm (state) {
  return state.globalComponents.header.activeForm;
}

function getActiveFormName (state) {
  return state.globalComponents.header.activeFormName;
}

function getIsNewsLetterSignUpConfirming (state) {
  return state.globalComponents.footer.uiFlags.isNewsLetterSignUpConfirming;
}

function getIsNewsLetterSignUpUpdating (state) {
  return state.globalComponents.footer.uiFlags.isNewsLetterSignUpUpdating;
}

// Auth Modal
function getIsAuthVisible (state) {
  return !!state.globalComponents.auth.uiFlags.activeAuthForm;
}

function getAuthActiveForm (state) {
  return state.globalComponents.auth.uiFlags.activeAuthForm;
}

function getIsAuthBackToLoginEnabled (state) {
  return state.globalComponents.auth.uiFlags.isBackToLoginEnabled;
}

function getAuthNotification (state) {
  // FIXME: not sure how this needs to be calculated.
  // it's a message based on OOS products and other scenarios
  return null;
}

function getIsHamburgerMenuOpen (state) {
  return state.globalComponents.header.isHamburgerMenuOpen;
}
