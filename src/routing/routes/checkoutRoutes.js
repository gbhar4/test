/** @module checkoutRoutes
 * @summary Client-side routing info for checkout sections
 *
 * @author Ben
 */
import {CHECKOUT_STAGES} from 'reduxStore/storeReducersAndActions/checkout/checkout';
import {PAGES} from './pages';

export const CHECKOUT_PAGE = PAGES.checkout;

export const CHECKOUT_SECTIONS = {
  [CHECKOUT_STAGES.PICKUP]: {
    id: CHECKOUT_STAGES.PICKUP,
    page: CHECKOUT_PAGE,
    displayName: 'Pickup',
    pathPart: 'pickup',
    pathPattern: '/:siteId/checkout/pickup'
  },
  [CHECKOUT_STAGES.SHIPPING]: {
    id: CHECKOUT_STAGES.SHIPPING,
    page: CHECKOUT_PAGE,
    displayName: 'Shipping',
    pathPart: 'shipping',
    pathPattern: '/:siteId/checkout/shipping'
  },
  [CHECKOUT_STAGES.BILLING]: {
    id: CHECKOUT_STAGES.BILLING,
    page: CHECKOUT_PAGE,
    displayName: 'Billing',
    pathPart: 'billing',
    pathPattern: '/:siteId/checkout/billing'
  },
  [CHECKOUT_STAGES.REVIEW]: {
    id: CHECKOUT_STAGES.REVIEW,
    page: CHECKOUT_PAGE,
    displayName: 'Review',
    pathPart: 'review',
    pathPattern: '/:siteId/checkout/review'
  },
  [CHECKOUT_STAGES.CONFIRMATION]: {
    id: CHECKOUT_STAGES.CONFIRMATION,
    page: CHECKOUT_PAGE,
    displayName: '',
    pathPart: 'confirmation',
    pathPattern: '/:siteId/checkout/confirmation'
  }
};
