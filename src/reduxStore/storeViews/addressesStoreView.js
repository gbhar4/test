/** @module addressesStoreView
 *
 * @author Ben
 */
import {ADDREESS_TYPE} from 'reduxStore/storeReducersAndActions/addresses/addresses.js';

export const addressesStoreView = {
  getDefaultPlccAddress,
  getAddressBook,
  getAddressByKey,
  getAddressByAddressId,
  getDefaultAddress,
  getCountriesOptionsMap,
  getCountriesStatesTable,
  getSuggestedAddresses,
  isVerifyAddressModalOpen,
  getAddressPendingVerification,
  getAddressVerificationStatus,
  getAddressVerificationMessage,
  getAddressVerifySubmitCallback,
  getAddressVerifyDismissCallback
};

function getAddressBook (state, country, noBillingAddresses) {
  if (!country) {
    if (noBillingAddresses) {
      return state.addresses.addressBook.filter((entry) => entry.type !== ADDREESS_TYPE.BILLING);
    } else {
      return state.addresses.addressBook;
    }
  } else {
    let filtered = state.addresses.addressBook.filter((entry) => entry.address.country === country && (!noBillingAddresses || entry.type !== ADDREESS_TYPE.BILLING));
    let defaultAddress = filtered.find((addressEntry) => addressEntry.isDefault);

    // REVIEW: if there's no default for the selected requested country (country filter might leave it out)
    // then flag the first one as default. Can't be on the abstractor,
    // unless we store different versions of the address book (per country)
    // but I'm not sure about location because storeviews trigger on everything and want to avoid unnecesary renders
    if (!defaultAddress) {
      return filtered.map((entry, index) => {
        return {
          ...entry,
          isDefault: index === 0
        };
      });
    } else {
      return filtered;
    }
  }
}

function getDefaultAddress (state, country, noBillingAddresses) {
  let countryFilteredAddresses = getAddressBook(state, country, noBillingAddresses);
  let defaultAddress = countryFilteredAddresses.find((addressEntry) => addressEntry.isDefault);

  if (countryFilteredAddresses.length && !defaultAddress) {
    return countryFilteredAddresses[0];
  } else {
    return defaultAddress;
  }
}

function getAddressByKey (state, addressKey) {
  return state.addresses.addressBook.find((address) => address.addressKey === addressKey);
}

function getAddressByAddressId (state, addressId) {
  return state.addresses.addressBook.find((address) => address.addressId === addressId);
}

function getCountriesOptionsMap (state) {
  return state.addresses.countriesList;
}

function getCountriesStatesTable (state) {
  return state.addresses.countriesStatesTable;
}

function getAddressPendingVerification (state) {
  return state.addresses.addressVerificationData.addressPendingVerification;
}

function getAddressVerificationStatus (state) {
  return state.addresses.addressVerificationData.status;
}

function getAddressVerificationMessage (state) {
  return state.addresses.addressVerificationData.message;
}

function getAddressVerifySubmitCallback (state) {
  return state.addresses.addressVerificationData.submitCallback;
}

function getAddressVerifyDismissCallback (state) {
  return state.addresses.addressVerificationData.dismissCallback;
}

function getDefaultPlccAddress (state) {
  return state.addresses.defaultPlccAddress;
}

function getSuggestedAddresses (state) {
  return state.addresses.addressVerificationData.suggestedAddresses;
}

function isVerifyAddressModalOpen (state) {
  return state.addresses.addressVerificationData.isModalOpen;
}
