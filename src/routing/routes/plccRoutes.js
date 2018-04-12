/**
 * @module plccRoutes
 * @summary PLCC_SECTIONS holds all the routes we are routing within the PLCC/WIC Pages
 */
import {PAGES} from './pages';

export const PLCC_PAGE = PAGES.webInstantCredit;

export const PLCC_SECTIONS = {
  application: {
    id: 'plccApplyForm',
    page: PLCC_PAGE,
    displayName: 'Web Instant Credit',
    pathPart: 'application',
    pathPattern: '/:siteId/place-card/application'
  }
};
