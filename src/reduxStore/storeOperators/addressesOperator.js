import {getAccountAbstractor} from 'service/accountServiceAbstractor';
import {logErrorAndServerThrow} from './operatorHelper';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
// import {getSetShippingActn} from 'reduxStore/storeReducersAndActions/checkout/checkout'; // unused?
import {addressesStoreView} from 'reduxStore/storeViews/addressesStoreView.js';
import {getAddAddressToBookActn, getUpdateAddressInBookActn, VERIFICATION_STATUS}
  from 'reduxStore/storeReducersAndActions/addresses/addresses.js';
import {
  getSetAddressBookActn,
  getSetAddressPendingVerificationActn, getSetAddressVerifyResultActn,
  getSetVerificationModalOpenActn, getSetVerificationModalCallbacks
  } from 'reduxStore/storeReducersAndActions/addresses/addresses';
import {change as formChange} from 'redux-form';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {userStoreView} from 'reduxStore/storeViews/userStoreView.js';

let previous = null;
export function getAddressesOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new AddressesOperator(store);
  }
  return previous;
}

class AddressesOperator {
  constructor (store) {
    this.store = store;
    // FIXME: need a better place to get/set this value
    this.isAddressValidationDisabled = false;
    // create this-bound varsions of all methods of this class
    bindAllClassMethodsToThis(this);
  }

