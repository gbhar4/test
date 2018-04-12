/** @module storeMethods
 * @summary exposes an object with methods for generating the server-side redux store for various pages.
 *
 * @author Ben
 * @author Agu
 */
import {reducer as formReducer} from 'redux-form';
import {batchActionsMiddleware, enableReducersActionsBatching} from 'reduxStore/util/multipleActionsDispatch';
import {globalComponentsReducer} from 'reduxStore/storeReducersAndActions/globalComponents/globalComponents';
import {userReducer} from 'reduxStore/storeReducersAndActions/user/user';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import {sessionReducer, getSetCurrentCountryActn, getSetCurrentSiteActn,
 getSetCurrentLanguageActn, getSetCurrentCurrencyActn} from 'reduxStore/storeReducersAndActions/session/session';
import {cartReducer} from 'reduxStore/storeReducersAndActions/cart/cart';
import {generalReducer, getSetServerErrorCodeActn, CONTENT_PAGE_CUSTOM_ESPOT_NAME} from 'reduxStore/storeReducersAndActions/general/general';
import {mutableReducer, getSetHistoryActn} from 'reduxStore/storeReducersAndActions/mutable/mutable';
import {checkoutReducer} from 'reduxStore/storeReducersAndActions/checkout/checkout.js';
import {abTestReducer} from 'reduxStore/storeReducersAndActions/abTests/abTests';
import {couponsAndPromosReducer} from 'reduxStore/storeReducersAndActions/couponsAndPromos/couponsAndPromos';
import {addressesReducer} from 'reduxStore/storeReducersAndActions/addresses/addresses.js';
import {paymentCardsReducer} from 'reduxStore/storeReducersAndActions/paymentCards/paymentCards.js';
import {recommendationsReducer} from 'reduxStore/storeReducersAndActions/recommendations/recommendations';
import {storesReducer} from 'reduxStore/storeReducersAndActions/stores/stores.js';
import {productDetailsReducer} from 'reduxStore/storeReducersAndActions/productDetails/productDetails.js';
import {productListingReducer} from 'reduxStore/storeReducersAndActions/productListing/productListing.js';
import {quickViewReducer} from 'reduxStore/storeReducersAndActions/quickView/quickView.js';
import {favoritesReducer} from 'reduxStore/storeReducersAndActions/favorites/favorites.js';

import {routingConstants} from 'routing/routingConstants.js';
import {getApiHelper} from 'service/WebAPIServiceAbstractors/apiHelper.js';
import {createStaticHistory} from 'routing/staticHistory';

import {getRoutingOperator} from 'reduxStore/storeOperators/routingOperator';
import {getOrdersOperator} from 'reduxStore/storeOperators/ordersOperator.js';
import {getGeneralOperator} from 'reduxStore/storeOperators/generalOperator';
import {getStoresOperator} from 'reduxStore/storeOperators/storesOperator.js';
// import {getFavoritesOperator} from 'reduxStore/storeOperators/favoritesOperator.js';
import {getProductsOperator} from 'reduxStore/storeOperators/productsOperator.js';
import {productListingStoreView} from 'reduxStore/storeViews/productListingStoreView.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {getStoreIdFromUrlPathPart} from 'reduxStore/storeViews/storesStoreView';
import {matchPath} from 'react-router';
import {PAGES} from 'routing/routes/pages';
import {productDetailsStoreView} from 'reduxStore/storeViews/productDetailsStoreView.js';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView';

import {ServerError, get404Info} from '../util/ServerError';
import {ENV_VARS} from 'server/config/envVariables';
import {RES_LOCALS_FIELD_NAMES} from './requestHandler';
import {getSetOriginSettingsAtcn} from 'reduxStore/storeReducersAndActions/session/siteDetails/actionCreators';

export const GET_STORE_METHODS = {
  getStandardStore,
  getStandardLoadingStore,
  guestOrderDetailsGetStore,
  storeDetailsGetStore,
  productDetailsGetStore,
  productListingGetStore,
  searchGetStore,
  contentGetStore,
  outfitDetailsGetStore,
  notFoundPageGetStore,
  siteMapGetStore: espotsGetStore.bind(null, require('service/resources/espots/espotsVersionsTableSiteMap.json')),
  getHomepageStore: espotsGetStore.bind(null, require('service/resources/espots/espotsVersionsTableHomePage.json')),
  getHelpCenterStore: espotsGetStore.bind(null, require('service/resources/espots/espotsVersionsTableHelpCenter.json'))
};

// TODO: remove non-common reducers, and add when needed in the corresponding pages methods below
const COMMON_REDUCERS = {
  // ... your other reducers here ...
  mutable: mutableReducer,
  form: formReducer,
  globalComponents: globalComponentsReducer,
  user: userReducer,
  session: sessionReducer,
  cart: cartReducer,
  general: generalReducer,
  couponsAndPromos: couponsAndPromosReducer,
  addresses: addressesReducer,
  checkout: checkoutReducer,
  paymentCards: paymentCardsReducer,
  stores: storesReducer,
  favorites: favoritesReducer,
  productDetails: productDetailsReducer,
  productListing: productListingReducer,
  recommendations: recommendationsReducer,
  quickView: quickViewReducer,
  abTests: abTestReducer
};

