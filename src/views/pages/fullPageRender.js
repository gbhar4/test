import React from 'react'; // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';
import {reducer as formReducer} from 'redux-form';
import {batchActionsMiddleware, enableReducersActionsBatching} from 'reduxStore/util/multipleActionsDispatch';
import {globalComponentsReducer} from 'reduxStore/storeReducersAndActions/globalComponents/globalComponents';
import {userReducer} from 'reduxStore/storeReducersAndActions/user/user';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';

import {Provider} from 'react-redux';
import {sessionReducer} from 'reduxStore/storeReducersAndActions/session/session';
import {cartReducer} from 'reduxStore/storeReducersAndActions/cart/cart';
import {generalReducer, CONTENT_PAGE_CUSTOM_ESPOT_NAME} from 'reduxStore/storeReducersAndActions/general/general';
import {mutableReducer} from 'reduxStore/storeReducersAndActions/mutable/mutable';
import {getGeneralOperator} from 'reduxStore/storeOperators/generalOperator';
import {getRoutingOperator} from 'reduxStore/storeOperators/routingOperator';
import {couponsAndPromosReducer} from 'reduxStore/storeReducersAndActions/couponsAndPromos/couponsAndPromos';
import {addressesReducer} from 'reduxStore/storeReducersAndActions/addresses/addresses.js';
import {checkoutReducer} from 'reduxStore/storeReducersAndActions/checkout/checkout.js';
import {abTestReducer} from 'reduxStore/storeReducersAndActions/abTests/abTests';
import {orderConfirmationReducer} from 'reduxStore/storeReducersAndActions/confirmation/confirmation.js';
import {paymentCardsReducer} from 'reduxStore/storeReducersAndActions/paymentCards/paymentCards.js';
import {storesReducer} from 'reduxStore/storeReducersAndActions/stores/stores.js';
import {favoritesReducer} from 'reduxStore/storeReducersAndActions/favorites/favorites.js';
import {productDetailsReducer} from 'reduxStore/storeReducersAndActions/productDetails/productDetails.js';
import {productListingReducer} from 'reduxStore/storeReducersAndActions/productListing/productListing.js';
import {quickViewReducer} from 'reduxStore/storeReducersAndActions/quickView/quickView.js';

import {recommendationsReducer} from 'reduxStore/storeReducersAndActions/recommendations/recommendations';
import {getCartOperator} from 'reduxStore/storeOperators/cartOperator';
import {getCheckoutOperator} from 'reduxStore/storeOperators/checkoutOperator.js';
import {getUserOperator} from 'reduxStore/storeOperators/userOperator';
import {getAddressesOperator} from 'reduxStore/storeOperators/addressesOperator';
import {getPaymentCardsOperator} from 'reduxStore/storeOperators/paymentCardsOperator';
import {getStoresOperator} from 'reduxStore/storeOperators/storesOperator';
import {getOrdersOperator} from 'reduxStore/storeOperators/ordersOperator';
// import {getReservationsOperator} from 'reduxStore/storeOperators/reservationsOperator';
import {getFavoritesOperator} from 'reduxStore/storeOperators/favoritesOperator';
import {RECOMMENDATIONS_SECTIONS, getProductsOperator} from 'reduxStore/storeOperators/productsOperator';

import {logErrorAndServerThrow} from 'reduxStore/storeOperators/operatorHelper';

import {getApiHelper} from 'service/WebAPIServiceAbstractors/apiHelper.js';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {getStoreStateFromImage} from 'reduxStore/util/getStoreStateFromImage';
import {createClientRouter} from 'views/components/common/routing/clientRouter';
import {PAGES} from 'routing/routes/pages';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';