  get accountServiceAbstractor () {
    return getAccountAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  loadAddressesOnAccount () {
    return this.accountServiceAbstractor.getSavedAddresses().then((res) => {
      this.store.dispatch(getSetAddressBookActn(res));
    }).catch((err) => {
      logErrorAndServerThrow(this.store, 'AddressesOperator.loadAddressesOnAccount', err);
    });
  }

  addAddress (addressInfo, modifiers, addToAddressBook) {
    let {address, addressKey, phoneNumber, ...otherInfo} = addressInfo;
    phoneNumber = phoneNumber || userStoreView.getUserPhone(this.store.getState());
    let addressData = {phoneNumber, ...address, ...otherInfo, ...modifiers};
    let addOrEditServiceAbstractor = this.accountServiceAbstractor.addShippingAddress;

    // FIXME: this is the weirdest scenario to handle on frontend, but we all know backend team
    // add an item to the cart, go to shipping as guest, enter shipping details,
    // go back to cart page and login with a user that doesn't have any shipping addresses stored (different email address)
    // response for getOrderDetails in this case contains the old shipping address, old email address
    // so we need to "update" it as per backend request instead of adding a new one.
    if (addressKey) {
      // internally it is a new address, but we need to call update with it's required params
      addressData = {addressKey, phoneNumber, ...address, ...otherInfo, ...modifiers};
      addOrEditServiceAbstractor = this.accountServiceAbstractor.updateShippingAddress;
    }

    return addOrEditServiceAbstractor(addressData).then((res) => {
      if (addToAddressBook) {
        this.store.dispatch(getAddAddressToBookActn({
          address,
          phoneNumber,
          ...otherInfo,
          addressId: res.addressId,
          addressKey: res.addressKey || addressKey,
          isDefault: !!modifiers.isDefault
        }));
      }
      return res;
    }).catch((err) => {
      logErrorAndServerThrow(this.store, 'AddressesOperator.addNewAddress', err);
      throw err;
    });
  }

  updateAddress (addressInfo, modifiers) {
    let {addressKey, address, phoneNumber, ...otherAddressData} = addressInfo;
    phoneNumber = phoneNumber || userStoreView.getUserPhone(this.store.getState());
    let addressData = {addressKey, phoneNumber, ...otherAddressData, ...address, ...modifiers};

    return this.accountServiceAbstractor.updateShippingAddress(addressData)
    .then((res) => {
      this.store.dispatch(
        getUpdateAddressInBookActn(addressKey, {
          ...addressInfo,
          addressId: res.addressId,     // on update we get a new addressId (the addressKey remains the same)
          isDefault: !!modifiers.isDefault
        })
      );

      return res;
    }).catch((err) => {
      logErrorAndServerThrow(this.store, 'AddressesOperator.updateAddress', err);
      throw err;
    });
  }

  closeAddressVerificationModal () {
    this.store.dispatch([
      getSetVerificationModalOpenActn(false),
      // the next call is simply to allow garbage collection to reclaim the old data
      getSetVerificationModalCallbacks(null, null)
    ]);
  }

  openAddressVerificationModal (submitModalCallback) {
    return new Promise((resolve, reject) => {
      this.store.dispatch([
        getSetVerificationModalCallbacks(
          // submit modal callback: resolve with the value of the submit method
          (address) => {
            this.closeAddressVerificationModal();
            resolve(submitModalCallback(address));
          },
          // dismiss modal callback: indicate submit failed (with no error) due to user cancelling it
          () => {
            this.closeAddressVerificationModal();
            reject();   // eslint-disable-line prefer-promise-reject-errors
          }
        ),
        getSetVerificationModalOpenActn(true)
      ]);
    });
  }

  submitWithOptionalVerifyAddressModal (formName, addressSection, formData, submitMethod) {
    if (this.isAddressValidationDisabled) {
      return submitMethod(formData);
    } else {
      let addressToVerify = addressSection ? formData[addressSection].address : formData.address;

      return this.shouldShowVerifyAddressModal(addressToVerify)
      .then((shouldShowVerificationModal) => {
        let suggestedAddresses = addressesStoreView.getSuggestedAddresses(this.store.getState()) || [];
        let isCommercialAddress = suggestedAddresses[0] && suggestedAddresses[0].isCommercialAddress || false;

        if (shouldShowVerificationModal) {
          return this.openAddressVerificationModal((correctedAddress) => {
            // TODO: note that no validation is done on the correctedAddress.
            // In particular, we do not check if the country or state changed, which may change the relevant shipping method
            // NOTE: correctedAddress comes as part of the formData of the onsubmit, however the isCommercialAddress is not a form field but is in the redux store for the suggested address
            // to make this cleaner we could have a hidden form field
            if (correctedAddress) {
              // User selected one of the suggested adderess
              // change the form data to have the corrected address
              this.setAddressInFormSection(formName, addressSection, correctedAddress);
              formData = Object.assign({}, formData);

              if (addressSection) {
                formData[addressSection].address = {...correctedAddress, isCommercialAddress};
              } else {
                formData.address = {...correctedAddress, isCommercialAddress};
              }
            }

            return submitMethod(formData);
          });
        } else {
          // Even though Mellisa Data says the adress is correct we need to extract if its address is Commercial or not.
          let updatedFormData = Object.assign({}, formData);
          if (addressSection && updatedFormData[addressSection].address) {
            formData[addressSection].address = {
              ...formData[addressSection].address,
              isCommercialAddress: isCommercialAddress
            };
          } else if (updatedFormData.address) {
            updatedFormData = {
              ...updatedFormData,
              isCommercialAddress: isCommercialAddress
            };
          }
          return submitMethod(updatedFormData);
        }
      });
    }
  }

  shouldShowVerifyAddressModal (address) {
    return this.loadAddressVerificationData(address)
    .then(() => {
      let {INVALID, APARTMENT_MISSING} = VERIFICATION_STATUS;
      let state = this.store.getState();
      let addVerifStatus = addressesStoreView.getAddressVerificationStatus(state);

      if (addVerifStatus === INVALID || addVerifStatus === APARTMENT_MISSING) {
        return true;
      } else {
        return false;
      }
    }).catch(() => {     // could not engage the verification service => should not show modal
      return false;
    });
  }

  setAddressInFormSection (formName, sectionName, address) {
    sectionName = sectionName ? sectionName + '.' : ''; // to prevent 'null.address.addressLine1';

    this.store.dispatch([
      formChange(formName, sectionName + 'address.addressLine1', address.addressLine1),
      formChange(formName, sectionName + 'address.addressLine2', address.addressLine2),
      formChange(formName, sectionName + 'address.city', address.city),
      formChange(formName, sectionName + 'address.state', address.state),
      formChange(formName, sectionName + 'address.zipCode', address.zipCode),
      formChange(formName, sectionName + 'address.country', address.country)
    ]);
  }

  // observe that rejects on failure
  loadAddressVerificationData (address) {
    return this.accountServiceAbstractor.getAddressVerificationData(address)
    .then((res) => {
      this.store.dispatch([
        getSetAddressPendingVerificationActn(address),
        getSetAddressVerifyResultActn(res.suggestedAddresses, res.result)
      ]);
    }).catch((err) => {
      logErrorAndServerThrow(this.store, 'AddressesOperator.loadAddressVerificationData', err);
      throw err;
    });
  }

}
