/**
@module accountDynamicAbstractor
*/
import superagent from 'superagent';
import {endpoints} from './endpoints.js';
import {ServiceResponseError} from 'service/ServiceResponseError';
import {ADDREESS_TYPE} from 'reduxStore/storeReducersAndActions/addresses/addresses';
import {parseBoolean} from '../apiUtil';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {VERIFICATION_STATUS} from 'reduxStore/storeReducersAndActions/addresses/addresses.js';

// FIXME: move this to paymendMethods.js with all other CONSTS
export const CREDIT_CARDS_PAYMETHODID = {
  'PLACE CARD': 'ADSPlaceCard',
  VISA: 'COMPASSVISA',
  AMEX: 'COMPASSAMEX',
  MC: 'COMPASSMASTERCARD',
  DISC: 'COMPASSDISCOVER'
};

let previous = null;
export function getAccountAbstractor (apiHelper) {
  if (!previous || previous.apiHelper !== apiHelper) {
    previous = new AccountDynamicAbstractor(apiHelper);
  }
  return previous;
}

class AccountDynamicAbstractor {
  constructor (apiHelper) {
    this.apiHelper = apiHelper;

    // create this-bound varsions of all methods of this class
    bindAllClassMethodsToThis(this);
  }

  /**
   * @function getMyWishlists
   * @summary This will return all wishlists the user has along with the needed ids. A user can only add items to an active or defaulted wishlist.
   * @return {Object[]} This will resolve with all the wishlists the user has. Likewise on error you will get an object with the returned error code.
   * @see moveItemToWishlist
   * @return res[i].wishlistId: This is the id of the wishlist you will need to add an item to the wishlist
   * @return res[i].itemCount: This is the number of items in this users wishlist
   * @return res[i].wishlistName: This is the name of the wishlist to display on screen
   * @return res[i].status: informs you if this wishlist is active or not. Can be 'Default', 'Active', or 'Inactive'
   * @example getMyWishlists().then((res) => {
    console.log(res);
      [
        {
          wishlistId: "434524",
          itemCount: "12",
          wishlistName: "Citro's Wishlist",
          status: "Default"
        }
      ]
  });
   */
  getMyWishlists () {
    let payload = {
      header: {
        'X-Cookie': this.apiHelper.configOptions.cookie
      },
      webService: endpoints.getUserWishlists
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      let userWishlists = [];

      Object.keys(res.body).map((index) => {
        userWishlists.push({wishlistId: res.body[index].giftListExternalIdentifier, itemCount: res.body[index].itemCount, wishlistName: res.body[index].nameIdentifier, status: res.body[index].status});
      });

      return userWishlists;
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @method getSavedAddresses
   * @summary This API will get all the address the user has on their account
   * @see updateShippingAddress
   * @see MuleSoft Doc:
   * @see https://childrensplace.atlassian.net/wiki/display/DT/API+Specification+Documentation?preview=/44072969/50233490/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_getAddressed_v3.docx
   * @return {Object[]} This will resolve with all the users address. Likewise on error you will get an object with the returned error code.
   * @return addressId: this is an identifier we need to pass into many other functions to referance a users shipping address
   * @return city: The city of the address
   * @return addressLine1: This is the address of the user, line 1
   * @return addressLine2: This is the address of the user, line 2
   * @return county: The county of the address
   * @return firstName: The firstName associated to the address
   * @return lastName: The lastName associated to the address
   * @return addressKey: The primary key of the address (backend refers to it as the nickname)
   * @return phoneNumber: The phone associated to the address
   * @return emailAddress: The email associated to the address
   * @return isDefault: wheather or not this is the default address
   * @return zipCode: The zipCode of the address
   * @example getSavedAddresses().then((res) => {
    console.log(res);
      [
        {
          addressId: '95195',
          addressLine1: '707 liberty ave',
          addressLine2: '',
          city: 'Montgomery',
          state: 'NJ'
          country: 'US',
          firstName: 'Mike',
          lastName: 'Citro',
          addressKey: 'sb_2016-08-19 05:21:24.031',
          phoneNumber: '1234567890',
          emailAddress: 'tt@gmail.com',
          isDefault: false,
          zipCode: '36107'
        }
      ]
  })
   */

  formatAddressBookResponse (arr) {
    let addresses = [];
    let containsDefault = false;

    for (let address of arr) {
      addresses.push({
        addressId: address.addressId,
        addressKey: address.nickName,
        address: {
          firstName: address.firstName,
          lastName: address.lastName,
          addressLine1: address.addressLine
            ? address.addressLine[0]
            : null,
          addressLine2: address.addressLine
            ? address.addressLine[1]
            : null,
          city: address.city,
          state: address.state,
          country: address.country,
          zipCode: address.zipCode
        },
        emailAddress: address.email1,
        phoneNumber: address.phone1,
        type: address.addressType,
        isDefault: parseBoolean(address.primary)
      });

      containsDefault = containsDefault || parseBoolean(address.primary);
    }

    // if no default, flag the first one as default
    if (!containsDefault && addresses.length) {
      addresses[0].isDefault = true;
    }

    return addresses;
  }

  getSavedAddresses () {
    let payload = {
      header: {
        'X-Cookie': this.apiHelper.configOptions.cookie,
        fromPage: 'checkout'
      },
      webService: endpoints.getAddressFromBook
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      if (!res.body.contact) {
        return [];
      }

      return this.formatAddressBookResponse(res.body.contact || []);
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @method applyOnFileAddressToOrder
   * @summary This will apply a address to the Order
   * @see MuleSoft Doc:
   * @see https://childrensplace.atlassian.net/wiki/display/DT/API+Specification+Documentation?preview=/44072969/66955519/TCP%20-%20API%20Design%20Specification%20-%20Category-BOPIS_UpdateAddressForCart_v3.docx
   */
  applyOnFileAddressToOrder (addressId, shipModeId, orderId) {
    let payload = {
      body: {
        shipModeId: shipModeId,
        addressId: addressId,
        orderId: orderId || '.'
      },
      webService: endpoints.updateShippingInfo
    };
    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      } else {
        return { success: true };
      }
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @method addShippingAddress
   * @summary This is the API used to add a new user shipping address
   * @param {Object} args - This is an object holding the below params
   * @param {Integer} args.isDefault - Is this your default address, if so then 1, else 0
   * @param {string} args.firstName - The users first name, Backend only checks for this
   * @param {string} args.lastName - The users last name
   * @param {string} args.addressLine1 - Your shipping address line 1
   * @param {String=} args.addressLine2 - Your shipping address line 2
   * @param {string} args.city - Your shipping city
   * @param {string} args.zipCode - Your shipping zipCode
   * @param {string} args.country -  Your shipping country
   * @param {string} args.state -  Your shipping state
   * @param {String=} args.phoneNumber - The phone number to associate to this address
   * @param {String=} args.alternateEmail - This is for BOPIS for an alternate email address
   * @param {String=} args.alternateFirstName - This is for BOPIS for an alternate person who will be picking up the item
   * @param {String=} args.alternateLastName - This is for BOPIS for an alternate person who will be picking up the item
   * @param {Boolean} args.saveToAccount - If true then the address will be saved to the users account, else it will not. mainly for checkout page.
   * @param {Boolean} args.applyToOrder - as per backend if we are updating the shipping method form the checkout/billing page we must set this flag to true to apply to the order
   * @see MuleSoft Doc:
   * @see https://childrensplace.atlassian.net/wiki/display/DT/API+Specification+Documentation?preview=/44072969/56590339/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_addAddress_v6.docx
   * @see Related Jira Tickets:
   * @see https://childrensplace.atlassian.net/browse/DT-2158
   * @see https://childrensplace.atlassian.net/browse/DT-2160
   * @return {Object} Resolves with an object holding new addressId. Likewise on error you will get an object with the returned error code.
   * @return addressId: You need this for many other APIs like adding payment method.
   * @example addShippingAddress({
      isDefault: '1',
      firstName: 'jack',
      lastName: 'real',
      addressLine1: '2401 Locust Street',
      addressLine2: 'apt 2',
      city: 'Montgomery',
      zipCode: '36107',
      country:' US',
      phoneNumber: '1234567890',
      addressKey: 'test1',

      saveToAccount: true,
      alternateFirstName: 'pickup alternate name',
      alternateLastName: 'pickup alternate lastname',
      alternateEmail: 'aaa@aaa.com',
      applyToOrder: true
    })
    .then((res) => {
      console.log(res); // { addressId:"143690" addressKey: "1490222292207"}
    })
   */
  addShippingAddress (args) {
    let addressKey = Date.now().toString();

    let payload = {
      header: {
        'X-Cookie': this.apiHelper.configOptions.cookie
      },
      body: {
        contact: [{
          addressLine: [
            args.addressLine1 || '',
            args.addressLine2 || '',
            ''
          ],
          attributes: [{
            key: 'addressField3',
            value: args.zipCode || ''
          }],
          addressType: ADDREESS_TYPE.SHIPPINGANDBILLING,
          city: args.city,
          country: args.country,
          firstName: args.firstName,
          lastName: args.lastName,
          nickName: addressKey,

          phone1: args.phoneNumber || '',
          email1: (args.emailAddress || '').trim(),

          // DT-18453, backend logic in inverted
          phone1Publish: args.saveToAccount ? 'false' : 'true',
          primary: args.isDefault ? 'true' : 'false', // as string
          state: args.state,
          zipCode: args.zipCode,
          xcont_addressField2: args.isCommercialAddress ? '2' : '1',
          xcont_addressField3: args.zipCode, // backend needs it duplicated
          // email2: args.alternateFirstName ? args.alternateFirstName + ' ' + args.alternateLastName + (args.alternateEmail ? '|' + args.alternateEmail : '') : '', // backend needs it in this format
          fromPage: args.applyToOrder ? 'checkout' : ''
        }]
      },
      webService: endpoints.addAddress
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return {addressId: res.body.addressId, addressKey: res.body.nickName};
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @method addPickupPerson
   * @summary This is the API used to add a pickup person to a BOPIS order
   * it's the same service as add shipping address but repurposed for BOPIS
  **/
  addPickupPerson (args) {
    let payload = {
      header: {
        'X-Cookie': this.apiHelper.configOptions.cookie
      },
      body: {
        contact: [{
          addressType: ADDREESS_TYPE.SHIPPING,
          firstName: args.firstName,
          lastName: args.lastName,
          phone2: args.phoneNumber,
          email1: (args.emailAddress || '').trim(),
          email2: args.alternateEmail ? (args.alternateEmail.trim() + '|' + args.alternateFirstName + ' ' + args.alternateLastName) : ''
        }]
      },
      webService: endpoints.addAddress
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      return { addressId: res.body.addressId };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @method updateShippingAddress
   * @summary This APIs updates a users shipping address
   * @param {Object} args - This is an object holding the below params
   * @param {string} args.firstName - The users first name
   * @param {string} args.lastName - The users last name
   * @param {string} args.addressLine1 - Your shipping address1
   * @param {String=} args.addressLine2 - Your shipping address2
   * @param {string} args.city - Your shipping city
   * @param {string} args.zipCode - Your shipping zipCode
   * @param {string} args.state -  Your shipping state
   * @param {string} args.country -  Your shipping country
   * @param {string} args.phoneNumber - The phone number to associate to this address
   * @param {String=} args.addressKey - identifies the address to update.
   * @param {string} args.addressId - The addressId of the address to update.
   * @param {string} args.emailAddress - The email that we are going to attach to this address
   * @param {String=} args.alternateEmail - This is for BOPIS for an alternate email address
   * @param {String=} args.alternateFirstName - This is for BOPIS for an alternate person who will be picking up the item
   * @param {String=} args.alternateLastName - This is for BOPIS for an alternate person who will be picking up the item
   * @param {Int} args.isDefault - Set this as the default shipping
   * @param {Boolean} args.saveToAccount - If true then the address will be saved to the users account, else it will not. mainly for checkout page.
   * @param {Boolean} args.applyToOrder - as per backend if we are updating the shipping method form the checkout/billing page we must set this flag to true to apply to the order
   * @see MuleSoft Doc:
   * @see https://childrensplace.atlassian.net/wiki/pages/viewpage.action?spaceKey=DT&title=API+Specification+Documentation&preview=/44072969/56590338/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_updateAddress_v5.docx
   * @see Related Jira Tickets:
   * @see https://childrensplace.atlassian.net/browse/DT-2158
   * @see https://childrensplace.atlassian.net/browse/DT-2160
   * @see getSavedAddresses
   * @return {Object} Resolves with an object holding a success flag or an error code. Likewise on error you will get an object with the returned error code.
   * @return success: true if the user has updated their address else will return and error code
   * @example updateShippingAddress({
          firstName: "mike",
          lastName: "Cit",
          addressLine1: "234 lindon ave",
          city: "North bergen",
          zipCode: "07047"
          state: "NJ"
          country: "USA",
          phoneNumber: "2012336798",
          addressKey: "Mikes Shipping"
          emailAddress: "ClownMan99@gmail.com",
          isDefault: 1,  //1 for true 0 for false
          fromCheckout: true
      })
      .then((res) => {
        console.log(res) // { addressId:"143690" }
      })
   */
  updateShippingAddress (args) {
    let body = {
      firstName: args.firstName,
      lastName: args.lastName,

      addressLine: [
        args.addressLine1 || '',
        args.addressLine2 || '',
        ''
      ],
      attributes: [{
        key: 'addressField3',
        value: args.zipCode || ''
      }],
      addressType: ADDREESS_TYPE.SHIPPINGANDBILLING,
      zipCode: args.zipCode,
      city: args.city,
      state: args.state,
      country: args.country,
      email1: (args.emailAddress || '').trim(),
      phone1: args.phoneNumber,
      xcont_addressField3: args.zipCode, // backend needs it duplicated
      // per backend if you're editing we should send a false otherwise it'll be removed from the addressbook
      phone1Publish: false // (!!args.saveToAccount).toString()

      // defaultShippingMethodProvided: args.isDefault,
      // fromPage: args.applyToOrder ? 'checkout' : ''
    };

    if (args.isDefault) {
      body.primary = args.isDefault ? 'true' : 'false';
    }

    if (typeof args.isCommercialAddress !== 'undefined') {
      body.xcont_addressField2 = args.isCommercialAddress ? '2' : '1';
    }

    if (args.applyToOrder) {
      body.fromPage = 'checkout';
    }

    if (args.isAccountPage) {
      body.xcont_pageName = 'myAccount';
    }

    let payload = {
      header: {
        'X-Cookie': this.apiHelper.configOptions.cookie,
        nickName: args.addressKey
      },
      body: body,
      webService: endpoints.updateUserShippingAddress
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      } else {
        return {addressId: res.body.addressId};
      }
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
  * same as updateShippingAddress, but reduced parameters, as it's only required to apply an existing address to an order (billing page)
  */
  applyBillingAddress (args) {
    let payload = {
      header: {
        'X-Cookie': this.apiHelper.configOptions.cookie,
        nickName: args.addressKey
      },
      body: {
        addressId: args.addressId,
        fromPage: 'checkout'
      },
      webService: endpoints.updateUserShippingAddress
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      } else {
        return {
          addressId: res.body.addressId,
          nickName: res.body.nickName
        };
      }
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @method addCreditCardDetails
   * @summary This API is used to add a credit card to the users account, not to their order
   * @param {Object} args - This is an object holding the below params
   * @param {string} args.cardNumber - The number on the card
   * @param {string} args.cardType - The credit card brand
   * @param {number} args.monthExpire - The month your credit card expires
   * @param {number} args.yearExpire - The year your card expires
   * @param {string} args.firstName - The first name on the card
   * @param {string} args.lastName - The last name on the card
   * @param {string} args.phoneNumber - The phone number to associate to this address
   * @param {string} args.addressLine1 - The billingAddress for your credit card
   * @param {string} args.addressLine2 - The billingAddress for your credit card
   * @param {string} args.city - The billing city
   * @param {string} args.state - The billing state
   * @param {string} args.zipCode - The billing zipcode
   * @param {string} args.country - The billing county
   * @param {string} args.nickName- The nickName you want to give to this new payment method
   * @param {Boolean} args.isDefault- Should This be the default credit card on the account true/false
   * @see MuleSoft Doc:
   * @see https://childrensplace.atlassian.net/wiki/display/DT/API+Specification+Documentation?preview=/44072969/57835521/TCP%20-%20API%20Design%20Specification%20-%20Category-Myaccount_AddCreditCardDetails_v4.docx
   * @see Related Jira Tickets:
   * @see https://childrensplace.atlassian.net/browse/DT-2162
   * @see https://childrensplace.atlassian.net/browse/DT-2157
   * @return {Object} - {success: true}
   */
  addCreditCardDetails (args) {
    let payload = {
      header: {
        'X-Cookie': this.apiHelper.configOptions.cookie,
        isRest: true
      },
      body: {
        isDefault: args.isDefault ? 'true' : 'false',
        addressId: args.addressId || '',
        billing_firstName: args.firstName,
        billing_lastName: args.lastName,
        billing_phone1: args.phoneNumber || '',
        billing_address1: args.addressLine1,
        billing_address2: args.addressLine2,
        billing_city: args.city,
        billing_state: args.state,
        billing_addressField3: args.zipCode,
        billing_zipCode: args.zipCode,
        billing_country: args.country,
        billing_nickName: args.nickName || ('Billing_' + this.apiHelper.configOptions.storeId + '_' + (new Date()).getTime().toString()),
        pay_account: args.cardNumber,
        pay_expire_month: (args.expMonth || '').toString(), // PLCC does not require expiration
        payMethodId: CREDIT_CARDS_PAYMETHODID[args.cardType],
        pay_expire_year: (args.expYear || '').toString(), // PLCC does not require expiration
        redirecturl: 'AjaxLogonForm',
        viewTaskName: 'RedirectView',
        // DT-18453, backend logic in inverted
        phone1Publish: args.saveToAccount ? 'false' : 'true'
      },
      webService: endpoints.addCreditCardDetails
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return {success: true};
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @method updateCreditCardDetails
   * @summary This API is used to update a credit card on a users account
   * @todo still need to test, unable to test, need to be on https and gets rejected from localhost
   * @param {Object} args - This is an object holding the below params
   * @param {string} args.cardNumber - The number on the card
   * @param {string} args.creditCardId - The id of the credit card to update, see getCreditCards
   * @param {string} args.cardType - The credit card brand
   * @param {number} args.monthExpire - The month your credit card expires
   * @param {number} args.yearExpire - The year your card expires
   * @param {string} args.firstName - The first name on the card
   * @param {string} args.lastName - The last name on the card
   * @param {string} args.phoneNumber - The phone number to associate to this address
   * @param {string} args.addressLine1 - The billingAddress for your credit card
   * @param {string} args.addressLine2 - The billingAddress for your credit card
   * @param {string} args.city - The billing city
   * @param {string} args.state - The billing state
   * @param {string} args.zipCode - The billing zipcode
   * @param {string} args.country - The billing county
   * @param {string} args.nickName- The nickName you want to give to this new payment method
   * @see MuleSoft Doc:
   * @see https://childrensplace.atlassian.net/wiki/display/DT/API+Specification+Documentation?preview=/44072969/50233515/TCP%20-%20API%20Design%20Specification%20-%20Category-Myaccount_ModifyCreditCardDetails_v2.docx
   * @return {Object} - {success: true}
   */
  updateCreditCardDetails (args) {
    let payload = {
      header: {
        'X-Cookie': this.apiHelper.configOptions.cookie,
        isRest: true
      },
      body: {
        isDefault: args.isDefault ? 'true' : 'false',
        addressId: args.addressId || '',
        creditCardId: args.creditCardId,
        billing_firstName: args.firstName,
        billing_lastName: args.lastName,
        billing_phone1: args.phoneNumber || '',
        billing_address1: args.addressLine1,
        billing_address2: args.addressLine2,
        billing_city: args.city,
        billing_state: args.state,
        billing_addressField3: args.zipCode,
        billing_zipCode: args.zipCode,
        billing_country: args.country,
        billing_nickName: args.nickName || ('Billing_' + this.apiHelper.configOptions.storeId + '_' + (new Date()).getTime().toString()),
        pay_account: args.cardNumber,
        pay_expire_month: (args.expMonth || '').toString(), // on PLCC it's null
        payMethodId: CREDIT_CARDS_PAYMETHODID[args.cardType],
        pay_expire_year: (args.expYear || '').toString(), // on PLCC it's null
        redirecturl: 'AjaxLogonForm',
        viewTaskName: 'RedirectView'
      },
      webService: endpoints.modifyCreditCardDetails
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return {success: true};
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  setCreditCardAsDefault (args) {
    let payload = {
      header: {
        'X-Cookie': this.apiHelper.configOptions.cookie,
        isRest: true
      },
      body: {
        isDefault: args.isDefault ? 'true' : 'false',
        creditCardId: args.creditCardId,
        action: 'U'
      },
      webService: endpoints.modifyCreditCardDetails
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return {success: true};
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @method getCreditCards
   * @summary This API is used to get all credit cards on account.
   * @todo still need to test, unable to test, need to be on https and gets rejected from localhost
   * @see MuleSoft Doc:
   * @see https://childrensplace.atlassian.net/wiki/display/DT/API+Specification+Documentation?preview=/44072969/50233516/TCP%20-%20API%20Design%20Specification%20-%20Category-Myaccount_getCreditCardDetails_v2.docx
   * @see Related Jira Tickets:
   * @see https://childrensplace.atlassian.net/browse/DT-1792
   * @see https://childrensplace.atlassian.net/browse/DT-7559
   * @see https://childrensplace.atlassian.net/browse/DT-2157
   * @return Id - id of this card used to remove/update
   * @return accountNo - the account number of this card, last 4 digits
   * @return billingAddressId - the address on account that is linked to this payment method
   * @return cardType - The card type of thispayment method
   * @return isDefault - true is this is the default card on your account
   * @return expMonth - The month this card expires
   * @return expYear - The year this card expires
   * @return nameOnAccount - The name on the card
   * @example
        [
              {
                  "Id": 329014,
                  "accountNo": "************7777",
                  "billingAddressId": 1383254,
                  "cardType": "Visa",
                  "isDefault": true,
                  "expMonth": 10,
                  "expYear": 2020,
                  "nameOnAccount": "."
              }
          ]
   */
  getCreditCards () {
    let payload = {
      header: {
        isRest: true
      },
      webService: endpoints.getCreditCardDetails
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      let creditCards = [];
      let defaultAlreadySet = false;

      res.body.creditCardListJson.map((cc) => {
        defaultAlreadySet = defaultAlreadySet || parseBoolean(cc.defaultInd);
      });

      res.body.creditCardListJson.map((cc) => {
        if (cc.ccBrand === 'GC') {
          // GIFT CARD
          creditCards.push({
            cardType: 'GIFT CARD',
            onFileCardId: cc.creditCardId.toString(),
            billingAddressId: (cc.billingAddressId || '').toString(), // FIXME: needed to apply on checkout but service sends null
            cardNumber: cc.accountNo,
            cardPin: null,  // FIXME: service does not provide it
            balance: null   // user needs to do 'check balance' as we cannot trust the response from this service
          });
        } else {
          let cardType = cc.ccBrand || (cc.ccType === 'PLACE CARD' ? 'PLACE CARD' : cc.ccType);

          // CC / PLCC
          creditCards.push({
            onFileCardId: cc.creditCardId.toString(),
            cardNumber: cc.accountNo,
            billingAddressId: cc.billingAddressId.toString(),
            cardType: cardType,
            isDefault: !defaultAlreadySet || parseBoolean(cc.defaultInd),
            isExpirationRequired: cardType !== 'PLACE CARD',
            isCVVRequired: cardType !== 'PLACE CARD',
            expMonth: parseInt(cc.expMonth),
            expYear: cardType !== 'PLACE CARD' ? parseInt(cc.expYear) : (new Date().getFullYear() + 10),
            nameOnAccount: cc.nameOnAccount
          });

          defaultAlreadySet = true;
        }
      });

      return creditCards;
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @method deleteCreditCards
   * @summary This API is used to delete a credit cards on account.
   * @todo still need to test, unable to test, need to be on https and gets rejected from localhost
   * @param {string} creditCardId - The id of the credit card to delete, see getCreditCards
   * @see MuleSoft Doc:
   * @see https://childrensplace.atlassian.net/wiki/display/DT/API+Specification+Documentation?preview=/44072969/50233519/TCP%20-%20API%20Design%20Specification%20-%20Category-Myaccount_DeleteCreditCardDetails_v2.docx
   * @return {Object} - {success: true}
   */
  deleteCreditCards (creditCardId) {
    let payload = {
      header: {
        'X-Cookie': this.apiHelper.configOptions.cookie
      },
      body: {
        creditCardId,
        action: 'D'
      },
      webService: endpoints.deleteCreditCardDetails
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return {success: true};
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @method getOrderHistory
   * @summary This will return all orders a user has palce with their currently logged in account.
   * @return orderNumber - This is the order number that can be used to get all information about this order
   * @return orderStatus - The current status of the order
   * @return orderTrackingNumber - This is the tracking number that the user can use to track their package
   * @return orderDate - This is the date the order was placed
   * @return orderTotal - This is the total cost of the order, backend will calculate this in the currency it was procceseed in
   * @see MuleSoft Doc:
   * @see https://childrensplace.atlassian.net/wiki/display/DT/API+Specification+Documentation?preview=/44072969/63799299/TCP%20-%20API%20Design%20Specification%20-%20Category-BOPIS_OrderHistoryService_v1.docx
   * @see Related Jira Tickets:
   * @see https://childrensplace.atlassian.net/browse/DT-1791
   * @example
     User.getOrderHistory().then((res) => {
       console.log('getOrderHistory: ', res);
       [
        {
          orderDate:"January 10, 2017"
          orderNumber:"8005904003"
          orderStatus:"Order In Process"
          orderTotal:"$28.48"
          orderTrackingNumber:"N/A"
        },{
          orderDate:"January 16, 2017"
          orderNumber:"8005904005"
          orderStatus:"Order In Process"
          orderTotal:"$283.48"
          orderTrackingNumber:"N/A"
        }
      ]
     });
   */
  getOrderHistory () {
    let payload = {
      header: {
        'X-Cookie': this.apiHelper.configOptions.cookie,
        fromRest: 'true'
      },
      webService: endpoints.getOrderHistory
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      return res.body.domOrderBeans.map((order) => {
        return {
          orderNumber: order.orderNumber,
          orderStatus: order.orderStatus,
          orderDate: order.orderDate,
          orderTotal: order.orderTotal,
          orderTrackingNumber: order.orderTrackingNumber || null
        };
      });
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @method getLastOrder
   * @summary This will return the last order a user has palce with their currently logged in account.
   * @return orderNumber - This is the order number that can be used to get all information about this order
   * @return orderStatus - The current status of the order
   * @return orderTrackingNumber - This is the tracking number that the user can use to track their package
   * @return orderDate - This is the date the order was placed
   * @return orderTotal - This is the total cost of the order, backend will calculate this in the currency it was procceseed in
   * @see MuleSoft Doc:
   * @see https://childrensplace.atlassian.net/wiki/display/DT/API+Specification+Documentation?preview=/44072969/63799299/TCP%20-%20API%20Design%20Specification%20-%20Category-BOPIS_OrderHistoryService_v1.docx
   * @see Related Jira Tickets:
   * @see https://childrensplace.atlassian.net/browse/DT-1791
   * @example
     User.getOrderHistory().then((res) => {
       console.log('getOrderHistory: ', res);
       {
          orderDate:"January 10, 2017"
          orderNumber:"8005904003"
          orderStatus:"Order In Process"
          orderTotal:"$28.48"
          orderTrackingNumber:"N/A"
       }
     });
   */
  getLastOrder () {
    let payload = {
      header: {
        'X-Cookie': this.apiHelper.configOptions.cookie,
        fromRest: 'true'
      },
      webService: endpoints.getOrderHistory
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      // As per backend the first item in the array is the last order placed, its is in decending order by date
      return {
        orderNumber: res.body.domOrderBeans[0].orderNumber,
        orderStatus: res.body.domOrderBeans[0].orderStatus,
        orderDate: res.body.domOrderBeans[0].orderDate,
        orderTotal: res.body.domOrderBeans[0].orderTotal,
        orderTrackingNumber: res.body.domOrderBeans[0].orderTrackingNumber || null,
        orderTrackingUrl: res.body.domOrderBeans[0].orderTrackingURL || null
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function createNewWishlist
   * @summary This api is used to create new wishlists
   * @param {string} wishlistName - The name to be given to this wishlist.
   * @return {string} wishlistId - this is the id of the wishlist that was just created
   * @example createNewWishlist("Mike's Favorites").then((res) => {
        {
          wishlistId: '5614981'
        }
    }
   */
  createNewWishlist (wishlistName) {
    let payload = {
      header: {
        'X-Cookie': this.apiHelper.configOptions.cookie
      },
      body: {
        name: wishlistName,
        storeId: this.apiHelper.configOptions.storeId,
        catalogId: this.apiHelper.configOptions.catalogId,
        langId: this.apiHelper.configOptions.langId
      },
      webService: endpoints.createWishList
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      return {
        wishlistId: res.body.giftListId[0]
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  getAddressVerificationData (args) {
    // NOTE: API docs http://devconsole.melissadata.com/personator/
    return superagent
        .get('https://personator.melissadata.net/v3/WEB/ContactVerify/doContactVerify')
        .query({
          id: this.apiHelper.configOptions.MELISSA_KEY,
          format: 'json',
          act: 'Check',
          cols: 'Plus4,DeliveryIndicator',
          a1: args.addressLine1,
          a2: args.addressLine2,
          city: args.city,
          state: args.state,
          postal: args.zipCode,
          ctry: args.country
        })
      .then((res) => {
        let result = res.body.Records[0];
        let melissaResults = {
          addressLine1: (result.AddressLine1 || '').trim(),
          addressLine2: (result.AddressLine2 || '').trim(),
          state: (result.State || '').trim(),
          city: (result.City || '').trim(),
          zipCode: (result.PostalCode || '').trim()
        };

        return {
          suggestedAddresses: [{
            ...args,
            ...melissaResults,
            isCommercialAddress: MELISSA_DELIVERY_INDICATOR.BUSINESS === result.DeliveryIndicator
          }], // if !isAddressDiff return [] (isAddressDiff)
          result: melissaStatusExtractor(result.Results)
        };
      });
  }

}

/* MELISSA RESULT CODE MAPPING SECTION */
const MELISSA_RESULT_CODES = {
  AS01: {
    code: 'AS01',
    message: {
      text: '',
      className: ''
    },
    status: VERIFICATION_STATUS.VALID
  },
  AE09: {
    code: 'AE09',
    message: {
      text: 'There may be an issue with your address as entered. Please double check it, or if you believe the address is correct you can continue to the next step.',
      className: ''
    },
    status: VERIFICATION_STATUS.APARTMENT_MISSING
  },
  AE10: {
    code: 'AE10',
    message: {
      text: 'The house / building number is not valid. Please review and confirm your address.',
      className: 'red-text'
    },
    status: VERIFICATION_STATUS.INVALID
  },
  AE11: {
    code: 'AE11',
    message: {
      text: 'The house / building number is missing from your address. Please review and confirm your address.',
      className: 'red-text'
    },
    status: VERIFICATION_STATUS.INVALID
  },
  AE12: {
    code: 'AE12',
    message: {
      text: 'The house / building number is not valid. Please review and confirm your address.',
      className: 'red-text'
    },
    status: VERIFICATION_STATUS.INVALID
  },
  DEFAULT: {
    code: 'DEFAULT',
    message: {
      text: 'There may be an issue with your address as entered. Please double check it, or select from the below.',
      className: ''
    },
    status: VERIFICATION_STATUS.INVALID
  }
};

/**
* @function this will map Melissa error codes to TCP expected output
* @see http://devconsole.melissadata.com/personator/
* @param {String} resultSet - list of camma seperated codes
* @summary if there is only one code and it is AS01 address is valid. If the first code is AE09 then we are missing an address line 2. All else invalid address
*/
function melissaStatusExtractor (resultSet) {
  let melissaCodes = resultSet.split(',');
  let {AS01, AE09, AE10, AE11, AE12, DEFAULT} = MELISSA_RESULT_CODES;

  // NOTE: we can not just do return MELISSA_RESULT_CODES[resultSet] because resultSet can be a list of codes and the order/number of codes in that list matters
  if (resultSet === AS01.code) {
    return AS01;
  } else if (melissaCodes[0] === AE09.code) {
    return AE09;
  } else if (resultSet === AE10.code) {
    return AE10;
  } else if (melissaCodes.find(code => code === AE11.code)) {
    return AE11;
  } else if (melissaCodes.find(code => code === AE12.code)) {
    return AE12;
  } else {
    return DEFAULT;
  }
}

const MELISSA_DELIVERY_INDICATOR = {
  BUSINESS: 'B',
  RESIDENTIAL: 'R',
  UNKNOWN: 'U'
};
