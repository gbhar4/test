import Immutable from 'seamless-immutable';
import {logError, logErrorAndServerThrow} from './operatorHelper';
import {
  getSetCurrentOutfitActn,
  getSetCurrentProductActn,
  getSetCurrentColorProductIdActn,
  getSetCurrentProductBreadCrumbsActn,
  getSetProductOptionsForColorActn,
  getSetOutfitProductOptionsForColorActn,
  getSetCurrentProductImagesByColorActn,
  getSetIsInventoryLoadedActn
} from 'reduxStore/storeReducersAndActions/productDetails/productDetails';
import {getSetDefaultWishListActn} from 'reduxStore/storeReducersAndActions/favorites/favorites';
import {
  getSetProductRecommendationsActn,
  getSetOutfitRecommendationsActn
} from 'reduxStore/storeReducersAndActions/recommendations/recommendations';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {getProductsAbstractor} from 'service/productsServiceAbstractor';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {RECOMMENDATIONS_SECTIONS, getVendorAbstractors} from 'service/vendorServiceAbstractor.js';
import {PAGES} from 'routing/routes/pages';
import {productDetailsStoreView} from 'reduxStore/storeViews/productDetailsStoreView';
import {routingStoreView} from 'reduxStore/storeViews/routing/routingStoreView.js';
import {
  getSetCurrentListingIdActn,
  getSetCurrentListingNameActn,
  getSetCurrentListingTypeActn,
  getSetCurrentListingSeoKeyActn,
  getSetCurrentListingIsDepartmentActn,
  getSetCurrentListingTitleActn,
  getSetCurrentListingDescriptionActn,
  getSetCurrentListingShortDescriptionActn,
  getSetProductsCountActn,
  getSetListingProductsPagesActn,
  getSetListingFirstProductsPageActn,
  getAppendListingProductsPageActn,
  getReplaceListingProductsPageActn,
  getSetListingsBreadCrumbsActn,
  getSetListingNavigationTreeActn,
  getListingSetFiltersMapsActn,
  getListingSetAppliedFiltersIdsActn,
  getListingSetAppliedSortActn,
  getListingSetOutfitListingIdentifierActn,
  getSetCurrentListingSearchForTextActn
} from 'reduxStore/storeReducersAndActions/productListing/productListing';
import {productListingStoreView} from 'reduxStore/storeViews/productListingStoreView.js';
import queryString from 'query-string';
import {matchPath} from 'react-router';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';
import {isClient} from 'routing/routingHelper';
import {getMapSliceForColorProductId} from 'util/viewUtil/productsCommonUtils';
import {userStoreView} from 'reduxStore/storeViews/userStoreView.js';

export { RECOMMENDATIONS_SECTIONS };

let previous = null;

export function getProductsOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new ProductsOperator(store);
  }
  return previous;
}

class ProductsOperator {
  constructor (store) {
    this.store = store;
    bindAllClassMethodsToThis(this);
  }

