/** @module
 * @summary reducer for addresses related information.
 *
 * @author Ben
 * @author Noam (shouldn't be allow to be called an author, im a worseless piece of crap)
 */

import Immutable from 'seamless-immutable';
let countriesAndStates = require('service/resources/CountriesAndStates.json');

export const ADDREESS_TYPE = Immutable({
  SHIPPING: 'Shipping',
  BILLING: 'Billing',
  SHIPPINGANDBILLING: 'ShippingAndBilling'
});

export const VERIFICATION_STATUS = Immutable({
  VALID: 'valid',
  INVALID: 'invalid',
  APARTMENT_MISSING: 'aptMissing'
});

const defaultAddressesStore = Immutable({
  addressBook: [],
  addressVerificationData: {
    isModalOpen: false,
    addressPendingVerification: {},
    suggestedAddresses: [],
    status: VERIFICATION_STATUS.INVALID,
    message: {
      text: '',
      className: ''
    },
    submitCallback: null,
    dismissCallback: null
  },
  defaultPlccAddress: null,
  countriesList: countriesAndStates.countriesOptionsMap,
  countriesStatesTable: countriesAndStates.countriesStatesTable
});

/**
 * Remove from the given addressBook the address with the given addressKey. If
 * the removed address was the default, make the first remaing address in the
 * book the new default address.
 */
const removeAddressFromBook = function (addressBook, addressKey) {
  let mutableAddressBook = Immutable.asMutable(addressBook, {deep: true});
  let addressToRemove = mutableAddressBook.find((address) => { return address.addressKey === addressKey; });
  let newAddressBook = mutableAddressBook.filter((address) => { return address !== addressToRemove; });
  if (addressToRemove.isDefault && newAddressBook.length > 0) {
    newAddressBook[0].isDefault = true;
  }
  return newAddressBook;
};

export function addressesReducer (addresses = defaultAddressesStore, action) {
  switch (action.type) {
    case 'ADDRESSES_SET_ADDRESS_BOOK':
      return Immutable.merge(addresses, {addressBook: action.addressBook}); // reverted DT-24893 as per DT-28059
      // return appendNewAddresses(addresses, action.addressBook);
    case 'ADDRESSES_ADD_TO_BOOK':
      return Immutable.merge(addresses, {addressBook: [...addresses.addressBook.map((address) =>
        action.address.isDefault ? {...address, isDefault: false} : address), {...action.address, isDefault: action.address.isDefault || addresses.addressBook.length === 0}
      ]});
    case 'ADDRESSES_UPDATE_IN_BOOK':
      return Immutable.merge(addresses, {addressBook: addresses.addressBook.map((address) =>
        address.addressKey === action.addressKey ? action.address : (action.address.isDefault ? {...address, isDefault: false} : address)
      )});
    case 'ADDRESSES_REMOVE_IN_BOOK':
      return Immutable.merge(addresses, {addressBook: removeAddressFromBook(addresses.addressBook, action.addressKey)});
    case 'ADDRESSES_SET_COUNTRIES_LIST':
      return Immutable.merge(addresses, {countriesList: action.countriesList});
    case 'ADDRESSES_SET_COUNTRIES_STATES_TABLE':
      return Immutable.merge(addresses, {countriesStatesTable: action.countriesStatesTable});
    case 'ADDRESSES_SET_VERIFY_RESULT':
      return Immutable.merge(addresses, {addressVerificationData: {
        ...addresses.addressVerificationData,
        suggestedAddresses: action.suggestedAddresses,
        status: action.status,
        message: action.message
      }
      });
    case 'ADDRESSES_SET_VERIFY_PENDING':
      return Immutable.setIn(addresses, ['addressVerificationData', 'addressPendingVerification'], action.addressPendingVerification);
    case 'ADDRESSES_SET_VERIFY_MODAL_OPEN':
      return Immutable.setIn(addresses, ['addressVerificationData', 'isModalOpen'], action.isModalOpen);
    case 'ADDRESSES_SET_VERIFY_MODAL_CALLBACKS':
      return Immutable.merge(addresses, {addressVerificationData:
        {...addresses.addressVerificationData, submitCallback: action.submitCallback, dismissCallback: action.dismissCallback}});
    case 'ADDRESSES_SET_PLCC_DEFAULT_ADDRESS':
      return Immutable.merge(addresses, {defaultPlccAddress: action.defaultPlccAddress});
    default:
      return addresses;
  }
}

export * from './actionCreators';

/**
//  NOTE: see line 112 of userOperator, we are getting address book from 2 differant APIs? so we must reconcile not replace
// reverted DT-24893 as per DT-28059 - if any additional changes required backend would need to keep the responses consistent
function appendNewAddresses (addressStore, addressBook) {
  if (!addressStore.addressBook.length) {
    return Immutable.merge(addressStore, {addressBook: addressBook});
  }

  let currentAddresses = Immutable.asMutable(addressStore.addressBook);

  for (let address of addressBook) {
    let isInAddressBook = !!currentAddresses.find((currentAddress) => currentAddress.addressId === address.addressId);
    if (!isInAddressBook) {
      currentAddresses.push(address);
    }
  }

  return Immutable.merge(addressStore, {addressBook: currentAddresses});
}
**/
