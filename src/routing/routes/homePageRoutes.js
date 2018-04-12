/** @module homePageRoutes
 * @summary Client-side routing info for home page
 *
 * @author Ben
 */
import {DRAWER_IDS, LOGIN_FORM_TYPES} from 'reduxStore/storeReducersAndActions/globalComponents/globalComponents';
import {PAGES} from './pages';

export const HOME_PAGE = PAGES.homePage;

export const HOME_PAGE_SECTIONS = {
  [DRAWER_IDS.LOGIN]: {
    id: DRAWER_IDS.LOGIN,
    page: HOME_PAGE,
    displayName: 'Login',
    pathPart: 'login',
    pathPattern: '/:siteId/home/login'
  },

  [DRAWER_IDS.CREATE_ACCOUNT]: {
    id: DRAWER_IDS.CREATE_ACCOUNT,
    page: HOME_PAGE,
    displayName: 'Wishlist Login',
    pathPart: 'register',
    pathPattern: '/:siteId/home/register'
  },

  [DRAWER_IDS.WISHLIST_LOGIN]: {
    id: DRAWER_IDS.WISHLIST_LOGIN,
    page: HOME_PAGE,
    displayName: 'Register',
    pathPart: 'favorites',
    pathPattern: '/:siteId/home/favorites'
  },

  [LOGIN_FORM_TYPES.REQUEST_PASSWORD_RESET]: {
    id: LOGIN_FORM_TYPES.REQUEST_PASSWORD_RESET,
    page: HOME_PAGE,
    displayName: 'Forgot Password',
    pathPart: 'forgot-password',
    pathPattern: '/:siteId/home/forgot-password'
  },

  trackOrder: {
    id: 'track-order',
    page: HOME_PAGE,
    displayName: 'Track Order',
    pathPart: 'track-order',
    pathPattern: '/:siteId/home/track-order'
  },

  shipTo: {
    id: 'ship-to',
    page: HOME_PAGE,
    displayName: 'Ship To',
    pathPart: 'ship-to',
    pathPattern: '/:siteId/home/ship-to'
  }
};
