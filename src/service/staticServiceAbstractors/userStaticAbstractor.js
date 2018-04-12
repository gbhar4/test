/**
@module User Static Service Abstractors
*/
import {editJsonPopup} from 'util/testUtil/editJsonPopup';
import {COUPON_REDEMPTION_TYPE} from 'reduxStore/storeReducersAndActions/couponsAndPromos/couponsAndPromos';
import {parseDate, compareDate} from 'util/parseDate.js';

export function getUserAbstractor () {
  return UserStaticAbstractor;
}

const UserStaticAbstractor = {
  register: function (args) {
    return editJsonPopup('register', { success: true }, args);
  },

  login: function (email, password, rememberMe) {
    return editJsonPopup('login', { success: true }, {email, password, rememberMe});
  },

  logout: function () {
    return editJsonPopup('logout', { success: true });
  },

  getPasswordResetEmail: function (email) {
    return editJsonPopup('getPasswordResetEmail', { success: true }, {email});
  },

  setNewPassword: function (newPassword, newPasswordVerify, passwordHash, email) {
    return editJsonPopup('setNewPassword', { success: true }, {newPassword, newPasswordVerify, passwordHash, email});
  },

  getProfile: function () {
    return editJsonPopup('getProfile', {
      firstName: 'half',
      lastName: 'penny',
      isLoggedin: true,
      isRemembered: false,
      userId: '204650430',
      phone: '9898989898',
      email: 'half@yoyo.com',
      country: 'US',
      currency: 'USD',
      language: 'en',
      isPlcc: false,
      isExpressEligible: true,
      myPlaceNumber: 'M40180301666666',
      plccCardId: '12312321',
      plccCardNumber: '4567',
      isBopisEnabled: true,
      isRopisEnabled: true,
      defaultPlccAddress: {
        addressId: '',
        address: {
          firstName: '',
          lastName: '',

          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          country: '',
          zipCode: ''
        },
        phoneNumber: ''
      },
      addressBook: [
        {
          addressId: '546465',
          addressKey: 'Citro\'s Address',
          address: {
            firstName: 'Michael',
            lastName: 'Citro',

            addressLine1: '707 Lib Ave',
            addressLine2: '',
            city: 'Canada',
            state: 'QC',
            country: 'CA',
            zipCode: '07047'
          },
          emailAddress: 'mike@citro.com',
          phoneNumber: '5555555555',
          type: 'Billing',
          isDefault: true // backend sends a string
        },
        {
          addressId: '543335',
          addressKey: 'Citro\'s 2nd Address',
          address: {
            firstName: 'John',
            lastName: 'Citro',

            addressLine1: '707 Lib Ave',
            addressLine2: '',
            city: 'Jersey City',
            state: 'NJ',
            country: 'US',
            zipCode: '07047'
          },
          emailAddress: 'mike@citro2.com',
          type: 'ShippingAndBilling',
          phoneNumber: '5555555555',
          isDefault: false // backend sends a string
        },
        {
          addressId: '513336',
          addressKey: 'Citro\'s 3nd Address',
          address: {
            firstName: 'John',
            lastName: 'Citro',

            addressLine1: '707 Lib Ave',
            addressLine2: '',
            city: 'Jersey City',
            state: 'CA',
            country: 'CAD',
            zipCode: 'L6T4L7'
          },
          emailAddress: 'mike@citro2.com',
          type: 'ShippingAndBilling',
          phoneNumber: '5555555555',
          isDefault: false // backend sends a string
        }
      ]
    });
  },

  addSignUpEmail: function (email, statusCode) {
    return editJsonPopup('addSignUpEmail', { success: true }, {email, statusCode});
  },

  validateAndSubmitEmailSignup: function (email, statusCode) {
    return editJsonPopup('validateAndSubmitEmailSignup', { success: true }, {email, statusCode});
  },

  updateShippingCountry: function (args) {
    return editJsonPopup('updateShippingCountry', {
      flagURL: '/wcsstore/GlobalSAS/images/tcp/international_shipping/flags/AG.gif',
      iShipCookie: 'AG|en_US|USD|1.0000000000|2|34610658|1.0000000000'
    }, args);
  },

  getCurrentRewardPoints: function () {
    return editJsonPopup('getCurrentRewardPoints', {
      currentPoints: 200,
      pointsToNextReward: 100,
      nextMonthRewards: 10,
      currentMonthsRewards: 10
    });
  },

  getRewardPointsTransactions: function () {
    return editJsonPopup('getRewardPointsTransactions', {
      totalPoints: 0,
      pointsHistoryData: [
        {
          'transactionTypeName': 'Points Redemption',
          'pointsEarned': -2000,
          'transactionDate': '2016-05-25T04:00:00.000Z'
        },
        {
          'transactionTypeName': 'Points Redemption',
          'pointsEarned': -1000,
          'transactionDate': '2016-05-25T04:00:00.000Z'
        }
      ]
    });
  },

  getAllAvailableCouponsAndPromos: function () {
    let now = new Date();
    return editJsonPopup('getAllAvailableCouponsAndPromos', [
      {
        id: 'Y00305JVUKV6TX',
        status: 'available',
        title: 'Place Cash $10 OFF (-y00305)',
        detailsOpen: false,
        expirationDate: '10/5/21',
        effectiveDate: '10/08/20',
        isStarted: compareDate(now, parseDate('2020-08-10 00:00:00.0')),
        isExpiring: false,
        details: 'To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores…',
        imageThumbUrl: getCouponImageThumb('PC'),
        imageUrl: getCouponImage('PC'),
        error: '',
        redemptionType: COUPON_REDEMPTION_TYPE.PLACECASH,
        promotionType: COUPON_REDEMPTION_TYPE.PLACECASH,
        isApplicable: true
      }, {
        id: 'Y00305JVUKV6TA',
        status: 'available',
        title: 'Place Cash $10 OFF (-y00305)',
        detailsOpen: false,
        expirationDate: '10/5/19',
        effectiveDate: '10/08/15',
        isStarted: compareDate(now, parseDate('2017-10-11 00:00:00.0')),
        isExpiring: false,
        details: 'To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores…',
        imageThumbUrl: getCouponImageThumb('PC'),
        imageUrl: getCouponImage('PC'),
        error: '',
        redemptionType: COUPON_REDEMPTION_TYPE.PLACECASH,
        promotionType: COUPON_REDEMPTION_TYPE.PLACECASH,
        isApplicable: true
      }, {
        id: 'Y00305JVUKV6TM',
        status: 'available',
        title: 'Place Cash $10 OFF (-y00305)',
        detailsOpen: false,
        expirationDate: '10/5/19',
        effectiveDate: '10/08/15',
        isStarted: compareDate(now, parseDate('2017-09-11 00:00:00.0')),
        isExpiring: false,
        details: 'To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores…',
        imageThumbUrl: getCouponImageThumb('PC'),
        imageUrl: getCouponImage('PC'),
        error: '',
        redemptionType: COUPON_REDEMPTION_TYPE.PLACECASH,
        promotionType: COUPON_REDEMPTION_TYPE.PLACECASH,
        isApplicable: true
      }, {
        id: 'Y00305JVUYV6TX',
        status: 'available',
        title: 'LOYALTY $15',
        detailsOpen: false,
        expirationDate: '1/10/21',
        effectiveDate: '20/08/20',
        isStarted: false,
        isExpiring: false,
        details: 'To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores…',
        imageThumbUrl: getCouponImageThumb('LOYALTY'),
        imageUrl: getCouponImage('LOYALTY'),
        error: '',
        redemptionType: COUPON_REDEMPTION_TYPE.WALLET,
        promotionType: COUPON_REDEMPTION_TYPE.LOYALTY,
        isApplicable: true
      }, {
        id: 'MERCHPCT10',
        status: 'applied',
        title: '10% OFF NO THRESHOLD',
        detailsOpen: false,
        expirationDate: '10/9/18',
        effectiveDate: '10/08/15',
        isStarted: false,
        isExpiring: false,
        details: 'To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores…',
        alert: {
          shortMessage: 'Some reason',
          detailsMessage: 'To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores… To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores…',
          detailsOpen: false
        },
        imageThumbUrl: getCouponImageThumb('public'),
        imageUrl: getCouponImage('public'),
        error: '',
        redemptionType: 'public',
        promotionType: 'public',
        isApplicable: true
      }, {
        id: 'MERCHPCT10a',
        status: 'applied',
        title: '10% OFF NO THRESHOLDa',
        detailsOpen: false,
        isStarted: false,
        expirationDate: '10/9/18',
        effectiveDate: '10/08/15',
        isExpiring: false,
        details: 'To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores…',
        imageThumbUrl: getCouponImageThumb('public'),
        imageUrl: getCouponImage('public'),
        error: '',
        redemptionType: 'public',
        promotionType: 'public',
        isApplicable: true
      }, {
        id: 'MERCHPCT10b',
        status: 'applied',
        title: '10% OFF NO THRESHOLDb',
        detailsOpen: false,
        expirationDate: '10/9/18',
        effectiveDate: '10/08/15',
        isExpiring: false,
        isStarted: false,
        details: 'To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores…',
        imageThumbUrl: getCouponImageThumb('public'),
        imageUrl: getCouponImage('public'),
        error: '',
        redemptionType: 'public',
        promotionType: 'public',
        isApplicable: true
      }, {
        id: 'MERCHPCT11',
        status: 'pending',
        title: '20% OFF NO THRESHOLD',
        detailsOpen: false,
        expirationDate: '10/5/18',
        effectiveDate: '10/08/15',
        isExpiring: true,
        isStarted: false,
        details: 'To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores…',
        imageThumbUrl: getCouponImageThumb('PC'),
        imageUrl: getCouponImage('PC'),
        error: '',
        redemptionType: COUPON_REDEMPTION_TYPE.WALLET,
        promotionType: COUPON_REDEMPTION_TYPE.PLACECASH,
        isApplicable: true
      }, {
        id: 'Y00305JVUKV6TZ',
        status: 'available',
        title: 'LOYALTY $15',
        detailsOpen: false,
        expirationDate: '3/10/22',
        effectiveDate: '10/08/15',
        isExpiring: false,
        isStarted: false,
        details: 'To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores…',
        imageThumbUrl: getCouponImageThumb('LOYALTY'),
        imageUrl: getCouponImage('LOYALTY'),
        error: '',
        redemptionType: COUPON_REDEMPTION_TYPE.WALLET,
        promotionType: COUPON_REDEMPTION_TYPE.LOYALTY,
        isApplicable: true
      }, {
        id: 'MERCHPCT12',
        status: 'available',
        title: '10% OFF NO THRESHOLD',
        detailsOpen: false,
        expirationDate: '1/1/21',
        effectiveDate: '10/08/16',
        isExpiring: true,
        isStarted: true,
        details: 'To receive Double Points, customer must make a qualifying My Place Rewards purchase 12/10/2015 - 01/01/2021 at The Children’s Place stores…',
        imageThumbUrl: getCouponImageThumb('public'),
        imageUrl: getCouponImage('public'),
        error: '',
        redemptionType: 'public',
        promotionType: 'public',
        isApplicable: true
      }]);
  }
};

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
