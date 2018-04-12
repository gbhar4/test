/** @module pages
 * @summary Client-side routing info for non-legacy pages.
 *
 * Explanation of fields of each page:
 *  id:                   Note: GENERATED AUTOMATICALLY!
 *                         A unique name for the page. MUST be equal to the key used for that object (i.e., key === PAGES[key].id)
 *                         Used for the value of currentPage in the redux-store routing branch.
 *  locallyServeNested:   A Boolean indicating if routes that match this page are all served on the client (if true);
 *                          or that we need to go to the server for every change in the url (if false).
 *  pathPart:             The portion of the url path of this page that immediately follows the site prefix (i.e., after '/us/', etc.)
 *  pathPattern:          An express-like path pattern to be used to match this page (usually passed as the <code>path</code> prop to a
 *                          react-router <code>Route</code> component.
 * rootPathPattern:      For a page with sub-sections only, e.g., my-account this is used to identify the root of this page, but none
 *                          of it's sub-sections. This is done by matching the rootPathPattern to the url with exact matching (i.e.,
 *                          not simply matching the pattern to a prefix of the url, but to the whole url).
 * locationCreateMethodKey: a key into locationCreateMethods, whose associated value is a method to use in order to create a location object
 *                          (see History.location in the history package) for routes within this page. This method expects the following parameters:
 *                          reduxStoreState, base, pagePathPart, sectionPathPart, extraInfo, where extraInfo has the following
 *                          fields: {queryValues, hash, state}. see the file locationCreateMethods for more details.
 *                          Note that we store the entry to the method in the locationCreateMethods table instead of the method itself since
 *                          we need to serialize/deserialize the PAGES table.
 *
 * @author Ben
 */

 // the value of currentPage when on a legacy page
export const LEGACY_PAGE_ID = 'legacy';

// Note: an 'id' attribute, with a value equal to the key of each entry, is generated automatically
// for each entry in PAGES (see code below PAGES declaration)
export const PAGES = {
  cart: {
    // id
    pathPart: 'bag',
    pathPattern: '/:siteId/bag',
    locationCreateMethodKey: 'defaultMethod'
  },
  checkout: {
    // id
    locallyServeNested: true,
    pathPart: 'checkout',
    pathPattern: '/:siteId/checkout/:stage?',
    rootPathPattern: '/:siteId/checkout',
    locationCreateMethodKey: 'checkoutLocationCreator'
  },
  intlCheckout: {
    // id
    pathPart: 'international-checkout',
    pathPattern: '/:siteId/international-checkout',
    locationCreateMethodKey: 'checkoutLocationCreator'
  },
  myAccount: {
    // id
    locallyServeNested: true,
    pathPart: 'account',
    pathPattern: '/:siteId/account/:section?',
    rootPathPattern: '/:siteId/account',
    locationCreateMethodKey: 'defaultMethod'
  },
  guestOrderDetails: {
    // id
    pathPart: 'track-order',
    pathPattern: '/:siteId/track-order/:orderId/:emailAddress',
    locationCreateMethodKey: 'defaultMethod'
  },
  guestReservationDetails: {
    // id
    pathPart: 'track-reservation',
    pathPattern: '/:siteId/track-reservation/:reservationId/:emailAddress',
    locationCreateMethodKey: 'defaultMethod'
  },
  webInstantCredit: {
    // id
    locallyServeNested: true,
    pathPart: 'place-card',
    pathPattern: '/:siteId/place-card/:section?',
    rootPathPattern: '/:siteId/place-card',
    locationCreateMethodKey: 'defaultMethod'
  },
  storeDetails: {
    // id
    pathPart: 'store',
    pathPattern: '/:siteId/store/:storeStr',  // storeStr should end with dash and then the storeId
    locationCreateMethodKey: 'defaultMethod'
  },
  storeLocator: {
    // id
    pathPart: 'store-locator',
    pathPattern: '/:siteId/store-locator',
    locationCreateMethodKey: 'defaultMethod'
  },
  favorites: {
    // id
    pathPart: 'favorites',
    pathPattern: '/:siteId/favorites',
    locationCreateMethodKey: 'defaultMethod'
  },
  helpCenter: {
    // id
    locallyServeNested: true,
    pathPart: 'help-center',
    pathPattern: '/:siteId/help-center/:section?',
    rootPathPattern: '/:siteId/help-center',
    locationCreateMethodKey: 'defaultMethod'
  },
  usAndCaStores: {
    // id
    pathPart: 'stores',
    pathPattern: '/:siteId/stores',
    locationCreateMethodKey: 'defaultMethod'
  },
  homePage: {
    // id
    locallyServeNested: true,
    pathPart: 'home',
    pathPattern: '/:siteId/home',
    rootPathPattern: '/:siteId/home',
    locationCreateMethodKey: 'defaultMethod'
  },
  changePassword: {
    // id
    pathPart: 'change-password',
    pathPattern: '/:siteId/change-password',
    locationCreateMethodKey: 'defaultMethod'
  },
  productDetails: {
    // id
    pathPart: 'p',
    pathPattern: '/:siteId/p/:productKey',
    locationCreateMethodKey: 'defaultMethod'
  },
  productListing: {
    // id
    pathPart: 'c',
    pathPattern: '/:siteId/c/:listingKey/:pageNumber?',
    locationCreateMethodKey: 'defaultMethod'
  },
  search: {
    // id
    pathPart: 'search',
    pathPattern: '/:siteId/search/:searchTerm',
    locationCreateMethodKey: 'defaultMethod'
  },
  content: {
    // id
    pathPart: 'content',
    pathPattern: '/:siteId/content/:contentSlotName',
    locationCreateMethodKey: 'defaultMethod'
  },
  // http://www.childrensplace.com/{CountryID}/c/{TopCategoryName}/{SubCategoryName}/{OutfitName}
  outfitDetails: {
    // id
    pathPart: 'outfit',
    pathPattern: '/:siteId/outfit/:outfitId/:vendorColorProductIdsList',
    locationCreateMethodKey: 'defaultMethod'
  },
  siteMap: {
    // id
    pathPart: 'sitemap',
    pathPattern: '/:siteId/sitemap/',
    locationCreateMethodKey: 'defaultMethod'
  },
  notFound: {
    // id
    pathPart: 'not-found',
    pathPattern: '/:siteId/not-found',
    locationCreateMethodKey: 'defaultMethod'
  }
};
// add id attribute to all entries in PAGES.
for (let key of Object.keys(PAGES)) {
  PAGES[key].id = key;
}

export function getPageByPathPart (pathPart) {
  let requestedPageKey = Object.keys(PAGES).find((key) => (PAGES[key].pathPart.endsWith('/') ? PAGES[key].pathPart.slice(0, -1) : PAGES[key].pathPart) === pathPart);
  return requestedPageKey && PAGES[requestedPageKey];
}

export function getPageById (id) {
  let requestedPageKey = Object.keys(PAGES).find((key) => (PAGES[key].id === id));
  return requestedPageKey && PAGES[requestedPageKey];
}
