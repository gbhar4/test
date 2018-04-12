import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {getSubmissionError} from '../operatorHelper';
import {getAddressesOperator} from '../addressesOperator';
import {userStoreView} from 'reduxStore/storeViews/userStoreView.js';
import {rewardsStoreView} from 'reduxStore/storeViews/rewardsStoreView.js';
import {getR3Abstractor} from 'service/R3ServiceAbstractor';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {
  setContactInfo,
  getSetAirmilesAccountActn,
  getSetAssociateIdActn,
  getDeleteChildActn,
  getSetChildrenActn
} from 'reduxStore/storeReducersAndActions/user/user';
import {getGeneralOperator} from 'reduxStore/storeOperators/generalOperator';
import {getPaymentCardsOperator} from 'reduxStore/storeOperators/paymentCardsOperator';
import {getRemoveAddressInBookActn} from 'reduxStore/storeReducersAndActions/addresses/addresses';
import Immutable from 'seamless-immutable';

export const POINTS_TRANSACTIONS_TYPES = {
  IN_STORE: 'in-store',
  ONLINE: 'online'
};

export const CONFIRM_MODAL_IDS = {
  CONFIRM_DELETE: 'accountFormOperator_delete'
};

/** ADD_POINT_CLAIM_SUCCESS to define text */
const MESSAGES = Immutable({
  ADDRESS_BOOK_ADD_ADDRESS_SUCCESS: 'Your account has been updated.',
  ADDRESS_BOOK_EDIT_ADDRESS_SUCCESS: 'Your account has been updated.',
  ADD_POINT_CLAIM_SUCCESS: 'Thank you for contacting us regarding your missing points. Please allow 48-72 hours to process your request. If more information is needed, a customer service representative will contact you.',
  ADD_POINT_CLAIM_ERROR: 'Thank you for contacting us regarding your missing points. Please allow 48-72 hours to process your request. If more information is needed, a customer service representative will contact you.',
  REMOVE_ADDRESS_SUCCESS: 'Your account has been updated.'
});

let previous = null;
export function getAccountFormOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new AccountFormOperator(store);
  }
  return previous;
}

class AccountFormOperator {
  constructor (store) {
    this.store = store;
    bindAllClassMethodsToThis(this);
  }