  get productsAbstractor () {
    return getProductsAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  get vendorServiceAbstractors () {
    return getVendorAbstractors(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  setHomepageAsBreadcrumb () {
    this.store.dispatch(getSetCurrentProductBreadCrumbsActn([{
      displayName: 'Home',
      destination: PAGES.homePage
    }]));
  }

  loadProduct (productKey) {
    return this.productsAbstractor.getProductInfoById(productKey, this.getImgPath).then((res) => {
      this.store.dispatch([
        getSetCurrentProductActn(res.product),
        getSetCurrentColorProductIdActn(res.product.generalProductId),
        getSetCurrentProductBreadCrumbsActn(res.breadCrumbTrail.map((crumb) => ({
          displayName: crumb.displayName,
          destination: PAGES.productListing,
          // destination: PAGES.productListing,
          pathSuffix: crumb.urlPathSuffix
        })))
      ]);
      return res.product;
    }).catch((err) => {
      logErrorAndServerThrow(this.store, 'ProductsOperator.loadProduct', err);
    });
  }

  // alt images to load on client instead of server
  getExtraImagesForProduct () {
    let product = productDetailsStoreView.getCurrentProduct(this.store.getState());

    return this.productsAbstractor.getExtraImagesForProduct(product, this.getImgPath).then((imagesByColor) => {
      this.store.dispatch(getSetCurrentProductImagesByColorActn(imagesByColor));
    });
  }

  loadOutfitDetails (outfitId, vendorColorProductIdsList) {

    return this.productsAbstractor.getOutfitProdutsDetails(outfitId, vendorColorProductIdsList, this.getImgPath)
    .then((res) => {
      this.store.dispatch(getSetCurrentOutfitActn(res));
    }).catch((err) => {
      logErrorAndServerThrow(this.store, 'ProductsOperator.loadOutfitDetails', err);
    });
  }

  loadProductUserCustomInfo (generalProductId) {
    // DT-31015 - no customer information for guest / remembered
    let isGuest = userStoreView.isGuest(this.store.getState());
    let isRemembered = userStoreView.isRemembered(this.store.getState());
    if (isGuest || isRemembered) {
      return Promise.resolve();
    }

    return this.productsAbstractor.getProductsUserCustomInfo([generalProductId])
    .then((res) => {
      // DT-32196 added default wish list on PDP page.
      this.store.dispatch(getSetDefaultWishListActn({...res}));
    }).catch((err) => {
      logError(this.store, 'ProductsOperator.loadProductUserCustomInfo', err);
    });
  }

  getProductsListingForUrlLocation (location) {
    let match =
      matchPath(location.pathname, {path: PAGES.productListing.pathPattern}) ||
      matchPath(location.pathname, {path: PAGES.search.pathPattern});

    let pageNumber = !isNaN(match.params.pageNumber) ? Math.max(parseInt(match.params.pageNumber), 1) : 1;
    let filtersAndSort = getPlpCutomizersFromUrlQueryString(location.search);

    return this.getProductsListingInfo(filtersAndSort, pageNumber, location)
    .then((res) => {
      dispatchPlpInfo(this.store, res, true);
      // if a single PDP in the result, and not due to filtering then redirect to the pdp of that product
      if (isClient() && match.params.searchTerm && res.loadedProducts.length === 1 && !isFiltered(filtersAndSort)) {
        document.location = res.loadedProducts[0].productInfo.pdpUrl + '#ref=sr';
      }

      if (isClient()) {
        this.getExtraImagesForLastLoadedPage();
      }

      return res;
    }).catch((err) => {
      logErrorAndServerThrow(this.store, 'ProductsOperator.getProductsListingForUrlLocation', err);
    });
  }

  getProductsListingMoreProducts () {
    if (isOnSeoPlp()) return Promise.resolve();      // scrolling is only supported on pages intended for human users, not for crawlers

    let state = this.store.getState();
    let lastLoadedPageNumber = productListingStoreView.getLastLoadedPageNumber(state);

    if (lastLoadedPageNumber >= productListingStoreView.getMaxPageNumber(state)) {
      return Promise.resolve();      // nothing more to load
    }

    let appliedFiltersIds = productListingStoreView.getAppliedFilterIds(state);
    return this.getProductsListingInfo(
      {
        colorFilterIdsList: appliedFiltersIds.colors,
        sizeFiltersIdsList: appliedFiltersIds.sizes,
        departmentFiltersIdsList: appliedFiltersIds.departments,
        subDepartmentFiltersIdsList: appliedFiltersIds.subDepartments,
        sortId: productListingStoreView.getAppliedSort(state)
      },
      lastLoadedPageNumber + 1
    ).then((res) => {
      this.store.dispatch(getAppendListingProductsPageActn(res.loadedProducts));

      if (isClient()) {
        this.getExtraImagesForLastLoadedPage();
      }
    }).catch((err) => {
      logErrorAndServerThrow(this.store, 'ProductsOperator.getProductsListingMoreProducts', err);
    });
  }

  getCustomProductsListingMoreProducts () {
    if (isOnSeoPlp()) return Promise.resolve();      // scrolling is only supported on pages intended for human users, not for crawlers

    let state = this.store.getState();
    let lastLoadedPageNumber = productListingStoreView.getLastLoadedPageNumber(state);

    if (lastLoadedPageNumber >= productListingStoreView.getMaxPageNumber(state)) {
      return Promise.resolve();      // nothing more to load
    }

    let appliedFiltersIds = productListingStoreView.getAppliedFilterIds(state);
    return this.getCustomProductsListingInfo(
      {
        colorFilterIdsList: appliedFiltersIds.colors,
        sizeFiltersIdsList: appliedFiltersIds.sizes,
        departmentFiltersIdsList: appliedFiltersIds.departments,
        subDepartmentFiltersIdsList: appliedFiltersIds.subDepartments,
        sortId: productListingStoreView.getAppliedSort(state)
      },
      lastLoadedPageNumber + 1
    ).then((res) => {
      this.store.dispatch(getSetListingFirstProductsPageActn(res.loadedProducts));

      if (isClient()) {
        this.getExtraImagesForLastLoadedPage();
      }
    }).catch((err) => {
      logErrorAndServerThrow(this.store, 'ProductsOperator.getProductsListingMoreProducts', err);
    });
  }

  getExtraImagesForLastLoadedPage () {
    let loadedProductsPages = productListingStoreView.getLoadedProductsPages(this.store.getState());
    if (loadedProductsPages.length === 0) return;         // nothing to do

    let lastPageProducts = loadedProductsPages[loadedProductsPages.length - 1];
    return this.productsAbstractor.getExtraImagesForProductsList(lastPageProducts, this.getImgPath).then((updatedProducts) => {
      this.store.dispatch(getReplaceListingProductsPageActn(updatedProducts, loadedProductsPages.length - 1));
    });
  }

  getProductsListingInfo (filtersAndSort, pageNumber, location = routingInfoStoreView.getHistory(this.store.getState()).location) {
    let {colors, sizes, departments, sort,                    // eslint-disable-line no-unused-vars
      // NOTE: these are parameters on query string we don't handle (nor we need to) -- just pass them to the abstractor
      ...extaQueryValues} = queryString.parse(location.search);

    let isSearchPage = routingStoreView.getCurrentPageId(this.store.getState()) === PAGES.search.id;
    let match = isSearchPage
      ? matchPath(location.pathname, {path: PAGES.search.pathPattern})
      : matchPath(location.pathname, {path: PAGES.productListing.pathPattern});

    return this.productsAbstractor.getCategoryListingPage(match.params.searchTerm || match.params.listingKey, isSearchPage, filtersAndSort, pageNumber, extaQueryValues, this.getImgPath)
    .then((res) => {
      if (isClient()) {
        let {loadedProducts, ...otherInfo} = res;

        return this.addCustomUserInfoToProducts(loadedProducts)
        .then((productsWithCustomInfo) => ({loadedProducts: productsWithCustomInfo, ...otherInfo}));
      } else {
        return res;
      }
    });
  }

  getCustomProductsListingInfo (filtersAndSort, pageNumber, location = routingInfoStoreView.getHistory(this.store.getState()).location) {
    let {colors, sizes, departments, sort,                    // eslint-disable-line no-unused-vars
      // NOTE: these are parameters on query string we don't handle (nor we need to) -- just pass them to the abstractor
      ...extaQueryValues} = queryString.parse(location.search);

    let isSearchPage = routingStoreView.getCurrentPageId(this.store.getState()) === PAGES.search.id;
    let match = isSearchPage
      ? matchPath(location.pathname, {path: PAGES.search.pathPattern})
      : matchPath(location.pathname, {path: PAGES.productListing.pathPattern});

    return this.productsAbstractor.getCustomCategoryListingPage(match.params.searchTerm || match.params.listingKey, isSearchPage, filtersAndSort, pageNumber, extaQueryValues, this.getImgPath)
    .then((res) => {
      if (isClient()) {
        let {loadedProducts, ...otherInfo} = res;

        return this.addCustomUserInfoToProducts(loadedProducts)
        .then((productsWithCustomInfo) => ({loadedProducts: productsWithCustomInfo, ...otherInfo}));
      } else {
        return res;
      }
    });
  }

  addCustomUserInfoToProductListingLoadedPages () {
    let loadedProductsPages = productListingStoreView.getLoadedProductsPages(this.store.getState());
    if (loadedProductsPages.length === 0) return Promise.resolve();         // nothing to do
    let pathcedPages = [];
    let pendingPromises = loadedProductsPages.reduce((pendingPromises, products, index) => {
      pendingPromises.push(
        this.addCustomUserInfoToProducts(products)
        .then((pathcedProducts) => { pathcedPages[index] = pathcedProducts; })
      );
      return pendingPromises;
    }, []);
    return Promise.all(pendingPromises).then(() => this.store.dispatch(getSetListingProductsPagesActn(pathcedPages)));
  }

  loadOutfitInventory () {
    let currentOutfit = productDetailsStoreView.getCurrentOutfit(this.store.getState());
    let colorProductIdsList = currentOutfit.products.map((product) => product.generalProductId);
    return this.productsAbstractor.getMultipleInventoryAndFavoritsCount(colorProductIdsList)
    .then((extraProductsInfo) => {
      for (let product of currentOutfit.products) {
        let generalProductId = product.generalProductId;
        let colorFitsSizesMapEntry = getMapSliceForColorProductId(product.colorFitsSizesMap, generalProductId);
        let newColorFitsSizesMap = getPatchColorFitsSizesMap(colorFitsSizesMapEntry, extraProductsInfo[generalProductId]);
        this.store.dispatch(getSetOutfitProductOptionsForColorActn(generalProductId, generalProductId, newColorFitsSizesMap));
      }
    }).catch((err) => {
      logErrorAndServerThrow(this.store, 'ProductsOperator.loadOutfitInventory', err);
    });
  }

  addCustomUserInfoToOutfitProducts () {
    // DT-31015 - no customer information for guest / remembered
    if (userStoreView.isGuest(this.store.getState())) {
      return Promise.resolve();
    }

    let outfit = productDetailsStoreView.getCurrentOutfit(this.store.getState());
    let generalProductIdsList = outfit.products.map((product) => product.generalProductId);

    return this.productsAbstractor.getProductsUserCustomInfo(generalProductIdsList)
    .then((extraProductsInfo) => this.store.dispatch(getSetCurrentOutfitActn({
      ...outfit,
      products: outfit.products.map((product) => {
        let extraProductInfo = extraProductsInfo[product.generalProductId];

        /** REVIEW: structure is different, favorited is at general product id,
        but in here we also have colors and evenrything. I'm keeping it similar to PDP
        which keeps the flag at the root of the product (no miscInfo) **/
        return {
          ...product,
          isInDefaultWishlist: !!extraProductInfo && extraProductInfo.isInDefaultWishlist
        };
      })
    }))).catch((err) => {        // if failed, log error and simply do not add any extra info to products
      logError(this.store, 'ProductsOperator.addCustomUserInfoToOutfitProducts', err);
    });
  }

addCustomUserInfoToProducts (products) {
    // DT-31015 - no customer information for guest / remembered
    let isGuest = userStoreView.isGuest(this.store.getState());
    let isRemembered = userStoreView.isRemembered(this.store.getState());
    if (isGuest || isRemembered) {
      return Promise.resolve(products);
    }

    let generalProductIdsList = products.map((product) => product.productInfo.generalProductId);
    return this.productsAbstractor.getProductsUserCustomInfo(generalProductIdsList)
    .then((extraProductsInfo) => products.map((product) => {
      let {miscInfo, ...otherAttributes} = product;
      let extraProductInfo = extraProductsInfo[product.productInfo.generalProductId];
      return {
        ...otherAttributes,
        miscInfo: {...miscInfo, isInDefaultWishlist: !!extraProductInfo && extraProductInfo.isInDefaultWishlist}
      };
    })).catch((err) => {        // if failed, log error and simply do not add any extra info to products
      logError(this.store, 'ProductsOperator.addCustomUserInfoToProducts', err);
      return products;
    });
  }

  // Note: !!!!!!! this method is unique as it does not dispatch anything to the store!!!!!!!
  // Instead, it returns a Promise that resolves to the extra info loaded from the server.
  getListingProductExtraColorInfo (colorProductId) {
    let categoryType = productListingStoreView.getListingType(this.store.getState());
    return this.productsAbstractor.getProductColorExtraInfo(colorProductId, categoryType);
  }

  setActiveProductColor (colorProductId) {
    return Promise.resolve().then(() => {
      let currentProduct = productDetailsStoreView.getCurrentProduct(this.store.getState());
      let listingDisplayName = productListingStoreView.getListingDisplayName(this.store.getState());

      let colorOptionsMapEntry = getMapSliceForColorProductId(currentProduct.colorFitsSizesMap, colorProductId);
      if (!colorOptionsMapEntry) throw new Error(`ProductsOperator.setActiveProductColor: colorFitsSizesMap missing entry for colorProductId='${colorProductId}'`);

      this.loadProductRecommendations(RECOMMENDATIONS_SECTIONS.PDP, colorOptionsMapEntry.colorDisplayId, listingDisplayName);
      this.loadOutfitRecommendations(colorOptionsMapEntry.colorDisplayId);

      return this.getUpdatedOptionsInventoryForColor(colorOptionsMapEntry)
      .then((newColorOptionsMap) => {
        this.store.dispatch([
          getSetCurrentColorProductIdActn(colorProductId),
          getSetProductOptionsForColorActn(colorProductId, newColorOptionsMap),
          getSetIsInventoryLoadedActn(true)
        ]);
      }).catch((err) => {
        logErrorAndServerThrow(this.store, 'ProductsOperator.setActiveProductColor', err);
      });
    });
  }

  setActiveOutfitProductColor (generalProductId, colorProductId) {
    return Promise.resolve().then(() => {
      let currentOutfit = productDetailsStoreView.getCurrentOutfit(this.store.getState());
      let currentProduct = currentOutfit.products.find((product) => generalProductId === product.generalProductId);
      if (!currentProduct) throw new Error(`ProductsOperator.setActiveOutfitProductColor: could not find outfit product with generalProductId='${colorProductId}'`);

      let colorOptionsMapEntry = getMapSliceForColorProductId(currentProduct.colorFitsSizesMap, colorProductId);
      if (!colorOptionsMapEntry) {
        throw new Error('ProductsOperator.setActiveOutfitProductColor: colorFitsSizesMap of product with' +
          `generalProductId='${colorProductId}' is missing entry for colorProductId='${colorProductId}'`);
      }
      return this.getUpdatedOptionsInventoryForColor(colorOptionsMapEntry)
      .then((newColorOptionsMap) => {
        this.store.dispatch(getSetOutfitProductOptionsForColorActn(generalProductId, colorProductId, newColorOptionsMap));
      }).catch((err) => {
        logErrorAndServerThrow(this.store, 'ProductsOperator.setActiveOutfitProductColor', err);
      });
    });
  }

  loadOutfitRecommendations (itemPartNumber, outfitListingId, maxResultSet) {
    let siteId = sitesAndCountriesStoreView.getCurrentSiteId(this.store.getState());
    let currentOutfit = productDetailsStoreView.getCurrentOutfit(this.store.getState());
    let outfitId = currentOutfit && currentOutfit.outfitId;

    return this.vendorServiceAbstractors.getOutfitRecommendations(itemPartNumber, outfitListingId, maxResultSet, siteId, outfitId).then((res) => {
      this.store.dispatch(getSetOutfitRecommendationsActn(res.map((outfit) => ({
        ...outfit,
        pdpUrl: routingStoreView.getLocationFromPageInfo(this.store.getState(), {page: PAGES.outfitDetails, pathSuffix: `${outfit.generalProductId}/${outfit.productIds}`}).pathname
      }))));
    }).catch((err) => {
      // recommendations should not crash the server, so no serverThrow on this case
      logError(this.store, 'ProductsOperator.loadOutfitRecommendations', err);
    });
  }

  loadProductRecommendations (section, itemPartNumber, categoryName) {
    let siteId = sitesAndCountriesStoreView.getCurrentSiteId(this.store.getState());
    return this.vendorServiceAbstractors.getProductRecommendations(itemPartNumber, section, siteId, categoryName)
    .then((res) => this.store.dispatch(getSetProductRecommendationsActn(res)))
    .catch((err) => {
      // recommendations should not crash the server, so no serverThrow on this case
      logError(this.store, 'ProductsOperator.loadProductRecommendations', err);
    });
  }

  getUpdatedOptionsInventoryForColor (colorFitsSizesMapEntry, forceReload) {
    if (colorFitsSizesMapEntry.maxAvailable < Number.MAX_VALUE && !forceReload) {
      return Promise.resolve(colorFitsSizesMapEntry);     // nothing to do, inventory is already loaded for this color
    }

    return this.productsAbstractor.getInventoryAndFavoritsCount(colorFitsSizesMapEntry.colorProductId)
    .then((colorExtraInfo) => getPatchColorFitsSizesMap(colorFitsSizesMapEntry, colorExtraInfo));
  }

  getImgPath (id) {
    return {
      colorSwatch: this.getSwatchImgPath(id),
      productImages: this.getProductImgPath(id)
    };
  }

  getSwatchImgPath (id) {
    //const IMG_HOST_DOMAIN =  'https://www.childrensplace.com';
    const {IMG_HOST_DOMAIN} = routingInfoStoreView.getOriginSettings(this.store.getState());
    return `${IMG_HOST_DOMAIN}/wcsstore/GlobalSAS/images/tcp/products/swatches/${id}.jpg`;
  }

  getProductImgPath (id) {
    //const IMG_HOST_DOMAIN =  'https://www.childrensplace.com';
    const {IMG_HOST_DOMAIN} = routingInfoStoreView.getOriginSettings(this.store.getState());

    return {
      125: `${IMG_HOST_DOMAIN}/wcsstore/GlobalSAS/images/tcp/products/125/${id}.jpg`,
      380: `${IMG_HOST_DOMAIN}/wcsstore/GlobalSAS/images/tcp/products/380/${id}.jpg`,
      500: `${IMG_HOST_DOMAIN}/wcsstore/GlobalSAS/images/tcp/products/500/${id}.jpg`,
      900: `${IMG_HOST_DOMAIN}/wcsstore/GlobalSAS/images/tcp/products/900/${id}.jpg`
    };

  }

}

export function dispatchPlpInfo (store, res, isSetNavigationInfo) {
  return store.dispatch([
    getSetCurrentListingSearchForTextActn(res.currentListingSearchForText),
    getSetCurrentListingIsDepartmentActn(res.isDepartment),
    getSetCurrentListingIdActn(res.currentListingId),
    getSetCurrentListingNameActn(res.currentListingName),
    getSetCurrentListingTypeActn(res.currentListingType),
    getSetCurrentListingSeoKeyActn(res.currentListingSeoKey),
    getSetCurrentListingTitleActn(res.currentListingTitle),
    getSetCurrentListingShortDescriptionActn(res.currentListingShortDescription),
    getSetCurrentListingDescriptionActn(res.currentListingDescription),
    getSetProductsCountActn(res.totalProductsCount),
    //getSetListingFirstProductsPageActn(res.loadedProducts),
    isSetNavigationInfo && getSetListingsBreadCrumbsActn(res.breadCrumbTrail.map((crumb) => ({
      displayName: crumb.displayName,
      destination: PAGES.productListing,
      // destination: PAGES.productListing,
      pathSuffix: crumb.urlPathSuffix
    }))),
    isSetNavigationInfo && getSetListingNavigationTreeActn(res.navitagionTree),
    getListingSetFiltersMapsActn(res.filtersMaps),
    getListingSetAppliedFiltersIdsActn(res.appliedFiltersIds),
    getListingSetAppliedSortActn(res.appliedSortId),
    getListingSetOutfitListingIdentifierActn(res.outfitStyliticsTag)
  ]);
}

export function getPlpCutomizersFromUrlQueryString (urlQueryString) {
  let {colors, sizes, departments, subDepartments, sort} = queryString.parse(urlQueryString);

  return {
    colorFilterIdsList: colors ? colors.split(',') : [],
    sizeFiltersIdsList: sizes ? sizes.split(',') : [],
    departmentFiltersIdsList: departments ? departments.split(',') : [],
    subDepartmentFiltersIdsList: subDepartments ? subDepartments.split(',') : [],
    sortId: sort
  };
}

export function getPlpUrlQueryValues (urlQueryString, filtersAndSort) {
  let {colorFilterIdsList, sizeFiltersIdsList, departmentFiltersIdsList, subDepartmentFiltersIdsList, sortId} = filtersAndSort;
  let {colors, sizes, departments, subDepartments, sort,                    // eslint-disable-line no-unused-vars
    ...otherParams} = queryString.parse(urlQueryString);

  // NOTE: these are parameters on query string we don't handle (nor we need to)
  // just pass them to the abstractor
  let urlQueryValues = otherParams;

  // wrapped in 'if' because it's not good to have empty values
  // otherwise we could end up with multiple urls for the same thing: /c/catId and /c/catId?colors=&sizes=&sort=
  if (colorFilterIdsList && colorFilterIdsList.length) {
    urlQueryValues.colors = colorFilterIdsList.join(',');
  }

  if (sizeFiltersIdsList && sizeFiltersIdsList.length) {
    urlQueryValues.sizes = sizeFiltersIdsList.join(',');
  }

  if (departmentFiltersIdsList && departmentFiltersIdsList.length) {
    urlQueryValues.departments = departmentFiltersIdsList.join(',');
  }

  if (subDepartmentFiltersIdsList && subDepartmentFiltersIdsList.length) {
    urlQueryValues.subDepartments = subDepartmentFiltersIdsList.join(',');
  }

  if (sortId) {       // this also covers the fake sortId describing the default server sort (which we give a falsy value like 0)
    urlQueryValues.sort = sortId;
  }

  return urlQueryValues;
}

function isOnSeoPlp () {
  if (!isClient()) return false;

  let match = matchPath(window.location.pathname, {path: PAGES.productListing.pathPattern});
  return !!match && !!match.params.pageNumber; // search would return null
}

function isFiltered (filtersAndSort) {
  return filtersAndSort.colorFilterIdsList.length !== 0 ||
    filtersAndSort.sizeFiltersIdsList.length !== 0 ||
    filtersAndSort.departmentFiltersIdsList.length !== 0 ||
    filtersAndSort.subDepartmentFiltersIdsList.length !== 0;
}

// Note: see documentation of the functrion convertMultipleSizeSkusToAlternatives
// in ProductsDynamicAbstractor.js for a description of the "multiple SKU problem" and the meaning of the alternativeSkus field in the map entry
function getPatchColorFitsSizesMap (colorFitsSizesMapEntry, colorExtraInfo) {
  let productsInventoryTable = Object.create(null);
  for (let inventoryEntry of colorExtraInfo.inventory) {
    productsInventoryTable[inventoryEntry.skuId] = inventoryEntry.inventory;
  }

  let newColorOptionsMap = Object.assign({}, Immutable.asMutable(colorFitsSizesMapEntry, {deep: true}));
  newColorOptionsMap.maxAvailable = 0;
  newColorOptionsMap.favoritedCount = colorExtraInfo.favoritesCounter;
  for (let fitEntry of newColorOptionsMap.fits) {
    fitEntry.maxAvailable = 0;
    for (let sizeEntry of fitEntry.sizes) {
      sizeEntry.maxAvailable = productsInventoryTable[sizeEntry.skuId] || 0; // as per DT-27820, if the inventory entry is not available, resolve to 0

      // Following code is needed due to the multiple SKUs problem
      // this code makes maxAvailable and skuid for this size entry be those of the skuid with the largest inventory for this size
      if (sizeEntry.alternativeSkuIds) {
        for (let alternativeSkuId of sizeEntry.alternativeSkuIds) {
          if (sizeEntry.maxAvailable < productsInventoryTable[alternativeSkuId]) {
            sizeEntry.maxAvailable = productsInventoryTable[alternativeSkuId];
            sizeEntry.skuId = alternativeSkuId;
          }
        }
      }
      //

      if (fitEntry.maxAvailable < sizeEntry.maxAvailable) {
        fitEntry.maxAvailable = sizeEntry.maxAvailable;
        if (newColorOptionsMap.maxAvailable < sizeEntry.maxAvailable) {
          newColorOptionsMap.maxAvailable = sizeEntry.maxAvailable;
        }
      }
    }
  }
  return newColorOptionsMap;
}
