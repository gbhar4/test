/**
 * @module myAccountRoutes
 * @summary MY_ACCOUNT_SECTIONS holds all the routes we are routing between withing the MyAccount Page.
 *
 * Explanation of fields of each entry of MY_ACCOUNT_SECTIONS (and recursively, each entry inside a subsections object):
 *  id:                   A unique name for the section. MUST be equal to the key used for that object (i.e., key === MY_ACCOUNT_SECTIONS[key].id)
 *  page:                 The object in PAGES representing the page containing these sections.
 *  displayName:          The string to be rendered in the UI representing this section (e.g., in hyperlinks and bread-crumbs);
 *  pathPart:             The portion of the url path of this section that immediately follows the page's pathPart.
 *                          Note: it is assumed that every sub-section has a path part that adds one '/' to that of its parent section,
 *                          like this: sec/sebSec/subSubSec/ etc.
 *  pathPattern:          An express-like path pattern to be used to match this section (usually passed as the <code>path</code> prop
 *                          to a react-router <code>Route</code> component, and contins parameters to match any sub-sections (if exist).
 *  rootPathPattern:      (optional) An express-like path pattern to be used to match this section (but not any of its sub-sections).
 *  dontScrollUpOnEntry:  (optional) A Boolean indicating that one should not scroll the windo to the top when this section is routed to.
 *  subsections:          (optional) An object representing any nested sub-sections. Has the same recursive structure as MY_ACCOUNT_SECTIONS.
 *
 * @author Citro
 * @author Ben
**/

import {PAGES} from './pages';

export const MY_ACCOUNT_PAGE = PAGES.myAccount;

export const MY_ACCOUNT_SECTIONS = {
  myRewards: {
    id: 'myRewards',
    page: MY_ACCOUNT_PAGE,
    displayName: 'My Rewards & Offers',
    pathPart: 'rewards',
    pathPattern: '/:siteId/account/rewards/:subsection?',
    rootPathPattern: '/:siteId/account/rewards',
    subSections: {
      rewards: {
        id: 'rewards',
        page: MY_ACCOUNT_PAGE,
        displayName: 'My Rewards',
        pathPart: 'rewards/',
        pathPattern: '/:siteId/account/rewards'
        // dontScrollUpOnEntry: true
      },
      pointsHistory: {
        id: 'pointsHistory',
        page: MY_ACCOUNT_PAGE,
        displayName: 'Points History',
        pathPart: 'rewards/points-history',
        pathPattern: '/:siteId/account/rewards/points-history'
      },
      offersAndCoupons: {
        id: 'rewardsOffersAndCoupons',
        page: MY_ACCOUNT_PAGE,
        displayName: 'My Offers & Coupons',
        pathPart: 'rewards/offers',
        pathPattern: '/:siteId/account/rewards/offers'
      },
      pointsClaim: {
        id: 'pointsClaim',
        page: MY_ACCOUNT_PAGE,
        displayName: 'Points Claim',
        pathPart: 'rewards/points-claim',
        pathPattern: '/:siteId/account/rewards/points-claim'
      }
    }
  },
  offersAndCoupons: {
    id: 'offersAndCoupons',
    page: MY_ACCOUNT_PAGE,
    displayName: 'Offers & Coupons',
    pathPart: 'offers',
    pathPattern: '/:siteId/account/offers'
  },
  orders: {
    id: 'orders',
    page: MY_ACCOUNT_PAGE,
    displayName: 'Orders',
    pathPart: 'orders',
    pathPattern: '/:siteId/account/orders/:subsection?',
    rootPathPattern: '/:siteId/account/orders',
    subSections: {
      orderDetails: {
        id: 'orderDetails',
        page: MY_ACCOUNT_PAGE,
        displayName: 'Order Details',
        pathPart: 'orders/order-details',
        pathPattern: '/:siteId/account/orders/order-details/:orderId'
      }
    }
  },
  reservations: {
    id: 'reservations',
    page: MY_ACCOUNT_PAGE,
    displayName: 'Reservation History',
    pathPart: 'reservations',
    pathPattern: '/:siteId/account/reservations/:subsection?',
    rootPathPattern: '/:siteId/account/reservations',
    subSections: {
      reservationDetails: {
        id: 'reservationDetails',
        page: MY_ACCOUNT_PAGE,
        displayName: 'Reservation Details',
        pathPart: 'reservations/reservation-details',
        pathPattern: '/:siteId/account/reservations/reservation-details/:reservationId'
      }
    }
  },
  addressBook: {
    id: 'addressBook',
    page: MY_ACCOUNT_PAGE,
    displayName: 'Address Book',
    pathPart: 'address-book',
    pathPattern: '/:siteId/account/address-book/:subsection?',
    rootPathPattern: '/:siteId/account/address-book',
    subSections: {
      addNewAddress: {
        id: 'addNewAddress',
        page: MY_ACCOUNT_PAGE,
        displayName: 'Add New Shipping Address',
        pathPart: 'address-book/add-new-address',
        pathPattern: '/:siteId/account/address-book/add-new-address'
      },
      editAddress: {
        id: 'editAddress',
        page: MY_ACCOUNT_PAGE,
        displayName: 'Edit Shipping Address',
        pathPart: 'address-book/edit-address',
        pathPattern: '/:siteId/account/address-book/edit-address/:addressId'
      }
    }
  },
  paymentAndGiftCards: {
    id: 'paymentAndGiftCards',
    page: MY_ACCOUNT_PAGE,
    displayName: 'Payment & Gift Cards',
    pathPart: 'payment',
    pathPattern: '/:siteId/account/payment/:subsection?',
    rootPathPattern: '/:siteId/account/payment',
    subSections: {
      addCreditCard: {
        id: 'addCreditCard',
        page: MY_ACCOUNT_PAGE,
        displayName: 'Add a Credit or Debit Card',
        pathPart: 'payment/add-credit-card',
        pathPattern: '/:siteId/account/payment/add-credit-card'
      },
      addGiftCard: {
        id: 'addGiftCard',
        page: MY_ACCOUNT_PAGE,
        displayName: 'Add Gift Cards or Merchandise Credits',
        pathPart: 'payment/add-gift-card',
        pathPattern: '/:siteId/account/payment/add-gift-card'
      },
      editCreditCard: {
        id: 'editCreditCard',
        page: MY_ACCOUNT_PAGE,
        displayName: 'Edit Credit Card',
        pathPart: 'payment/edit-credit-card',
        pathPattern: '/:siteId/account/payment/edit-credit-card/:creditCardId'
      }
    }
  },
  profileInformation: {
    id: 'profileInformation',
    page: MY_ACCOUNT_PAGE,
    displayName: 'Profile Information',
    pathPart: 'profile',
    pathPattern: '/:siteId/account/profile/:subsection?',
    rootPathPattern: '/:siteId/account/profile',
    subSections: {
      birthdaySavings: {
        id: 'birthdaySavings',
        page: MY_ACCOUNT_PAGE,
        displayName: 'Birthday Savings',
        pathPart: 'profile/birthday-savings',
        pathPattern: '/:siteId/account/profile/birthday-savings'
      }
    }
  },
  communicationPreferences: {
    id: 'communicationPreferences',
    page: MY_ACCOUNT_PAGE,
    displayName: 'Communication Preferences',
    pathPart: 'preferences',
    pathPattern: '/:siteId/account/preferences',
    rootPathPattern: '/:siteId/account/preferences'
  }
};