  get r3ServiceAbstractor () {
    return getR3Abstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  submitAddAddress (formData) {
    return getAddressesOperator(this.store).submitWithOptionalVerifyAddressModal('submitAddAddress', null, formData, submitAddAddress.bind(null, this.store));
  }

  submitAddAddressToAccount (formData) {
    return this.submitAddAddress({
      ...formData,
      saveToAccount: true
    }).then(() => {
      let generalOperator = getGeneralOperator(this.store);
      generalOperator.flashSuccess(MESSAGES.ADDRESS_BOOK_ADD_ADDRESS_SUCCESS);
    });
  }

  // moved from checkoutFormOperator, nothing to do with checkout
  submitEditOnFileAddress (formData) {
    return getAddressesOperator(this.store).submitWithOptionalVerifyAddressModal('submitEditOnFileAddress', null, formData, submitEditOnFileAddress.bind(null, this.store));
  }

  submitEditAddressOnAccount (formData) {
    return this.submitEditOnFileAddress({
      ...formData,
      saveToAccount: true // on my account section this is always true (not the case in checkout)
    }).then(() => {
      getPaymentCardsOperator(this.store).loadCreditCardsOnAccount();

      let generalOperator = getGeneralOperator(this.store);
      generalOperator.flashSuccess(MESSAGES.ADDRESS_BOOK_EDIT_ADDRESS_SUCCESS);
    });
  }

  submitPersonalInfo (formData) {
    let newInfo = {
      giftcardAccountNumber: formData.cardNumber,
      firstName: formData.firstName,
      lastName: formData.lastName,
      associateId: formData.isEmployee ? formData.associateId : '',
      email: formData.emailAddress,
      phone: formData.phoneNumber,
      airmiles: formData.airMilesAccountNumber,
      status: formData.status
    };

    return this.r3ServiceAbstractor.updateProfileInfo(newInfo).then((res) => {
      this.store.dispatch([
        setContactInfo({
          firstName: newInfo.firstName,
          lastName: newInfo.lastName,
          emailAddress: newInfo.email,
          phoneNumber: newInfo.phone
        }),
        getSetAirmilesAccountActn(newInfo.airmiles),
        getSetAssociateIdActn(newInfo.associateId)
      ]);
    }).catch((err) => {
      throw getSubmissionError(this.store, 'submitPersonalInfo', err);
    });
  }

  submitAddChild (formData) {
    let newChildData = {
      parentFirstName: formData.digitalSignatureFirstName,
      parentLastName: formData.digitalSignatureLastName,
      timestamp: formData.timestamp,
      childFullName: formData.childName,
      childBirthYear: formData.birthYear,
      childBirthMonth: formData.birthMonth,
      childGender: formData.gender
    };

    return this.r3ServiceAbstractor.addChild(newChildData)
    .then((res) => {
      this.store.dispatch([
        setContactInfo({
          ...userStoreView.getUserContactInfo(this.store.getState()),
          firstName: res.firstName,
          lastName: res.lastName
        }),
        getSetChildrenActn(res.children)
      ]);
    })
    .catch((err) => {
      throw getSubmissionError(this.store, 'submitAddChild', err);
    });
  }

  submitDeleteChild (child) {
    let deleteChildData = {
      // parentFirstName: formData.digitalSignatureFirstName,
      // parentLastName: formData.digitalSignatureLastName,
      childId: child.childId
    };

    return this.r3ServiceAbstractor.deleteChild(deleteChildData).then((res) => {
      return this.store.dispatch(getDeleteChildActn(child.childId));
    }).catch((err) => {
      throw getSubmissionError(this.store, 'submitDeleteChild', err);
    });
  }

  submitPointsClaim (formData) {
    let state = this.store.getState();
    let user = userStoreView.getUserContactInfo(state);
    let orderOrTxData;

    if (formData.transactionType === POINTS_TRANSACTIONS_TYPES.IN_STORE) {
      orderOrTxData = {
        wasInStoreTransaction: true,
        storeNumber: formData.storeNumber,
        storeRegisterNumber: formData.registerNumber,
        transactionNumber: formData.transactionNumber,
        transactionDate: formData.transactionDate
      };
    } else {
      orderOrTxData = {
        wasInStoreTransaction: false,
        orderNumber: formData.orderNumber,
        // FIXME: should I use transactionDate for order date too?
        transactionDate: formData.orderDate
      };
    }

    let claimData = {
      firstName: user.firstName,
      lastName: user.lastName,
      myPlaceNumber: rewardsStoreView.getRewardsAccountNumber(state),
      email: user.emailAddress,
      ...orderOrTxData
    };

    return this.r3ServiceAbstractor.claimPoints(claimData).then((res) => {
      let generalOperator = getGeneralOperator(this.store);
      if (res.success) {
        generalOperator.flashSuccess(MESSAGES.ADD_POINT_CLAIM_SUCCESS);
      } else {
        generalOperator.flashError(MESSAGES.ADD_POINT_CLAIM_ERROR);
      }
    }).catch((err) => {
      throw getSubmissionError(this.store, 'submitPointsClaim', err);
    });
  }

  setDefaultAddress (address) {
    let addressesOperator = getAddressesOperator(this.store);
    return new Promise((resolve, reject) => {
      addressesOperator.updateAddress(address, {
        isDefault: 1,
        isAccountPage: true
      }).then(() => {
        getPaymentCardsOperator(this.store).loadCreditCardsOnAccount();
        resolve();
      }).catch((err) => {
        reject(getSubmissionError(this.store, 'setDefaultAddress', err));
      });
    });
  }

  deleteAddress (address) {
    let generalOperator = getGeneralOperator(this.store);
    return new Promise((resolve, reject) => {
      generalOperator.openConfirmationModal(CONFIRM_MODAL_IDS.CONFIRM_DELETE).then(() => {
        this.r3ServiceAbstractor.deleteAddressOnAccount(address.addressKey).then((res) => {
          this.store.dispatch(getRemoveAddressInBookActn(address.addressKey));
          getPaymentCardsOperator(this.store).loadCreditCardsOnAccount().then(() => {
            resolve();
            generalOperator.flashSuccess(MESSAGES.REMOVE_ADDRESS_SUCCESS);
          });
        }).catch((err) => {
          reject(getSubmissionError(this.store, 'deleteAddress', err));
        });
      }).catch(() => {
        // When the user cancels the confirmation modal we gracefully resolve our Promise
        resolve();
      });
    });
  }

}

function submitAddAddress (store, formData) {
  let {address, phoneNumber, emailAddress, setAsDefault, saveToAccount} = formData;
  let addressesOperator = getAddressesOperator(store);

  if (!emailAddress) {
    emailAddress = userStoreView.getUserEmail(store.getState());
  }

  return addressesOperator.addAddress(
    {address, phoneNumber, emailAddress},
    {isDefault: setAsDefault, saveToAccount: saveToAccount},
    true
  ).catch((err) => {
    throw getSubmissionError(store, 'submitAddAddress', err);
  });
}

function submitEditOnFileAddress (store, formData) {
  let {emailAddress} = formData; 

  if (!emailAddress) {
    emailAddress = userStoreView.getUserEmail(store.getState());
  }

  return getAddressesOperator(store).updateAddress({
    addressKey: formData.addressKey,
    address: formData.address,
    emailAddress: formData.emailAddress || emailAddress,
    phoneNumber: formData.phoneNumber
  }, {
    isDefault: formData.setAsDefault,
    saveToAccount: formData.saveToAccount,
    isAccountPage: true
  })
  .then(() => {
    getPaymentCardsOperator(store).loadCreditCardsOnAccount();
  })
  .catch((err) => {
    throw getSubmissionError(store, 'submitEditOnFileAddress', err);
  });
}
