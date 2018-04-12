import {FLASH_TYPES} from 'reduxStore/storeReducersAndActions/general/general.js';

export const generalStoreView = {
  getIsLoading,
  getOpenModalId,
  getConfirmModalOkCallback,
  getConfirmModalCancelCallback,
  getAllEspots,
  getEspotByName,
  getHeaderNavigationTree,
  getFooterNavigationTree,
  getFlashMessage,
  getFlashSuccessMessage,
  getFlashErrorMessage,
  getFlashMessageExpiresNow,
  getIsRecapchaEnabled,
  getIsWicFormEnabled,
  getIsPrescreenFormEnabled,
  getSetIsCommunicationPreferencesEnabled
};

function getIsLoading (state) {
  return state.general.uiFlags.isLoading;
}

function getOpenModalId (state) {
  return state.general.uiFlags.modals.openModalId;
}

function getConfirmModalOkCallback (state) {
  return state.general.uiFlags.modals.okCallback;
}

function getConfirmModalCancelCallback (state) {
  return state.general.uiFlags.modals.cancelCallback;
}

function getAllEspots (state) {
  return state.general.espots;
}

function getEspotByName (state, name) {
  return state.general.espots[name];
}

function getHeaderNavigationTree (state) {
  return state.globalComponents.header.navigationTree;
}

function getFooterNavigationTree (state) {
  return state.globalComponents.footer.navigationTree;
}

/** Returns flash message regardless of its type */
function getFlashMessage (state) {
  return state.general.flash.message;
}

/**
 * Returns success flash message, or null if there's no current message of this
 * type.
 */
function getFlashSuccessMessage (state) {
  return state.general.flash.type === FLASH_TYPES.SUCCESS ? state.general.flash.message : null;
}

/**
 * Returns error flash message, or null if there's no current message of this
 * type.
 */
function getFlashErrorMessage (state) {
  return state.general.flash.type === FLASH_TYPES.ERROR ? state.general.flash.message : null;
}

function getFlashMessageExpiresNow (state) {
  return state.general.flash.expiresNow;
}

function getIsRecapchaEnabled (state) {
  return state.session.siteDetails.isRecapchaEnabled;
}

function getIsWicFormEnabled (state) {
  return state.session.siteDetails.isWicFormEnabled;
}

function getIsPrescreenFormEnabled (state) {
  return state.session.siteDetails.isPrescreenFormEnabled;
}

function getSetIsCommunicationPreferencesEnabled (state) {
  return state.session.siteDetails.isCommunicationPreferencesEnabled;
}
