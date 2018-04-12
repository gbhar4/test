/** @module
 * @summary action crerators for manipulating addresses related information.
 *
 * @author Ben
 */

export function getSetAddressBookActn (addressBook) {
  return {
    addressBook: addressBook,
    type: 'ADDRESSES_SET_ADDRESS_BOOK'
  };
}

export function getAddAddressToBookActn (address) {
  return {
    address: address,
    type: 'ADDRESSES_ADD_TO_BOOK'
  };
}

export function getUpdateAddressInBookActn (addressKey, address) {
  return {
    addressKey: addressKey,
    address: address,
    type: 'ADDRESSES_UPDATE_IN_BOOK'
  };
}

export function getRemoveAddressInBookActn (addressKey) {
  return {
    addressKey: addressKey,
    type: 'ADDRESSES_REMOVE_IN_BOOK'
  };
}

export function getSetCountriesListActn (countriesList) {
  return {
    countriesList: countriesList,
    type: 'ADDRESSES_SET_COUNTRIES_LIST'
  };
}

export function getSetCountriesStatesTableActn (countriesStatesTable) {
  return {
    countriesStatesTable: countriesStatesTable,
    type: 'ADDRESSES_SET_COUNTRIES_STATES_TABLE'
  };
}

export function getSetAddressVerifyResultActn (suggestedAddresses, result) {
  return {
    suggestedAddresses: suggestedAddresses,
    status: result.status,
    message: result.message,
    type: 'ADDRESSES_SET_VERIFY_RESULT'
  };
}

export function getSetAddressPendingVerificationActn (addressPendingVerification) {
  return {
    addressPendingVerification: addressPendingVerification,
    type: 'ADDRESSES_SET_VERIFY_PENDING'
  };
}

export function getSetVerificationModalOpenActn (isModalOpen) {
  return {
    isModalOpen: isModalOpen,
    type: 'ADDRESSES_SET_VERIFY_MODAL_OPEN'
  };
}

export function getSetVerificationModalCallbacks (submitCallback, dismissCallback) {
  return {
    submitCallback: submitCallback,
    dismissCallback: dismissCallback,
    type: 'ADDRESSES_SET_VERIFY_MODAL_CALLBACKS'
  };
}

export function getSetPlccDefaultAddressActn (defaultPlccAddress) {
  return {
    defaultPlccAddress,
    type: 'ADDRESSES_SET_PLCC_DEFAULT_ADDRESS'
  };
}