function getStandardStore (req, res, next) {
  return getBasicStoreAndPendingPromises(req, res)
  .then(({pendingPromises}) => Promise.all(pendingPromises).then(() => next())).catch((err) => next(err));
}

function notFoundPageGetStore (req, res, next) {
  let page404Info = get404Info(req.originalUrl);

  let espotObject = {
    [CONTENT_PAGE_CUSTOM_ESPOT_NAME]: {
      nameOnServer: page404Info.espotName,
      guest: '1',
      registered: '1'
    }
  };

  return espotsGetStore(espotObject, req, res, next);
}

// cart, checkout, my account need to be kept in 'loading'
// until the client retrieves all session related information,
// which is not yet available on the server
// otherwise there's a blink in the client, which is not pretty
function getStandardLoadingStore (req, res, next) {
  return getBasicStoreAndPendingPromises(req, res)
  .then(({store, pendingPromises}) => {
    let generalOperator = getGeneralOperator(store);
    generalOperator.setIsLoading(true);

    return Promise.all(pendingPromises).then(() => next());
  }).catch((err) => next(err));
}

function guestOrderDetailsGetStore (req, res, next) {
  return getBasicStoreAndPendingPromises(req, res)
  .then(({store, pendingPromises}) => {
    return Promise.all([
      ...pendingPromises,
      getOrdersOperator(store).getSubmittedOrderDetails(req.params.orderId, req.params.emailAddress)
    ]).then(() => next());
  }).catch((err) => next(err));
}

function storeDetailsGetStore (req, res, next) {
  return getBasicStoreAndPendingPromises(req, res)
  .then(({store, pendingPromises}) => {
    return Promise.all([
      ...pendingPromises,
      getStoresOperator(store).loadStorePlusNearbyStores(getStoreIdFromUrlPathPart(req.params.storeStr))
    ]).then(() => next());
  }).catch((err) => next(err));
}

function productDetailsGetStore (req, res, next) {
  return getBasicStoreAndPendingPromises(req, res)
  .then(({store, pendingPromises}) => {
    return Promise.all([
      ...pendingPromises,
      getProductsOperator(store).loadProduct(req.params.productKey)
    ]).then(() => {
      let storeState = store.getState();
      let breadcrumbs = productDetailsStoreView.getCurrentProductBreadcrumbs(storeState);

      if (breadcrumbs.length > 1) {
        let referer = req.headers.referer;
        let domain = routingInfoStoreView.getApiHelper(storeState).configOptions.assetHost;
        if (referer && referer.length >= domain.length && referer.substr(0, domain.length) === domain) {
          let pathname = referer.substr(domain.length);
          let match =
            matchPath(pathname, {path: PAGES.productListing.pathPattern}) ||
            matchPath(pathname, {path: PAGES.search.pathPattern}) ||
            pathname === req.originalUrl;
          if (!match) getProductsOperator(store).setHomepageAsBreadcrumb();
        } else {
          getProductsOperator(store).setHomepageAsBreadcrumb();
        }
      }
      next();
    });
  }).catch((err) => next(err));
}

function productListingGetStore (req, res, next) {
  let urlParts = req.url.split('?');
  return getBasicStoreAndPendingPromises(req, res)
  .then(({store, pendingPromises}) => {
    return Promise.all([
      ...pendingPromises,
      getProductsOperator(store).getProductsListingForUrlLocation({
        pathname: req.path,
        search: urlParts.length > 1 ? '?' + urlParts[1] : ''
      }).then(() => {
        // loading espots is inside "then" because espot name depends on category name
        let espotsTable = {};
        productListingStoreView.getEspotByCategory(store.getState()).map((espot) => {
          espotsTable[espot.contentSlotName] = {'nameOnServer': espot.contentSlotName, 'guest': '1', 'registered': '1'};
        });
        return getGeneralOperator(store).loadEspots(espotsTable);
      })
    ]).then(() => next());
  }).catch((err) => next(err));
}

function searchGetStore (req, res, next) {
  let urlParts = req.url.split('?');

  return getBasicStoreAndPendingPromises(req, res)
  .then(({store, pendingPromises}) => {
    return Promise.all([
      ...pendingPromises,
      getProductsOperator(store).getProductsListingForUrlLocation({
        pathname: req.path,
        search: urlParts.length > 1 ? '?' + urlParts[1] : ''
      })
      .then((r) => {
        // If there is only one item in the search results push user to its PDP page else load espot for this search page
        if (productListingStoreView.getTotalProductsCount(store.getState()) === 1 &&
          !productListingStoreView.getListingType(store.getState()) && !urlParts[1]) {
          res.redirect(302, r.loadedProducts[0].productInfo.pdpUrl);
          res.end();
        } else {
          let searchEspots = require('service/resources/espots/espotsVersionsTableSearchPage.json');

          // DT-31934: search term needs to be concated with category/sub category
          let searchEspotKey = productListingStoreView.getSearchEspotKey(store.getState());

          return getGeneralOperator(store).loadSearchEspots(searchEspots, searchEspotKey);
        }
      })
    ]).then(() => next());
  }).catch((err) => next(err));
}

