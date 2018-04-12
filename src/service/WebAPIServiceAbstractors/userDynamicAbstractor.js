// FIXME: refactor
/**
@module User Service Abstractors
*/
import {endpoints} from './endpoints.js';
import {parseDate, compareDate} from 'util/parseDate.js';
import {ServiceResponseError} from 'service/ServiceResponseError';
import {parseBoolean} from '../apiUtil';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {getAccountAbstractor} from 'service/WebAPIServiceAbstractors/accountDynamicAbstractor.js';
import {COUPON_STATUS, COUPON_REDEMPTION_TYPE} from 'reduxStore/storeReducersAndActions/couponsAndPromos/couponsAndPromos';
import {routingConstants} from 'routing/routingConstants.js'; // Hate this, fucking fuck me. FIXME: I need to engage "future" refences as part of a service call. I'm in a rush I can't help importing this to have some values engaged.
import queryString from 'query-string';
import {briteVerifyStatusExtraction} from 'util/formsValidation/briteVerifyEmailValidator';

let previous = null;
export function getUserAbstractor (apiHelper) {
  if (!previous || previous.apiHelper !== apiHelper) {
    previous = new UserDynamicAbstractor(apiHelper);
  }
  return previous;
}

class UserDynamicAbstractor {
  constructor (apiHelper) {
    this.apiHelper = apiHelper;

    // create this-bound varsions of all methods of this class
    bindAllClassMethodsToThis(this);
  }

/**
 * @function register
 * @summary This API is used to register a new user.
 * @param {Object} args - This is a group of the following strings.
 * @param {String} args.firstName - The users firstname
 * @param {String} args.lastName - The users lastName
 * @param {String} args.emailAddress - The users email address, also the username to login
 * @param {String} args.password - The users password
 * @param {String=} args.phoneNumber - The users phone
 * @param {String} args.zipCode - The users zipCode
 * @param {Boolean} args.rememberMe - If checked to remember user then true
 * @return {Object} This will upon successfuly resolving return an object holding a success flag, true if the user has been registered  . likewise on error you will get an object with the returned error code.
 * @return success: true if the user was registered else will return and error code
 * @throws {_ERR_AUTHENTICATION_MINIMUMLENGTH_PASSWORD.2200} You entered a password with less than {0} characters.  Passwords must be at least {0} characters in length, and include {1} digit(s) and {2} letter(s).  Please re-enter your password.
 * @throws {_ERR_AUTHENTICATION_MAXCONSECUTIVECHAR_PASSWORD.2210} A character in your password occurs more consecutively than the allowed limit of {0}. Please re-enter your password.
 * @throws {_ERR_AUTHENTICATION_MAXINTANCECHAR_PASSWORD.2220} A character in your password occurs more than the allowed limit of {0}.  Please re-enter your password.
 * @throws {_ERR_AUTHENTICATION_MINIMUMLETTERS_PASSWORD.2230} Your password does not contain {0} letter(s).  Passwords must be at least {1} characters in length, and include {2} digit(s) and {0} letter(s).  Please re-enter your password.
 * @throws {_ERR_AUTHENTICATION_MINIMUMDIGITS_PASSWORD.2240} Your password does not contain {0} digit(s).  Passwords must be at least {1} characters in length, and include {0} digit(s) and {2} letter(s).  Please re-enter your password.
 * @throws {_ERR_AUTHENTICATION_USERIDMATCH_PASSWORD.2250} Your password is the same as your Email Address. Please ensure that your Email Address and password are different.
 * @throws {_ERR_AUTHENTICATION_REUSEOLD_PASSWORD.2260} Your new password cannot replicate any recent passwords you may have used.  Please select another password and try again.
 * @throws {_ERR_AUTHENTICATION_UPPERCASE_MINIMUMLENGTH_PASSWORD.2270} Password must include at least {0} uppercase character(s).
 * @throws {_ERR_AUTHENTICATION_SPECIALCHAR_MINIMUMLENGTH_PASSWORD.2280} Password must include at least {0} special character(s).
 * @see MuleSoft Doc:
 * @see https://childrensplace.atlassian.net/wiki/pages/viewpage.action?spaceKey=DT&title=API+Specification+Documentation&preview=/44072969/50233457/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_addCustomerRegistration_v6.docx
 * @example register().then((res) => {
  console.log(res) // { success: true }
})
 */
  register (args) {
    const {
    firstName,
    lastName,
    emailAddress,
    password,
    phoneNumber,
    zipCode,
    response,
    rememberMe,
    plccCardId
  } = args;

    let payload = {
      body: {
        firstName,
        lastName,
        zipCode,
        response,
        logonId: emailAddress.trim(),
        logonPassword: password,
        phone1: phoneNumber,
        rememberCheck: rememberMe || false,
        rememberMe: rememberMe || false,
        catalogId: this.apiHelper.configOptions.catalogId,
        langId: this.apiHelper.configOptions.langId,
        storeId: this.apiHelper.configOptions.storeId,
        xCreditCardId: plccCardId || '' // DT-20015
      },
      webService: endpoints.addCustomerRegistration
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
 * @function login
 * @summary This API is used to login a user
 * @param {String} email - The users email address
 * @param {String} password - The users password
 * @param {Boolean} rememberMe - If checked to remember user then true
 * @return {Object} This will upon successfuly resolving return an object holding successful login or error logging in. likewise on error you will get an object with the returned error code.
 * @return success: true if the user was loged in, else you will get an error code
 * @see MuleSoft Doc:
 * @see https://childrensplace.atlassian.net/wiki/pages/viewpage.action?spaceKey=DT&title=API+Specification+Documentation&preview=/44072969/50233458/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_login_v7.docx
 * @example login("mikecit22@gmail.com", "TheCatSingsInTheShower!", true).then((res) => {
  console.log(res) // { success: true }
})
 */
  login (email, password, rememberMe, plccCardId) {
    let payload = {
      body: {
        storeId: this.apiHelper.configOptions.storeId,
        logonId1: email.trim(),
        logonPassword1: password,
        rememberCheck: rememberMe || false,
        rememberMe: rememberMe || false,
        requesttype: 'ajax',
        reLogonURL: 'TCPAjaxLogonErrorView',
        URL: 'TCPAjaxLogonSuccessView',
        registryAccessPreference: 'Public',
        calculationUsageId: -1,
        createIfEmpty: 1,
        deleteIfEmpty: '*',
        fromOrderId: '*',
        toOrderId: '.',
        updatePrices: 0,
        xCreditCardId: plccCardId || '' // DT-20015
      },
      webService: endpoints.logon
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
 * @function logout
 * @summary This is the API to use to logout a logged in user
 * @return {Object} This will resolve with an object holding a success flag, true on successful resolution. Likewise on error you will get an object with the returned error code.
 * @return success: true if the user was loged out, else you will get an error code.
 * @see MuleSoft Doc:
 * @see https://childrensplace.atlassian.net/wiki/pages/viewpage.action?spaceKey=DT&title=API+Specification+Documentation&preview=/44072969/58949638/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_logout_v1.docx
 * @example logout().then((res) => {
  console.log(res) // { success: true}
})
 */
  logout () {
    let payload = {
      header: {
        'X-Cookie': this.apiHelper.configOptions.cookie
      },
      webService: endpoints.logout
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
 * @function getPasswordResetEmail
 * @summary This is the API to use when you would like to send the user a password reset link to their email
 * @param {String} email - This is the users email whom you would like to email the reset link to.
 * @return {Object} This will upon successfuly resolving return an object holding a success flag, true if the user has been found and emailed. Likewise on error you will get an object with the returned error code.
 * @return success: true if the user was found and sent a password else you will get an error code.
 * @see MuleSoft Doc:
 * @see https://childrensplace.atlassian.net/wiki/pages/viewpage.action?spaceKey=DT&title=API+Specification+Documentation&preview=/44072969/55181316/TCP%20-%20API%20Design%20Specification%20-%20Category-Myaccount_PasswordReset-Flow1_v1.docx
 * @example getPasswordResetEmail("mikecit22@gmail.com").then((res) => {
    console.log(res); // { success: true }
})
 */
  getPasswordResetEmail (email) {
    let payload = {
      body: {
        storeId: this.apiHelper.configOptions.storeId,
        catalogId: this.apiHelper.configOptions.catalogId,
        langId: this.apiHelper.configOptions.langId,
        isPasswordReset: 'true',
        logonId: email.toUpperCase().trim(), // need to .toUpperCase() because backend stores passwords in .toUpperCase() and are unable to apply this on their end due to some restrition
        reLogonURL: 'ChangePassword',
        formFlag: 'true'
      },
      webService: endpoints.requestPassword
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
 * @function setNewPassword
 * @summary This is the API that will do the password reset.
 * @param {String} newPassword This is the new password the user has given
 * @param {String} newPasswordVerify This is the validation of the new password the user has given
 * @param {String} passwordHash This is the url param logonPasswordOld taken and unescaped when the user follows the URL link sent to their email.
 * @param {String} email This is the email of the user, you can take it from the url that they followed as well.
 * @see MuleSoft Doc:
 * @see https://childrensplace.atlassian.net/wiki/pages/viewpage.action?spaceKey=DT&title=API+Specification+Documentation&preview=/44072969/55181317/TCP%20-%20API%20Design%20Specification%20-%20Category-Myaccount_PasswordReset-Flow2_v1.docx
 * @return {Object} You will get back an object holding the userId.
 * @return success: true if the user has set their new password else will return and error code
 * @example setNewPassword("Codbo999!","Codbo999!",unescape("7eL9v5U3U3BoWl9zB9Rbkw%3d%3d"),"mikecit22@gmail.com").then((res) => {
  console.log(res); //{ success: true }

})
 */
  setNewPassword (newPassword, newPasswordVerify) {
    let queryObject = queryString.parse(location.search); // eslint-disable-line no-undef
    let {logonPasswordOld, email} = queryObject;

    let payload = {
      body: {
        storeId: this.apiHelper.configOptions.storeId,
        catalogId: this.apiHelper.configOptions.catalogId,
        langId: this.apiHelper.configOptions.langId,
        logonPassword: newPassword,
        logonPasswordVerify: newPasswordVerify,
        logonPasswordOld: (logonPasswordOld || '').replace(/ /gi, '+'),
        logonId: (email || '').toUpperCase().trim(),
        logonIdInput: (email || '').toUpperCase().trim(),
        stat: 'passwdconfirm',
        URL: 'ResetPasswordForm',
        formFlag: 'false', // if this is true the user will get an email
        errorViewName: 'ResetPasswordGuestErrorView',
        checkEmailAddress: '-',
        reLogonURL: 'ChangePassword',
        Relogon: 'Update',
        fromOrderId: '*',
        toOrderId: '.',
        deleteIfEmpty: '*',
        'continue': '1',
        createIfEmpty: '1',
        calculationUsageId: '-1',
        updatePrices: '0',
        myAcctMain: '1',
        isPasswordReset: 'false'
      },
      webService: endpoints.requestPassword
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
 * @function getProfile
 * @summary This API will return a logged in users information.
 * @return {Object} This will resolve with the users full info like name and email address exc: This is a general function to pull metadata that our backend has on the current user. Likewise on error you will get an object with the returned error code.
 * @return firstName: This is the users first name
 * @return lastName: This is the users last name
 * @return userId: This is need to get users credit cards on account.
 * @return phone: This is the users phone number
 * @return email: The users email address
 * @return isLoggedin: This can be used to know if the user is logged in, false means you are not logged in, aka your a guest
 * @return isRemembered: This can be used to know if the user is rememebered or not, false means you are not rememebered
 * @return country: (optional) The users country that they have selected, needed for changing shit to country
 * @return currency: (optional) The users currency that they have selected, needed for changing shit to country
 * @return language: (optional) The users language that they have selected, needed for changing shit to country
 * @see MuleSoft Doc:
 * @see Related Jira Tickets
 * @see https://childrensplace.atlassian.net/browse/DT-2155
 * @see https://childrensplace.atlassian.net/wiki/pages/viewpage.action?spaceKey=DT&title=API+Specification+Documentation&preview=/44072969/50233514/TCP%20-%20API%20Design%20Specification%20-%20Category-Myaccount_getRegisteredUserDetails_v2.docx
 * @example getProfile().then((res) => {
    console.log(res);
    {
      firstName: "half",
      lastName: "penny",
      isLoggedin: true,
      isRemembered: false,
      userId: "204650430",
      phone: "9898989898",
      email: "HALFPENNY@YOPMAIL.COM",
      country: "CA",
      currency: "USD",
      language: "fr"
    }
})
 */
  getProfile () {
    let payload = {
      header: {
        'X-Cookie': this.apiHelper.configOptions.cookie
      },
      body: {
        _: (new Date()).getTime()
      },
      webService: endpoints.getRegisteredUserDetailsInfo
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      } else {
        let accountAbstractor = getAccountAbstractor(this.apiHelper);
        let plccAddress = res.body.x_wicAddressDetails ? JSON.parse(res.body.x_wicAddressDetails) : null;
        let userPoints = res.body.x_pointsDetails ? JSON.parse(res.body.x_pointsDetails) : null;
        let addressBook = accountAbstractor.formatAddressBookResponse(res.body.contact || []);

        return {
          firstName: res.body.firstName,
          lastName: res.body.lastName,
          userId: res.body.userId,
          phone: res.body.phone1,
          email: res.body.email1,
          isLoggedin: parseBoolean(res.body.x_isRegistered) && !parseBoolean(res.body.x_isRememberedUser),
          isRemembered: parseBoolean(res.body.x_isRegistered) && parseBoolean(res.body.x_isRememberedUser),
          isPlcc: parseBoolean(res.body.x_hasPLCC),
          isExpressEligible: parseBoolean(res.body.x_isExpress),
          country: res.body.x_country,
          currency: res.body.x_currency,
          airmilesAccountNumber: res.body.x_airMilesAccount,
          myPlaceNumber: res.body.x_myPlaceAcctNumber,
          plccCardId: res.body.x_wicPlccId,
          plccCardNumber: res.body.x_wicPlccCardNo,
          associateId: res.body.x_associateId,
          hasPreScreenId: res.body.x_preScreenIdAvailability,
          isBopisEnabled: parseBoolean(res.body.x_isBOPISEnabled),
          isRopisEnabled: parseBoolean(res.body.x_isROPISEnabled),
          language: (res.body.x_language || '').substr(0, 2), // lang ('en') not locale ('en_US')
          addressBook: addressBook.length > 0 ? addressBook : null,
          // defaultBillingAddressId: res.body.x_billing_address_id
          defaultPlccAddress: plccAddress && {
            addressId: plccAddress.wicAddressId,
            address: {
              firstName: plccAddress.firstName,
              lastName: plccAddress.lastName,

              addressLine1: plccAddress.addressLine1,
              addressLine2: plccAddress.addressLine2,
              city: plccAddress.city,
              state: plccAddress.state,
              country: plccAddress.country || 'US',
              zipCode: plccAddress.zipCode
            },
            phoneNumber: plccAddress.phone1
          },
          userPoints: userPoints && {
            currentPoints: parseInt(userPoints.currentPoints),
            pointsToNextReward: parseInt(userPoints.pointsToNextReward) || 100,
            nextMonthRewards: userPoints.nextMonthRewards,
            currentMonthsRewards: userPoints.couponsSum
          }
        };
      }
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

  /**
   * @function addSignUpEmail
   * @summary This is the API to use when registering a user to our email singup for newsletters
   * @param {String} email - The users email address
   * @param {String} statusCode - This comes from Bright Verify, please see the briteVerifyStatusExtraction function
   * @return {Object} This will upon successfuly resolving return and object holding a success flag, true if the user has been added to the mailing list. Likewise on error you will get an object with the returned error code.
   * @see MuleSoft Doc:
   * @see https://childrensplace.atlassian.net/wiki/pages/viewpage.action?spaceKey=DT&title=API+Specification+Documentation&preview=/44072969/50233456/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_addSignUpEmail_v6.docx
   * @example addSignUpEmail("mikecit22@gmail.com").then((res) => {
        console.log(res) // { success: true }
  })
 */
  addSignUpEmail (email, statusCode) {

    let payload = {
      body: {
        storeId: this.apiHelper.configOptions.storeId,
        catalogId: this.apiHelper.configOptions.catalogId,
        langId: this.apiHelper.configOptions.langId,
        emailaddr: email.trim(),
        URL: 'email-confirmation',
        response: statusCode || 'no_response::false:false'
      },
      webService: endpoints.addSignUpEmail
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
   * @function validateAndSubmitEmailSignup
   * @summary This is the API to use when registering a user to our email singup for newsletters but we need bright verify validation code
   * @param {String} email - The users email address
  */
  validateAndSubmitEmailSignup (emailAddress) {
    // This will never catch, even when briteVerifyStatusExtraction fails it will resolve
    return briteVerifyStatusExtraction(emailAddress)
      .then((statusCode) => this.addSignUpEmail(emailAddress, statusCode));
  }

/**
 * @function updateShippingCountry
 * @summary This is the API used to changed the users shipping preference and language from the header.
 * @param {Object} args - This is an object of strings whose members are the below params
 * @param {String} args.oldLanguageCode - this is the language code that the user had before they changed it
 * @param {String} args.newLanguageCode - the language code the user selected, these values are hard coded and there is no service that provides this. we only support english, french,  and spanish
 * @param {String} args.newCurrencyCode - the currency code the user selected, this code can be found in getCountriesWithCurrencyCodes service
 * @param {String} args.oldCountryCode - this is the Country Code that the user had before they changed it
 * @param {String} args.newCountryCode - the county code the user selected, this code can be found in getCountriesWithCurrencyCodes service
 * @param {String} args.exchangeRate - this is the exchange Rate for the selected currency
 * @param {String} args.merchantMargin - this Merchant Margin data will come in with the getCountriesWithCurrencyCodes feed per Country. we need to pass it into here.
 * @param {String} args.quoteId - this is quoteId for the selected currency (backend sends it to us for each currency, and we send it back here)
 * @param {String} args.exchangeRoundMethod - this is the exchangeRoundMethod for the selected currency  (backend sends it to us for each currency, and we send it back here)
 * @see getCountriesWithCurrencyCodes
 * @return {Object} On successful resolution this will return an object holding the URL of the flag image as well as the cookie to be set. Likewise on error you will get an object with the returned error code.
 * @return flagURL: This is the src to the new flag image.
 * @return iShipCookie: This is the cookie that is returned.
 * @see MuleSoft Doc:
 * @see https://childrensplace.atlassian.net/wiki/pages/viewpage.action?spaceKey=DT&title=API+Specification+Documentation&preview=/44072969/50233494/TCP%20-%20API%20Design%20Specification%20-%20Category-GlobalComponents_addShipToStore_v3.docx
 * @example updateShippingCountry(args).then((res) => {
  console.log(res);
  {
    flagURL: '/wcsstore/GlobalSAS/images/tcp/international_shipping/flags/AG.gif'
    iShipCookie: 'AG|en_US|USD|1.0000000000|2|34610658|1.0000000000'
  }
})
 */
  updateShippingCountry (args) {
    let payload = {
      header: {
        'X-Cookie': this.apiHelper.configOptions.cookie,
        storeId: (args.newCountryCode === 'CA') ? routingConstants.sitesInfo.storeIdCA : routingConstants.sitesInfo.storeIdUS,
        catalogId: (args.newCountryCode === 'CA') ? routingConstants.sitesInfo.catalogIdCA : routingConstants.sitesInfo.catalogIdUS,
        langId: this.apiHelper.configOptions.langId // added it now.
      },
      body: {
        // NOTE: this to field belew, were asked to be added to patch a bug in backend since the retarded don't have a fucking clue on how to fix them. So once more let's add overhead to my code. Which btw turned to be ugly!
        storeId: (args.newCountryCode === 'CA') ? routingConstants.sitesInfo.storeIdCA : routingConstants.sitesInfo.storeIdUS,
        catalogId: (args.newCountryCode === 'CA') ? routingConstants.sitesInfo.catalogIdCA : routingConstants.sitesInfo.catalogIdUS,
        langId: this.apiHelper.configOptions.langId,
        cc: args.oldCountryCode,
        er: args.exchangeRate, // + '|' + args.exchangeRoundMethod + '|' + args.quoteId, // DT-32833 since we don't have value for exchangeRoundMethod and quoteId so removed delimeter from payload.
        mm: args.merchantMargin,
        URL: 'http://www.childrensplace.com/', // As per backend we need to send this hardcoded value
        ccd: args.newCountryCode,
        languageTCP: args.newLanguageCode,
        selLanguage: args.oldLanguageCode,
        curr: args.newCurrencyCode,
        orderId: '.',
        USA: 'USD', // As per backend we need to send this hardcoded value
        CA: 'CAD' // As per backend we need to send this hardcoded value
      },
      webService: endpoints.addShipToStore
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      } else {
        return {
          flagURL: '/wcsstore/GlobalSAS/images/tcp/international_shipping/flags/' + res.body.flagName,
          iShipCookie: res.body.shippingCookie
        };
      }
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

/**
 * @function getCurrentRewardPoints
 * @summary This is used to get the amount of points the user has in his account, likewise the points that they need for their next reward.
 * @return {Object} This will resolve with and object holding the users current points and points that will be applied for next months rewards. Likewise on error you will get an object with the returned error code.
 * @return currentPoints: Indicates the current points the user has in their account.
 * @return pointsToNextReward: Indicates how many more points the user needs to hit their next reward.
 * @return nextMonthRewards: This will be to dollar amount that the user will get in rewards next month.
 * @return nextMonthRewards: This is the dollar value of the rewards you have available to you on your account.
 * @see MuleSoft Doc:
 * @see https://childrensplace.atlassian.net/wiki/pages/viewpage.action?spaceKey=DT&title=API+Specification+Documentation&preview=/44072969/60555267/TCP%20-%20API%20Design%20Specification%20-%20Category-Myaccount_getAvailablePoints_v2.docx
 * @example getCurrentRewardPoints().then((res) => {
    console.log(res);
    {
      currentPoints: 200,
      pointsToNextReward: 100,
      nextMonthRewards: 10, //$10
      currentMonthsRewards: 10, //$10
    }
});
 */
  getCurrentRewardPoints () {
    let payload = {
      header: {
        'X-Cookie': this.apiHelper.configOptions.cookie
      },
      webService: endpoints.getPointsService
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      } else {
        return {
          currentPoints: parseInt(res.body.currentPoints),
          pointsToNextReward: res.body.pointsToNextReward,
          nextMonthRewards: res.body.nextMonthRewards,
          currentMonthsRewards: res.body.couponsSum
        };
      }
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

/*
 * @function __getRewardPointsTransactions
 * @summary This is used to get a full history of transactions on a users points account.
 * @return {Object} This will resolve with an object holding your points history and the amount of points you have. Likewise on error you will get an object with the returned error code.
 * @see MuleSoft Doc:
 * @see https://childrensplace.atlassian.net/wiki/pages/viewpage.action?spaceKey=DT&title=API+Specification+Documentation&preview=/44072969/53641217/TCP%20-%20API%20Design%20Specification%20-%20Category-Myaccount_getMyPointsHistory_v1.docx
 * @example getRewardPointsTransactions().then((res) => {
    console.log(res);
      {
        totalPoints: 0,
        pointsHistoryData: [
          {
              "transactionTypeName": "Points Redemption",
              "pointsEarned": -2000,
              "transactionDate": "2016-05-25T04:00:00.000Z"
            },
            {
              "transactionTypeName": "Points Redemption",
              "pointsEarned": -1000,
              "transactionDate": "2016-05-25T04:00:00.000Z"
            }
          ]
      }
})
 */
  getRewardPointsTransactions () {
    let payload = {
      header: {
        'X-Cookie': this.apiHelper.configOptions.cookie
      },
      webService: endpoints.getMyPointHistory
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }
      return {
        myPlaceId: res.body.pointsHistoryList[0].customerInfo.myPlaceId,
        totalPoints: res.body.pointsHistoryList[0].totalPoints,
        pointsHistoryData: res.body.pointsHistoryList[0].pointsHistoryData // (new Date("05/25/16")).toJSON()
      };
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

/**
 * @function getAvailableCoupons
 * @summary This API is used to get all coupons the user has on their account
 * @see MuleSoft Doc:
 * @see https://childrensplace.atlassian.net/wiki/pages/viewpage.action?spaceKey=DT&title=API+Specification+Documentation&preview=/44072969/50233492/TCP%20-%20API%20Design%20Specification%20-%20Category-Checkout_getCoupons_v4.docx
 * @see Related Jira Tickets:
 * @see https://childrensplace.atlassian.net/browse/DT-5412
 * @see https://childrensplace.atlassian.net/browse/DT-2173
 * @return {Object} TBD need test data
 */
  getAvailableCoupons () {
    let payload = {
      header: {
        'X-Cookie': this.apiHelper.configOptions.cookie
      },
      webService: endpoints.getCoupon
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      let coupons = [];
    /**
    {
      "coupons": {
        "couponArray": [
          [

          ]
        ],
        "savingsTotal": [
          0.0
        ]
      }
    }
    */
      res.body.coupons.couponArray[0].map((coupon) => {
        let endDate = parseDate(coupon.couponEndDate);

        coupons.push({
          id: coupon.couponCode,
          status: COUPON_STATUS.AVAILABLE,
          title: coupon.couponDescription,
          detailsOpen: false,
          expirationDate: (endDate.getMonth() + 1) + '/' + endDate.getDate() + '/' + (endDate.getFullYear().toString().substr(-2)),
          details: '',
          imageThumbUrl: getCouponImageThumb(coupon.promotionType),
          imageUrl: getCouponImage(coupon.promotionType),
          error: '',
          redemptionType: COUPON_REDEMPTION_TYPE.WALLET
        });
      });
      return coupons;
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }

/**
 * @function getAllAvailableCouponsAndPromos
 */
  getAllAvailableCouponsAndPromos () {
    let payload = {
      header: { },
      webService: endpoints.getAllAvailableCouponsAndPromos
    };

    return this.apiHelper.webServiceCall(payload).then((res) => {
      if (this.apiHelper.responseContainsErrors(res)) {
        throw new ServiceResponseError(res);
      }

      let now = new Date();
      let oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
      let expirationThreshold = 7;

      let coupons = [];
      for (let coupon of res.body.appliedCoupons.userCoupons) {
        let startDate = parseDate(coupon.couponStartDate || coupon.effectiveDate);
        let endDate = parseDate(coupon.expirationDate);
        let isPlaceCash = coupon.promotionType === 'PC' || coupon.promotionType === 'PLACECASH';

        coupons.push({
          id: coupon.code,
          status: COUPON_STATUS.APPLIED,
          title: coupon.promotionName,
          detailsOpen: false,
          expirationDate: (endDate.getMonth() + 1) + '/' + endDate.getDate() + '/' + (endDate.getFullYear().toString().substr(-2)),
          effectiveDate: (startDate.getMonth() + 1) + '/' + startDate.getDate() + '/' + (startDate.getFullYear().toString().substr(-2)),
          details: coupon.couponLongDescription,
          isStarted: isPlaceCash ? compareDate(now, startDate) : true,
          isApplicable: parseBoolean(coupon.isApplicable),
          imageThumbUrl: getCouponImageThumb(coupon.promotionType),
          imageUrl: getCouponImage(coupon.promotionType),
          error: '',
          redemptionType: isPlaceCash ? COUPON_REDEMPTION_TYPE.PLACECASH : COUPON_REDEMPTION_TYPE.WALLET,
          promotionType: getPromotionType(coupon.promotionType, coupon.amountOff)
        });
      }

      for (let coupon of res.body.availableCoupons.userCoupons) {
        let startDate = parseDate(coupon.couponStartDate || coupon.effectiveDate);
        let expirationDate = parseDate(coupon.expirationDate);
        let isExpiring = Math.round(Math.abs((expirationDate.getTime() - now.getTime()) / oneDay)) <= expirationThreshold;
        let isPlaceCash = coupon.promotionType === 'PC' || coupon.promotionType === 'PLACECASH';

        coupons.push({
          id: coupon.code,
          status: COUPON_STATUS.AVAILABLE,
          isExpiring: isExpiring,
          title: coupon.promotionName,
          detailsOpen: false,
          effectiveDate: (startDate.getMonth() + 1) + '/' + startDate.getDate() + '/' + (startDate.getFullYear().toString().substr(-2)),
          expirationDate: (expirationDate.getMonth() + 1) + '/' + expirationDate.getDate() + '/' + (expirationDate.getFullYear().toString().substr(-2)),
          details: coupon.couponLongDescription,
          isStarted: isPlaceCash ? compareDate(now, startDate) : true,
          imageThumbUrl: getCouponImageThumb(coupon.promotionType || 'LOYALTY'),
          imageUrl: getCouponImage(coupon.promotionType || 'LOYALTY'),
          error: '',
          redemptionType: isPlaceCash ? COUPON_REDEMPTION_TYPE.PLACECASH : COUPON_REDEMPTION_TYPE.WALLET,
          isApplicable: true,
          promotionType: getPromotionType(coupon.promotionType, coupon.amountOff)
        });
      }

      for (let coupon of res.body.appliedCoupons.siteCoupons) {
        let startDate = parseDate(coupon.couponStartDate || coupon.effectiveDate);
        let couponEndDate = parseDate(coupon.couponEndDate);
        coupons.push({
          id: coupon.couponCode,
          status: COUPON_STATUS.APPLIED,
          title: coupon.couponDescription,
          detailsOpen: false,
          expirationDate: (couponEndDate.getMonth() + 1) + '/' + couponEndDate.getDate() + '/' + (couponEndDate.getFullYear().toString().substr(-2)),
          effectiveDate: (startDate.getMonth() + 1) + '/' + startDate.getDate() + '/' + (startDate.getFullYear().toString().substr(-2)),
          isStarted: true,
          details: coupon.couponLongDescription,
          imageThumbUrl: getCouponImageThumb('OTHERS'),
          imageUrl: getCouponImage('OTHERS'),
          error: '',
          redemptionType: COUPON_REDEMPTION_TYPE.PUBLIC,
          isApplicable: parseBoolean(coupon.isApplicable),
          promotionType: getPromotionType(coupon.promotionType)
        });
      }

      for (let coupon of res.body.availableCoupons.siteCoupons) {
        let startDate = parseDate(coupon.couponStartDate || coupon.effectiveDate);
        let expirationDate = parseDate(coupon.couponEndDate);
        let isExpiring = Math.round(Math.abs((expirationDate.getTime() - now.getTime()) / oneDay)) <= expirationThreshold;

        coupons.push({
          id: coupon.couponCode,
          status: COUPON_STATUS.AVAILABLE,
          isExpiring: isExpiring,
          title: coupon.couponDescription,
          detailsOpen: false,
          expirationDate: (expirationDate.getMonth() + 1) + '/' + expirationDate.getDate() + '/' + (expirationDate.getFullYear().toString().substr(-2)),
          effectiveDate: (startDate.getMonth() + 1) + '/' + startDate.getDate() + '/' + (startDate.getFullYear().toString().substr(-2)),
          isStarted: true,
          details: coupon.couponLongDescription,
          imageThumbUrl: getCouponImageThumb('OTHERS'),
          imageUrl: getCouponImage('OTHERS'),
          error: '',
          redemptionType: COUPON_REDEMPTION_TYPE.PUBLIC,
          isApplicable: true,
          promotionType: getPromotionType(coupon.promotionType)
        });
      }
      return coupons;
    }).catch((err) => {
      throw this.apiHelper.getFormattedError(err);
    });
  }
}

// NOTE: (DT-19681) LOYALTY/PLACECASH/OTHERS
function getPromotionType (promotionType) {
  switch (promotionType) {
    case 'PC':
      return COUPON_REDEMPTION_TYPE.PLACECASH;
    case 'LOYALTY':
      return COUPON_REDEMPTION_TYPE.LOYALTY;
    default:
      return COUPON_REDEMPTION_TYPE.PUBLIC;
  }
}

function getCouponImage (promotionType) {
  switch (promotionType) {
    case 'PC':
      return 'place-cash-logo.png';
    case 'PLACECASH':
      return 'place-cash-logo.png';
    case 'LOYALTY':
      return 'reward-logo.png';
    case 'OTHERS':
      return 'saving-logo.png';
    default:
      return 'saving-logo.png';
  }
}

function getCouponImageThumb (promotionType) {
  switch (promotionType) {
    case 'PC':
      return '/wcsstore/static/images/plcc-icon-thumb.png';
    case 'PLACECASH':
      return '/wcsstore/static/images/plcc-icon-thumb.png';
    case 'LOYALTY':
      return '/wcsstore/static/images/rewards-icon-thumb.png';
    case 'OTHERS':
      return '/wcsstore/static/images/saving-icon-thumb.png';
    default:
      return '/wcsstore/static/images/saving-icon-thumb.png';
  }
}
