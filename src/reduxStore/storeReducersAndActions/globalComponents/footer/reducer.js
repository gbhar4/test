import Immutable from 'seamless-immutable';

const setCountrySelectorVisible = function (footer, isCountrySelectorVisible) {
  return Immutable.setIn(footer, ['uiFlags', 'isCountrySelectorVisible'], isCountrySelectorVisible);
};

const setTrackOrderVisible = function (footer, isTrackOrderVisible) {
  return Immutable.setIn(footer, ['uiFlags', 'isTrackOrderVisible'], isTrackOrderVisible);
};

const setTrackReservationVisible = function (footer, isTrackReservationVisible) {
  return Immutable.setIn(footer, ['uiFlags', 'isTrackReservationVisible'], isTrackReservationVisible);
};

const setNewsLetterSignUpConfirming = function (footer, isNewsLetterSignUpConfirming) {
  return Immutable.setIn(footer, ['uiFlags', 'isNewsLetterSignUpConfirming'], isNewsLetterSignUpConfirming);
};

const setNewsLetterSignUpUpdating = function (footer, isNewsLetterSignUpUpdating) {
  return Immutable.setIn(footer, ['uiFlags', 'isNewsLetterSignUpUpdating'], isNewsLetterSignUpUpdating);
};

const setFooterNavigationTree = function (footer, navigationTree) {
  return Immutable.merge(footer, {navigationTree});
};

let defaultState = {
  navigationTree: [],
  uiFlags: {
    isCountrySelectorVisible: false,
    isTrackOrderVisible: false,
    isTrackReservationVisible: false,
    isNewsLetterSignUpUpdating: false,
    isNewsLetterSignUpConfirming: false
  }
};

const footerReducer = function (footer = defaultState, action) {
  switch (action.type) {
    case 'GLOBAL_FOOTER_SET_COUNTRY_SELECTOR_VISIBLE':
      return setCountrySelectorVisible(footer, action.isCountrySelectorVisible);
    case 'GLOBAL_FOOTER_SET_TRACK_ORDER_VISIBLE':
      return setTrackOrderVisible(footer, action.isTrackOrderVisible);
    case 'GLOBAL_FOOTER_SET_TRACK_RESERVATION_VISIBLE':
      return setTrackReservationVisible(footer, action.isTrackReservationVisible);
    case 'GLOBAL_FOOTER_SET_NEWS_LETTER_CONFIRM':
      return setNewsLetterSignUpConfirming(footer, action.isNewsLetterSignUpConfirming);
    case 'GLOBAL_FOOTER_SET_NEWS_LETTER_UPDATING':
      return setNewsLetterSignUpUpdating(footer, action.isNewsLetterSignUpUpdating);
    case 'GLOBAL_FOOTER_SET_NAVIGATION_TREE':
      return setFooterNavigationTree(footer, action.navigationTree);
    default:
      return footer;
  }
};

export {footerReducer};

/*
let studDefaultFooterStore = Immutable({
  isCountrySelectorVisible: false,
  isTrackOrderVisible: false,
  isNewsLetterSignUpUpdating: false,
  isNewsLetterSignUpConfirming: false,
  navigationTree: [
    {
      activeNavigation: true,
      titleList: 'My Place Rewards',
      image: 'images/my-place-rewards.png',
      links: [
        {
          id: 'create-account',
          title: 'Create Account',
          href: 'create-account'
        }, {
          title: 'Member Benefits',
          href: 'member-benefits'
        }, {
          title: 'Check Points Balance',
          href: 'check-points-balance'
        }, {
          title: 'Redeem Rewards',
          href: 'redeem-rewards'
        }
      ]
    }, {
      activeNavigation: false,
      titleList: 'My Place Rewards Credit Card',
      image: 'images/place.png',
      links: [
        {
          title: 'Pay Your Bill',
          href: 'pay-your-bill'
        }, {
          title: 'Manage Your Account',
          href: 'manage-your-account'
        }, {
          title: 'Apply Now',
          href: 'apply-now'
        }
      ]
    }, {
      activeNavigation: true,
      titleList: 'Help Center',
      links: [
        {
          title: 'FAQs',
          href: 'faqs'
        }, {
          title: 'Return Policy',
          href: 'return-policy'
        }, {
          title: 'Track Order',
          href: 'track-order',
          id: 'track-order'
        }, {
          title: 'Reservations',
          href: 'reservations'
        }, {
          title: 'Gift Card Balance',
          href: 'gift-card-balance'
        }, {
          title: 'Shipping',
          href: 'shipping'
        }
      ]
    }, {
      activeNavigation: false,
      titleList: 'Shopping',
      links: [
        {
          title: 'Coupons',
          href: 'coupons'
        }, {
          title: 'Store Locator',
          href: 'store-locator'
        }, {
          title: 'Size Chart',
          href: 'size-chart'
        }, {
          title: 'Gift Cards',
          href: 'gift-cards'
        }, {
          title: 'Gifting Options',
          href: 'gifting-options'
        }, {
          title: 'Wishlist',
          href: 'wishlist'
        }, {
          title: 'Seasonal Look Books',
          href: 'seasonal-look-books'
        }
      ]
    }, {
      activeNavigation: false,
      titleList: 'About Us',
      links: [
        {
          title: 'Investor Relations',
          href: 'investor-relations'
        }, {
          title: 'Careers',
          href: 'careers'
        }, {
          title: 'Social Responsability',
          href: 'social-responsability'
        }, {
          title: 'International Opportunities',
          href: 'international-opportunities'
        }, {
          title: 'Become an Affiliate',
          href: 'become-an-affiliate'
        }, {
          title: 'Recall Information',
          href: 'recall-information'
        }, {
          title: 'The Moms Space',
          href: 'the-moms-space'
        }
      ]
    }
  ]
});
*/
