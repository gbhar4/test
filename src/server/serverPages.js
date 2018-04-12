/** @module pages
 * @summary Server-side routing and handling info.
 *
 * Explanation of fields of each page:
 *  routingInfo:          an objecx describing the routing of this page (this is an entry of PAGES in pages.js)
 *  sections:             an object that describes the different sections of that page.
 *  getStoreMethod:       a method to generate the server-side redux-store. This is a standard express middleware.
 *                          Accepts: req, res, next
 *                          Side Effect: sets the redux-store into a field inside res.locals (see requestHandler.js for field name).
 *  renderMethod:         a method to render the react content for the package.
 *                          Accepts: store, pageId
 *                          Returns: the rendered React root element for the page
 *  getVariablesMethod    a method returning the template variables used by getHtmlMethod
 *                          Accepts: store, req, pageId
 *                          Returns: a promise that resolves with a simple object of key-value pairs, each being a template variable and its value.
 *  getHtmlMethod:        a method to generate the html markup for the page
 *                          Accepts: variables, pageId.
 *                          Note that the template variables are whatever is returned by getVariablesMethod, plus the following three vairables:
 *                            state, isMobile, reactHtmlString
 *                          Returns: the HTML markup of the page
 * @author Ben
 */
import {PAGES} from 'routing/routes/pages';

import {CHECKOUT_SECTIONS} from 'routing/routes/checkoutRoutes';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes';
import {PLCC_SECTIONS} from 'routing/routes/plccRoutes';
import {HELP_CENTER_SECTIONS} from 'routing/routes/helpCenterRoutes';
import {HOME_PAGE_SECTIONS} from 'routing/routes/homePageRoutes';

import {GET_STORE_METHODS} from './handlers/storeMethods';
import {RENDER_METHODS} from './handlers/renderMethods';
import {VARIABLES_METHODS} from './handlers/variablesMethods';
import {HTML_METHODS} from './handlers/htmlMethods';

export const FANCY_404_PAGE_ID = 'notFoundPage';
export const LEGACY_HEADER_PAGE_ID = 'legacyHeaderPage';
export const LEGACY_FOOTER_PAGE_ID = 'legacyFooterPage';

