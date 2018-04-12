/** @module helpCenterRoutes
 * @summary HELP_CENTER_SECTIONS holds all the routes we are routing within the --- Pages
 */
import {PAGES} from './pages';

export const HELP_CENTER_PAGE = PAGES.helpCenter;

export const HELP_CENTER_SECTIONS = {
  contactUs: {
    id: 'contactUs',
    page: HELP_CENTER_PAGE,
    displayName: 'Contact Us',
    pathPart: 'contact-us',
    pathPattern: '/:siteId/help-center/contact-us'
  }
};