function espotsGetStore (espotsTable, req, res, next) {
  return getBasicStoreAndPendingPromises(req, res)
  .then(({store, pendingPromises}) => {
    return Promise.all([
      ...pendingPromises,
      getGeneralOperator(store).loadEspots(espotsTable)
    ]).then(() => next());
  }).catch((err) => next(err));
}

function outfitDetailsGetStore (req, res, next) {
  return getBasicStoreAndPendingPromises(req, res)
  .then(({store, pendingPromises}) => {
    return Promise.all([
      ...pendingPromises,
      getProductsOperator(store).loadOutfitDetails(req.params.outfitId, req.params.vendorColorProductIdsList)
    ]).then(() => next());
  }).catch((err) => next(err));
}

function contentGetStore (req, res, next) {
  let espotsTable = {[CONTENT_PAGE_CUSTOM_ESPOT_NAME]: {'nameOnServer': req.params.contentSlotName, 'guest': '1', 'registered': '1'}};

  // We can't use espotsGetStore in this case because backend does not send 404
  // when the espot does not exist, so we need to identify ourselves
  return getBasicStoreAndPendingPromises(req, res)
  .then(({store, pendingPromises}) => {
    return Promise.all([
      ...pendingPromises,
      getGeneralOperator(store).loadEspotAndExtraInfo(espotsTable)
    ]).then(() => {
      let espot = generalStoreView.getEspotByName(store.getState(), CONTENT_PAGE_CUSTOM_ESPOT_NAME);

      if (espot && espot.value) {
        next();
      } else {
        throw new ServerError(`Unable to find content for: ${req.url}`, 404);
      }
    });
  }).catch((err) => next(err));
}

function getBasicStoreAndPendingPromises (req, res, reducer = combineReducers(COMMON_REDUCERS)) {
  let {
    [RES_LOCALS_FIELD_NAMES.siteId]: siteId,
    [RES_LOCALS_FIELD_NAMES.currency]: currency,
    [RES_LOCALS_FIELD_NAMES.language]: language,
    [RES_LOCALS_FIELD_NAMES.isMobile]: isMobile,
    [RES_LOCALS_FIELD_NAMES.pageId]: pageId
  } = res.locals;

  let store = createStore(
    enableReducersActionsBatching(reducer),
    undefined,
    compose(applyMiddleware(batchActionsMiddleware), (f) => f)
  );
  res.locals[RES_LOCALS_FIELD_NAMES.store] = store;

  if (siteId !== routingConstants.siteIds.us && siteId !== routingConstants.siteIds.ca) {
    return Promise.reject(new ServerError(`Incorrect siteId found in url: '${siteId}'`, 404));
  }
  let apiHelper = getApiHelper(siteId, req.hostname || 'www.childrensplace.com', req.get('cookie'), isMobile);

  try {
    store.dispatch(getSetHistoryActn(createStaticHistory(req.url)));
  } catch (e) {
    return Promise.reject(new ServerError(`unable to parse url: ${req.url}`, 404));
  }

  let routingOperator = getRoutingOperator(store);
  routingOperator.setApiHelper(apiHelper);
  routingOperator.setIsMobileSite(isMobile);
  if (pageId) routingOperator.setCurrentPageId(pageId);     // notFoundPage has no pageId

  // clean up error code (XXS)
  let errorParameter = req.query.error && req.query.error.replace(/[^a-zA-Z0-9_]/gi, '');

  store.dispatch([
    getSetCurrentSiteActn(siteId),
    getSetOriginSettingsAtcn(ENV_VARS),
    // here (i.e., on the server) we do not load the user info, and thus base the default country on the siteId
    getSetCurrentCountryActn(siteId === routingConstants.siteIds.ca ? 'CA' : 'US'),
    currency && getSetCurrentCurrencyActn(currency),
    language && getSetCurrentLanguageActn(language),
    errorParameter && getSetServerErrorCodeActn(errorParameter)
  ]);

  let generalOperator = getGeneralOperator(store);
  generalOperator.setIsLoading(false);
  return Promise.resolve({
    store: store,
    pendingPromises: [
      generalOperator.setCountryAndCurrenciesMap(),
      generalOperator.loadFooterNavigation(true, false),
      generalOperator.loadHeaderNavigationTree(store),
      generalOperator.loadKillSwitches()
    ]
  });
}