export const SERVER_PAGES = {
  [FANCY_404_PAGE_ID]: {
    routingInfo: null,
    getStoreMethod: GET_STORE_METHODS.notFoundPageGetStore,
    renderMethod: RENDER_METHODS.notFoundPageRenderMethod,
    getVariablesMethod: VARIABLES_METHODS.getNotFoundPageVariables,
    getHtmlMethod: HTML_METHODS.getBasicPageHtml
  },
  [PAGES.cart.id]: {
    routingInfo: PAGES.cart,
    getStoreMethod: GET_STORE_METHODS.getStandardLoadingStore,
    renderMethod: RENDER_METHODS.cartRenderMethod,
    getVariablesMethod: VARIABLES_METHODS.getDefaultVariables,
    getHtmlMethod: HTML_METHODS.getBasicPageHtml
  },
  [PAGES.checkout.id]: {
    routingInfo: PAGES.checkout,
    sections: CHECKOUT_SECTIONS,
    getStoreMethod: GET_STORE_METHODS.getStandardLoadingStore,
    renderMethod: RENDER_METHODS.checkoutRenderMethod,
    getVariablesMethod: VARIABLES_METHODS.getDefaultVariables,
    getHtmlMethod: HTML_METHODS.getBasicPageHtml
  },
  [PAGES.intlCheckout.id]: {
    routingInfo: PAGES.intlCheckout,
    getStoreMethod: GET_STORE_METHODS.getStandardLoadingStore,
    renderMethod: RENDER_METHODS.intlCheckoutRenderMethod,
    getVariablesMethod: VARIABLES_METHODS.getDefaultVariables,
    getHtmlMethod: HTML_METHODS.getBasicPageHtml
  },
  [PAGES.myAccount.id]: {
    routingInfo: PAGES.myAccount,
    sections: MY_ACCOUNT_SECTIONS,
    getStoreMethod: GET_STORE_METHODS.getStandardLoadingStore,
    renderMethod: RENDER_METHODS.myAccountRenderMethod,
    getVariablesMethod: VARIABLES_METHODS.getDefaultVariables,
    getHtmlMethod: HTML_METHODS.getBasicPageHtml
  },
  [PAGES.guestOrderDetails.id]: {
    routingInfo: PAGES.guestOrderDetails,
    getStoreMethod: GET_STORE_METHODS.guestOrderDetailsGetStore,
    renderMethod: RENDER_METHODS.guestOrderDetailsRenderMethod,
    getVariablesMethod: VARIABLES_METHODS.getDefaultVariables,
    getHtmlMethod: HTML_METHODS.getBasicPageHtml
  },
  [PAGES.guestReservationDetails.id]: {
    routingInfo: PAGES.guestReservationDetails,
    getStoreMethod: GET_STORE_METHODS.getStandardStore,
    renderMethod: RENDER_METHODS.guestReservationDetailsRenderMethod,
    getVariablesMethod: VARIABLES_METHODS.getDefaultVariables,
    getHtmlMethod: HTML_METHODS.getBasicPageHtml
  },
  [PAGES.webInstantCredit.id]: {
    routingInfo: PAGES.webInstantCredit,
    sections: PLCC_SECTIONS,
    getStoreMethod: GET_STORE_METHODS.getStandardStore,
    renderMethod: RENDER_METHODS.webInstantCreditRenderMethod,
    getVariablesMethod: VARIABLES_METHODS.getDefaultVariables,
    getHtmlMethod: HTML_METHODS.getBasicPageHtml
  },
  [PAGES.storeDetails.id]: {
    routingInfo: PAGES.storeDetails,
    getStoreMethod: GET_STORE_METHODS.storeDetailsGetStore,
    renderMethod: RENDER_METHODS.storeDetailsRenderMethod,
    getVariablesMethod: VARIABLES_METHODS.getStoreDetailsVariables,
    getHtmlMethod: HTML_METHODS.getBasicPageHtml
  },
  [PAGES.storeLocator.id]: {
    routingInfo: PAGES.storeLocator,
    getStoreMethod: GET_STORE_METHODS.getStandardStore,
    renderMethod: RENDER_METHODS.storeLocatorRenderMethod,
    getVariablesMethod: VARIABLES_METHODS.getDefaultVariables,
    getHtmlMethod: HTML_METHODS.getBasicPageHtml
  },
  [PAGES.favorites.id]: {
    routingInfo: PAGES.favorites,
    getStoreMethod: GET_STORE_METHODS.getStandardStore,
    renderMethod: RENDER_METHODS.favoritesRenderMethod,
    getVariablesMethod: VARIABLES_METHODS.getDefaultVariables,
    getHtmlMethod: HTML_METHODS.getBasicPageHtml
  },
  [PAGES.helpCenter.id]: {
    routingInfo: PAGES.helpCenter,
    sections: HELP_CENTER_SECTIONS,
    getStoreMethod: GET_STORE_METHODS.getHelpCenterStore,
    renderMethod: RENDER_METHODS.helpCenterRenderMethod,
    getVariablesMethod: VARIABLES_METHODS.getDefaultVariables,
    getHtmlMethod: HTML_METHODS.getBasicPageHtml
  },
  [PAGES.usAndCaStores.id]: {
    routingInfo: PAGES.usAndCaStores,
    getStoreMethod: GET_STORE_METHODS.getStandardStore,
    renderMethod: RENDER_METHODS.usAndCaStoresRenderMethod,
    getVariablesMethod: VARIABLES_METHODS.getDefaultVariables,
    getHtmlMethod: HTML_METHODS.getBasicPageHtml
  },
  [PAGES.homePage.id]: {
    routingInfo: PAGES.homePage,
    sections: HOME_PAGE_SECTIONS,
    getStoreMethod: GET_STORE_METHODS.getHomepageStore,
    renderMethod: RENDER_METHODS.homePageRenderMethod,
    getVariablesMethod: VARIABLES_METHODS.getHomepageVariables,
    getHtmlMethod: HTML_METHODS.getBasicPageHtml
  },
  [PAGES.changePassword.id]: {
    routingInfo: PAGES.changePassword,
    getStoreMethod: GET_STORE_METHODS.getStandardStore,
    renderMethod: RENDER_METHODS.homePageRenderMethod,
    getVariablesMethod: VARIABLES_METHODS.getHomepageVariables,
    getHtmlMethod: HTML_METHODS.getBasicPageHtml
  },
  [PAGES.productDetails.id]: {
    routingInfo: PAGES.productDetails,
    getStoreMethod: GET_STORE_METHODS.productDetailsGetStore,
    renderMethod: RENDER_METHODS.productDetailsRenderMethod,
    getVariablesMethod: VARIABLES_METHODS.getProductDetailsVariables,
    getHtmlMethod: HTML_METHODS.getBasicPageHtml
  },
  [PAGES.productListing.id]: {
    routingInfo: PAGES.productListing,
    getStoreMethod: GET_STORE_METHODS.productListingGetStore,
    renderMethod: RENDER_METHODS.productListingRenderMethod,
    getVariablesMethod: VARIABLES_METHODS.getProductListingVariables,
    getHtmlMethod: HTML_METHODS.getBasicPageHtml
  },
  [PAGES.search.id]: {
    routingInfo: PAGES.search,
    getStoreMethod: GET_STORE_METHODS.searchGetStore,
    renderMethod: RENDER_METHODS.searchRenderMethod,
    getVariablesMethod: VARIABLES_METHODS.getDefaultVariables,
    getHtmlMethod: HTML_METHODS.getBasicPageHtml
  },
  [PAGES.content.id]: {
    routingInfo: PAGES.content,
    getStoreMethod: GET_STORE_METHODS.contentGetStore,
    renderMethod: RENDER_METHODS.contentRenderMethod,
    getVariablesMethod: VARIABLES_METHODS.getContentVariables,
    getHtmlMethod: HTML_METHODS.getBasicPageHtml
  },
  [PAGES.outfitDetails.id]: {
    routingInfo: PAGES.outfitDetails,
    getStoreMethod: GET_STORE_METHODS.outfitDetailsGetStore,
    renderMethod: RENDER_METHODS.outfitDetailsRenderMethod,
    getVariablesMethod: VARIABLES_METHODS.getDefaultVariables,
    getHtmlMethod: HTML_METHODS.getBasicPageHtml
  },
  [PAGES.siteMap.id]: {
    routingInfo: PAGES.siteMap,
    getStoreMethod: GET_STORE_METHODS.siteMapGetStore,
    renderMethod: RENDER_METHODS.siteMapRenderMethod,
    getVariablesMethod: VARIABLES_METHODS.getDefaultVariables,
    getHtmlMethod: HTML_METHODS.getBasicPageHtml
  },

  // FOR LEGACY SUPPORT
  [LEGACY_HEADER_PAGE_ID]: {
    routingInfo: null,
    getStoreMethod: GET_STORE_METHODS.getStandardStore,
    renderMethod: RENDER_METHODS.legacyHeaderRenderMethod,
    getVariablesMethod: VARIABLES_METHODS.getNoVariables,
    getHtmlMethod: HTML_METHODS.getLegacyHeaderPageHtml
  },
  [LEGACY_FOOTER_PAGE_ID]: {
    routingInfo: null,
    getStoreMethod: GET_STORE_METHODS.getStandardStore,
    renderMethod: RENDER_METHODS.legacyFooterRenderMethod,
    getVariablesMethod: VARIABLES_METHODS.getNoVariables,
    getHtmlMethod: HTML_METHODS.getLegacyFooterPageHtml
  }
};