import queryString from 'query-string';
import {DRAWER_IDS, getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';
import {LOGIN_FORM_TYPES} from 'reduxStore/storeReducersAndActions/globalComponents/header/reducer.js';
import {HOME_PAGE_SECTIONS} from 'routing/routes/homePageRoutes';
import {favoritesStoreView} from 'reduxStore/storeViews/favoritesStoreView.js';
import {matchPath} from 'react-router';
import {productDetailsStoreView} from 'reduxStore/storeViews/productDetailsStoreView';
import {productListingStoreView} from 'reduxStore/storeViews/productListingStoreView';
import {recommendationsStoreView} from 'reduxStore/storeViews/recommendationsStoreView.js';
import {observeStore} from 'reduxStore/util/observeStore';
import {routingStoreView} from 'reduxStore/storeViews/routing/routingStoreView';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {getStoreIdFromUrlPathPart} from 'reduxStore/storeViews/storesStoreView';
import {getPipe, passThrough} from 'util/pipe';

import {analyticsDataLayer} from 'util/analytics/analyticsDataLayer';
import {initializeABTestingHook} from 'util/ABTestRegistration.js';

/* global LOCAL_SERVE */

let reducers = {
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
  confirmation: orderConfirmationReducer,
  paymentCards: paymentCardsReducer,
  stores: storesReducer,
  favorites: favoritesReducer,
  productDetails: productDetailsReducer,
  productListing: productListingReducer,
  recommendations: recommendationsReducer,
  quickView: quickViewReducer,
  abTests: abTestReducer
};

const PRELOADED_STATE = window.__PRELOADED_STATE__ ? Object.assign({}, window.__PRELOADED_STATE__) : null;
window.__PRELOADED_STATE__ = null;

function initPipeline (payload) {
  return getPipe({
    store: null,
    pendingPromises: [],
    sessionPromise: null,
    ...payload
  });
}

const INIT_STORE_METHODS = {
  [PAGES.cart.id]: cartInitStore,
  [PAGES.checkout.id]: checkoutInitStore,
  [PAGES.intlCheckout.id]: intlCheckoutInitStore,
  [PAGES.myAccount.id]: myAccountInitStore,
  [PAGES.homePage.id]: homePageInitStore,
  [PAGES.content.id]: contentPageInitStore,
  [PAGES.changePassword.id]: changePasswordInitStore,
  [PAGES.favorites.id]: favoritesInitStore,
  [PAGES.productDetails.id]: productDetailsInitStore,
  [PAGES.outfitDetails.id]: outfitDetailsInitStore,
  [PAGES.productListing.id]: productListingInitStore,
  [PAGES.search.id]: productSearchInitStore,
  [PAGES.helpCenter.id]: helpCenterInitStore,
  [PAGES.usAndCaStores.id]: usAndCaStoresInitStore,
  [PAGES.storeDetails.id]: storeDetailsInitStore
};

function initReduxStore (store, pageId, isMobile) {
  let pendingPromises =
    initPipeline({store, pageId, isMobile})
    .pipe(commonInitStore)
    .pipe(INIT_STORE_METHODS[pageId] || passThrough)
    .pipe(finalizeStore)
    .result.pendingPromises;

  Promise.all(pendingPromises).then(() => {
    getGeneralOperator(store).setIsLoading(false);
  }).catch((err) => {
    logErrorAndServerThrow(store, 'initReduxStore', err);
  });
}

function finalizeStore (payload) {
  let {pendingPromises, sessionPromise} = payload;
  pendingPromises.push(sessionPromise);
  return payload;
}

function commonInitStore (payload) {
  let {store, pageId, pendingPromises, isMobile} = payload;

  // calling the operator in here, because it has the side-effect of initializing
  // an observer for logged in user to refresh espots and footer navitation
  let generalOperator = getGeneralOperator(store);

  let siteId = sitesAndCountriesStoreView.getCurrentSiteId(store.getState());
  let apiHelper = getApiHelper(siteId, window.location.hostname, null, isMobile);
  let userOperator = getUserOperator(store);

  getRoutingOperator(store).setApiHelper(apiHelper);

  // espots may depend on whether the user is logged in or not, so we might want to move this to after the user info loaded
  // but since the espots that reload are minimun (1 in common, few on my account, etc)
  // we rather keep it this way so that guest users get them faster
  let espotsTable = require('service/resources/espots/espotsCommonTable.json');
  generalOperator.loadEspots(espotsTable).catch((err) => { logErrorAndServerThrow(store, 'loadEspots', err); });

  // let navigationTree = generalStoreView.getHeaderNavigationTree(store.getState());
  if (LOCAL_SERVE) {
    // These only run when local webpack dev server is running, helps to set values nodeJS would derive
    getRoutingOperator(store).setCurrentPageId(pageId);
    getRoutingOperator(store).setIsMobileSite(isMobile);

    // killswitches are not session dependant, so we can load on server-side and keep here as testing fallback
    pendingPromises.push(generalOperator.loadKillSwitches().catch((err) => logErrorAndServerThrow(this.store, 'loadKillSwitches', err)));

    // this a fallback only used for local testing, on the server side this service cannot fail
    // otherwise there would be the fallback 404
    let countryPromise = generalOperator.setCountryAndCurrenciesMap();

    pendingPromises.push(countryPromise
      .then(() => {
        return Promise.all([
          generalOperator.loadFooterNavigation().catch((err) => { logErrorAndServerThrow(store, 'loadFooterNavigation', err); }),
          generalOperator.loadHeaderNavigationTree(store).catch((err) => { logErrorAndServerThrow(store, 'loadHeaderNavigationTree', err); })
        ]);
      })
      .catch((err) => { logErrorAndServerThrow(store, 'setCountryAndCurrenciesMap', err); }));

    payload.sessionPromise = countryPromise.then(() => userOperator.setUserBasicInfo().catch((err) => { logErrorAndServerThrow(store, 'setUserBasicInfo', err); }));
  } else {
    // we're blocking on user info because it contains all session information,
    // and user-dependent killswitches so we need to wait for them
    // (eg: otherwise bopis cta would show and then get removed and that looks weird)
    payload.sessionPromise = userOperator.setUserBasicInfo().catch((err) => { logErrorAndServerThrow(store, 'setUserBasicInfo', err); });
  }

  if (pageId !== PAGES.cart.id && pageId !== PAGES.checkout.id) {     // in cart/checkout we load the full cart elswhere
    // we need to update the count, before and after getting the session information,
    // but because of a performance issue we're only going to make this call
    // after getting the user info
    // REVIEW: I prefer to have it in here and not on userOperator because we need to identify
    // the page the user is on, and I don't like having that on the userFormOperator
    payload.sessionPromise.then(() => {
      getCartOperator(store).loadCartItemsCount().catch((err) => { logErrorAndServerThrow(store, 'loadCartItemsCount', err); });

      // we also need to update the count when the user logs in (from non-cart pages)
      if (userStoreView.isGuest(store.getState())) {
        observeStore(
          store,
          (state) => userStoreView.isGuest(state),
          (oldIsGuest, newIsGuest) => {
            // this only updates the header count, we don't want this one to be blocking, so not pushing to pendingPromises
            getCartOperator(store).loadCartItemsCount().catch((err) => { logErrorAndServerThrow(store, 'loadCartItemsCount', err); });
          },
          true
        );
      }
    });
  } else {
    // login from cart (or checkout thru the rewards banner)
    // could load saved items, so we need to load the whole cart again.
    // moved from cartOperator because it should not trigger on pages
    // other than cart or checkout. drawer would trigger the call anyway
    payload.sessionPromise.then(() => {
      observeStore(
        store,
        (state) => userStoreView.isGuest(state),
        (oldIsGuest, newIsGuest) => {
          getCartOperator(store).loadFullCartDetails().catch((err) => { logErrorAndServerThrow(store, 'reloadCart', err); });
        },
        true
      );
    });
  }

  return payload;
}

function homePageInitStore (payload) {
  let {store} = payload;
  // #if STATIC2
  let espotsTable = require('service/resources/espots/espotsVersionsTableHomePage.json');
  getGeneralOperator(store).loadEspots(espotsTable).catch((err) => { logErrorAndServerThrow(store, 'loadEspots', err); });
  // #endif

  getProductsOperator(store).loadProductRecommendations(RECOMMENDATIONS_SECTIONS.HOMEPAGE).catch((err) => { logErrorAndServerThrow(store, 'loadProductRecommendations', err); });
  return payload;
}

function contentPageInitStore (payload) {
  if (LOCAL_SERVE) {
    let {store} = payload;
    let match = matchPath(window.location.pathname, {path: PAGES.content.pathPattern});
    let espotsTable = {[CONTENT_PAGE_CUSTOM_ESPOT_NAME]: {'nameOnServer': match.params.contentSlotName, 'guest': '1', 'registered': '1'}};
    getGeneralOperator(store).loadEspotAndExtraInfo(espotsTable, true);
  }

  return payload;
}

function changePasswordInitStore (payload) {
  payload = homePageInitStore(payload);
  let {store} = payload;
  let queryObject = queryString.parse(window.location.search);

  if (queryObject.resetPasswordRequest) {
    getGlobalSignalsOperator(store).openSelectedLoginDrawerForm(LOGIN_FORM_TYPES.REQUEST_PASSWORD_RESET);
  } else {
    getGlobalSignalsOperator(store).openSelectedLoginDrawerForm(LOGIN_FORM_TYPES.PASSWORD_RESET);
  }

  return payload;
}

function usAndCaStoresInitStore (payload) {
  let {store, pendingPromises} = payload;

  getGeneralOperator(store).setIsLoading(true);

  pendingPromises.push(getStoresOperator(store).loadAllStoresMetaData());
  return payload;
}

function cartInitStore (payload) {
  let {store, pendingPromises, sessionPromise} = payload;

  getGeneralOperator(store).setIsLoading(true);

  let espotsTable = require('service/resources/espots/espotsVersionsTableCart.json');
  getGeneralOperator(store).loadEspots(espotsTable).catch((err) => { logErrorAndServerThrow(store, 'loadEspots', err); });

  pendingPromises.push(
    getCartOperator(store).loadFullCartDetails().then(() => {
      let mostExpensiveItem = cartStoreView.getMostExpensiveItem(store.getState());
      getProductsOperator(store)
      .loadProductRecommendations(RECOMMENDATIONS_SECTIONS.BAG, mostExpensiveItem && mostExpensiveItem.miscInfo.vendorColorDisplayId)
      .catch((err) => { logErrorAndServerThrow(store, 'loadProductRecommendations', err); });
    })
  );

  // we shouldn't block the user when loading promos, so not pushing to pendingPromises
  getUserOperator(store).getAllAvailableCouponsAndPromos().catch((err) => { logErrorAndServerThrow(this.store, 'getAllAvailableCouponsAndPromos', err); });

  pendingPromises.push(sessionPromise.then(() => {
    observeStore(
      store,
      (state) => userStoreView.isGuest(state),
      (oldIsGuest, newIsGuest) => getUserOperator(store).getAllAvailableCouponsAndPromos().catch((err) => { logErrorAndServerThrow(this.store, 'getAllAvailableCouponsAndPromos', err); }),
      true
    );
  }));

  return payload;
}

function checkoutInitStore (payload) {
  let {store, pendingPromises, sessionPromise} = payload;

  getGeneralOperator(store).setIsLoading(true);

  let espotsTable = require('service/resources/espots/espotsVersionsTableCheckout.json');
  getGeneralOperator(store).loadEspots(espotsTable).catch((err) => { logErrorAndServerThrow(store, 'loadEspots', err); });

  pendingPromises.push(sessionPromise.then(() => {
    // if user got to checkout page when he's supposed to get international checkout page, redirect
    if (sitesAndCountriesStoreView.getIsInternationalShipping(store.getState())) {
      getRoutingOperator(store).gotoPage(PAGES.intlCheckout, null, true);
    }

    return getCheckoutOperator(store).initCheckout();
  }));

  return payload;
}

function intlCheckoutInitStore (payload) {
  let {store, pendingPromises, sessionPromise} = payload;

  getGeneralOperator(store).setIsLoading(true);

  pendingPromises.push(
    getCheckoutOperator(store).loadInternationalSettings(),
    sessionPromise.then(() => {
      // if user got to intl checkout page when he's supposed to get domestic checkout page, redirect
      if (!sitesAndCountriesStoreView.getIsInternationalShipping(store.getState())) {
        getRoutingOperator(store).gotoPage(PAGES.checkout, null, true);
      }
    })
  );

  return payload;
}

function myAccountInitStore (payload) {
  let {store, pendingPromises, sessionPromise} = payload;

  getGeneralOperator(store).setIsLoading(true);

  // we shouldn't block the user when loading promos, so not pushing to pendingPromises
  getUserOperator(store).getAllAvailableCouponsAndPromos()
    .catch((err) => { logErrorAndServerThrow(store, 'getAllAvailableCouponsAndPromos', err); });

  // we running all services in parallel (even for guest user)
  // if the user turns out to be guest we simply redirect
  // this creates more service calls when the user is guest, but it speeds things up for registered user
  // and since the guest user scenario is rare (user needs to manually enter the url)
  // it's a nice tradeoff
  pendingPromises.push(
    getAddressesOperator(store).loadAddressesOnAccount(),
    getPaymentCardsOperator(store).loadCreditCardsOnAccount(),
    getOrdersOperator(store).getSiteOrdersHistoryPage(sitesAndCountriesStoreView.getCurrentSiteId(store.getState()), 1, false),
    sessionPromise.then(() => {
      if (userStoreView.isGuest(store.getState())) {
        getRoutingOperator(store).gotoPage(HOME_PAGE_SECTIONS[DRAWER_IDS.LOGIN]);
      } else {
        // on my account, all espots depend on the user being logged in or not,
        // so we need to wait for the session service to return before loading them
        let espotsTable = require('service/resources/espots/espotsVersionsTableAccount.json');
        getGeneralOperator(store).loadEspots(espotsTable).catch((err) => { logErrorAndServerThrow(store, 'loadEspots', err); });
      }
    })
  );

  return payload;
}

function favoritesInitStore (payload) {
  let {store, pendingPromises, sessionPromise} = payload;

  getGeneralOperator(store).setIsLoading(true);

  let espotsTable = require('service/resources/espots/espotsVersionsTableFavoritesPage.json');
  getGeneralOperator(store).loadEspots(espotsTable)
    .catch((err) => { logErrorAndServerThrow(store, 'loadEspots', err); });

  pendingPromises.push(sessionPromise.then(() => {
    let favoriteOperator = getFavoritesOperator(store);
    let queryObject = queryString.parse(window.location.search);
    if (queryObject.guestAccessKey && queryObject.wishlistId) {
      return favoriteOperator.loadActiveWishlistByGuestKey(queryObject.wishlistId, queryObject.guestAccessKey);
    } else {
      if (userStoreView.isGuest(store.getState())) {
        return getRoutingOperator(store).gotoPage(PAGES.content, {
          pathSuffix: 'favorites'
        });
      }

      return favoriteOperator.loadWishlistsSummaries().then(() => {
        // assumed there's always a default one (as per requirements)
        let wishlists = favoritesStoreView.getWishlistsSummaries(store.getState());
        let defaultWishlist = wishlists.find((list) => list.isDefault);
        return favoriteOperator.loadActiveWishlist(defaultWishlist.id).then(() => {
          let mostExpensiveItem = favoritesStoreView.getMostExpensiveItem(store.getState());
          getProductsOperator(store)
            .loadProductRecommendations(RECOMMENDATIONS_SECTIONS.FAVORITES, mostExpensiveItem && mostExpensiveItem.skuInfo.colorProductId)
            .catch((err) => { logErrorAndServerThrow(store, 'loadProductRecommendations', err); });
        });
      });
    }
  }));

  return payload;
}

function productDetailsInitStore (payload) {
  let {store, pendingPromises, sessionPromise} = payload;

  getGeneralOperator(store).setIsLoading(true);

  let espotsTable = require('service/resources/espots/espotsVersionsTablePDP.json');
  getGeneralOperator(store).loadEspots(espotsTable)
    .catch((err) => { logErrorAndServerThrow(store, 'loadEspots', err); });

  let productsOperator = getProductsOperator(store);

  let loadProductPromise = Promise.resolve();
  // fallback for server-side rendering failure (mainly for ease of testing - loads product on client side)
  if (LOCAL_SERVE) {
    let match = matchPath(window.location.pathname, {path: PAGES.productDetails.pathPattern});
    loadProductPromise = productsOperator.loadProduct(match.params.productKey);
  }

  loadProductPromise.then(() => {
    let storeState = store.getState();
    productsOperator.getExtraImagesForProduct();

    /*
     * Removed setActiveProductColor from pendingPromises because we don't
     * need to wait for the inventory to load before rendering the page
     */
    productsOperator.setActiveProductColor(productDetailsStoreView.getCurrentColorProductId(storeState));
  });

  pendingPromises.push(sessionPromise.then(() => {
    // We need PDP to refresh on login because of BV integration. This is done inside the .then to prevent an infinite
    // loop of refreshes as the user always comes flagged as guest from the server
    observeStore(
      store,
      (state) => userStoreView.isGuest(state),
      (oldIsGuest, newIsGuest) => !newIsGuest && document.location.reload(true),
      true      // do not trigger now, as it will cause an infinite loop if the user is already logged in
    );
  }));

  // we need the additional product info to load after the session loaded
  // (as we should only load for registered user)
  // there's a caveat tho, on local this causes an additional loading phase
  // custom user info should not be blocking
  Promise.all([sessionPromise, loadProductPromise]).then(() => {
    let storeState = store.getState();
    // this piece loads optional user-specific information about the product
    // (for instance, whether it's favorited or not) so we're not blocking the load on them

    // DT-32196 this piece of code to pass information to PDP page to get the wish list based on color.
    productsOperator.loadProductUserCustomInfo(productDetailsStoreView.getProductAllColorIds(storeState))
    .catch((err) => { logErrorAndServerThrow(store, 'loadProductUserCustomInfo', err); });
  });

  return payload;
}

function outfitDetailsInitStore (payload) {
  let {store, pendingPromises, sessionPromise} = payload;

  getGeneralOperator(store).setIsLoading(true);

  let espotsTable = require('service/resources/espots/espotsVersionsTablePDP.json');
  getGeneralOperator(store).loadEspots(espotsTable)
    .catch((err) => { logErrorAndServerThrow(store, 'loadEspots', err); });

  let productsOperator = getProductsOperator(store);

  let loadOutfitPromise = Promise.resolve();
  // fallback for server-side rendering failure (mainly for ease of testing - loads product on client side)
  if (LOCAL_SERVE) {
    let match = matchPath(window.location.pathname, {path: PAGES.outfitDetails.pathPattern});
    loadOutfitPromise = productsOperator.loadOutfitDetails(match.params.outfitId, match.params.vendorColorProductIdsList);
  }

  pendingPromises.push(loadOutfitPromise.then(() => {
    let representativeProductId = productDetailsStoreView.getOutfitRepresentativeProductId(store.getState());
    productsOperator.loadProductRecommendations(RECOMMENDATIONS_SECTIONS.OUTFIT, representativeProductId)
    .catch((err) => { logErrorAndServerThrow(store, 'loadProductRecommendations', err); });
    productsOperator.loadOutfitRecommendations(representativeProductId)
    .catch((err) => { logErrorAndServerThrow(store, 'loadOutfitRecommendations', err); });

    // this piece loads inventory and optional user-specific information about the product
    // we block since the user should not interact with the page before we have inventory
    return productsOperator.loadOutfitInventory()
      .catch((err) => { logErrorAndServerThrow(store, 'loadOutfitInventory', err); });
  }));

  // we need the additional product info to load after the session loaded
  // (as we should only load for registered user)
  // custom user information should not be blocking
  Promise.all([sessionPromise, loadOutfitPromise]).then(() => {
    productsOperator.addCustomUserInfoToOutfitProducts()
    .catch((err) => { logErrorAndServerThrow(store, 'addCustomUserInfoToOutfitProducts', err); });
  });

  return payload;
}

function productListingInitStore (payload) {
  let {store, pendingPromises, sessionPromise} = payload;

  let loadProductsPromise = Promise.resolve();
  // fallback for server-side rendering failure (mainly for ease of testing - loads product on client side)
  if (LOCAL_SERVE) {
    getGeneralOperator(store).setIsLoading(true);
    // load first page of products
    loadProductsPromise = getProductsOperator(store).getProductsListingForUrlLocation(window.location)
    .then(() => {      // loading espots is inside "then" because espot name depends on category name
      let espotsTable = {};
      productListingStoreView.getEspotByCategory(store.getState()).map((espot) => {
        espotsTable[espot.contentSlotName] = {'nameOnServer': espot.contentSlotName, 'guest': '1', 'registered': '1'};
      });
      getGeneralOperator(store).loadEspots(espotsTable)
      .catch((err) => { logErrorAndServerThrow(store, 'loadEspots', err); });
    });
  }

  pendingPromises.push(loadProductsPromise.then(() => {
    if (!LOCAL_SERVE) {
      // load all images for loaded products (only when coming back from server side)
      // as on client side is already handled from the operator
      getProductsOperator(store).getExtraImagesForLastLoadedPage();
    }

    // recommendations module is optional, we should never block on loading recommendations
    let listingDisplayName = productListingStoreView.getListingDisplayName(store.getState());
    let outfitLandingId = productListingStoreView.getOutfitListingIdentifier(store.getState());
    if (outfitLandingId) {
      getProductsOperator(store).loadOutfitRecommendations(null, outfitLandingId)
      .then(() => {
        // outfit recommendations is a 3rd party service,
        // we cannot ask them to send 404 on the service (we could if MS creates a proxy for it, but they won't)
        // in this case we need to identify the response ourselves and redirect to a 404 page
        // it has to be a redirect because the server already returned 200,
        // we shouldn't show a 404 template on a 200 response
        let storeState = store.getState();
        let totalLoadedProducts = productListingStoreView.getTotalProductsCount(storeState);
        let outfitsRecommendations = recommendationsStoreView.getAllOutfitRecommendations(storeState);
        if (totalLoadedProducts === 0 && outfitsRecommendations.length === 0) {
          getRoutingOperator(store).gotoPage(PAGES.notFound, null, true);
        }
      })
      .catch((err) => { logErrorAndServerThrow(store, 'loadOutfitRecommendations', err); });
    }
    getProductsOperator(store).loadProductRecommendations(RECOMMENDATIONS_SECTIONS.DEPARTMENT_LANDING, null, listingDisplayName)
    .catch((err) => { logErrorAndServerThrow(store, 'loadProductRecommendations', err); });
  }));

  // we need the additional product info to load after the session loaded
  // (as we should only load for registered user)
  // custom user information should not be blocking
  Promise.all([sessionPromise, loadProductsPromise]).then(() => {
    // loading user-specific information should not be blocking
    getProductsOperator(store).addCustomUserInfoToProductListingLoadedPages()
    .catch((err) => { logErrorAndServerThrow(store, 'addCustomUserInfoToProductListingLoadedPages', err); });
  });

  return payload;
}

function productSearchInitStore (payload) {
  let {store, pendingPromises, sessionPromise} = payload;     // eslint-disable-line no-unused-vars

  let loadProductsPromise = Promise.resolve();
  // fallback for server-side rendering failure (mainly for ease of testing - loads product on client side)
  if (LOCAL_SERVE) {
    getGeneralOperator(store).setIsLoading(true);
    loadProductsPromise = getProductsOperator(store).getProductsListingForUrlLocation(window.location);
  } else {
    // load all images for loaded products (only when coming back from server side)
    // as on client side is already handled from the operator
    getProductsOperator(store).getExtraImagesForLastLoadedPage();
  }

  // we need the additional product info to load after the session loaded
  // (as we should only load for registered user)
  // custom user information should not be blocking
  Promise.all([sessionPromise, loadProductsPromise]).then(() => {
    // loading user-specific information should not be blocking
    getProductsOperator(store).addCustomUserInfoToProductListingLoadedPages()
    .catch((err) => { logErrorAndServerThrow(store, 'addCustomUserInfoToProductListingLoadedPages', err); });
  });

  return payload;
}

function helpCenterInitStore (payload) {
  let {store, pendingPromises} = payload;

  // fallback for server-side rendering failure (mainly for ease of testing - loads product on client side)
  if (LOCAL_SERVE) {
    getGeneralOperator(store).setIsLoading(true);
    let espotsTable = require('service/resources/espots/espotsVersionsTableHelpCenter.json');
    pendingPromises.push(getGeneralOperator(store).loadEspots(espotsTable));
  }

  return payload;
}

function storeDetailsInitStore (payload) {
  let {store, pendingPromises} = payload;

  // fallback for server-side rendering failure (mainly for ease of testing - loads store details on client side)
  if (LOCAL_SERVE) {
    getGeneralOperator(store).setIsLoading(true);
    pendingPromises.push(getStoresOperator(store).loadStorePlusNearbyStores(getStoreIdFromUrlPathPart(document.location.href)));
  }

  return payload;
}

export let fullPageRender = function (element, rootInDom, pageId, options) {
  let reducer = combineReducers(reducers);
  let middleware = applyMiddleware(batchActionsMiddleware);
  let store = createStore(
    enableReducersActionsBatching(reducer), PRELOADED_STATE ? getStoreStateFromImage(PRELOADED_STATE) : undefined,
    compose(middleware, window.devToolsExtension ? window.devToolsExtension() : (f) => f)
  );

  // New Redux does not allow hot reload without this support see -> https://github.com/reactjs/react-redux/releases/tag/v2.0.0
  if (module.hot && LOCAL_SERVE) {
    module.hot.accept(reducer, () => store.replaceReducer({...reducer}));
  }

  pageId = pageId || routingStoreView.getCurrentPageId(store.getState());
  options = options || {
    isMobile: routingInfoStoreView.getIsMobile(store.getState())
  };

  let {isMobile, notInitializeStore} = options;

  let ClientRouter = createClientRouter(store);

  if (!notInitializeStore) {
    initReduxStore(store, pageId, isMobile);
  }

  analyticsDataLayer(store);
  initializeABTestingHook(store);

  ReactDOM.hydrate(
    <Provider store={store}>
      <ClientRouter>
        {element}
      </ClientRouter>
    </Provider>
  , rootInDom);

};
