/** @module variablesMethods
 * @summary exposes methods for obtaining template variables for rendering server-side HTML by methods in getHtmlMethods.js.
 *
 * @author Ben
 */
import {routingStoreView} from 'reduxStore/storeViews/routing/routingStoreView.js';
import {productDetailsStoreView} from 'reduxStore/storeViews/productDetailsStoreView.js';
import {getMapSliceForColorProductId} from 'util/viewUtil/productsCommonUtils.js';
import {productListingStoreView} from 'reduxStore/storeViews/productListingStoreView.js';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView';
import {matchPath} from 'react-router';
import {SERVER_PAGES} from '../serverPages';
import {CONTENT_PAGE_CUSTOM_ESPOT_NAME} from 'reduxStore/storeReducersAndActions/general/general';
import {storesStoreView} from 'reduxStore/storeViews/storesStoreView.js';

export const VARIABLES_METHODS = {
  getNotFoundPageVariables,
  getDefaultVariables,
  getNoVariables,
  getHomepageVariables,
  getProductListingVariables,
  getProductDetailsVariables,
  getContentVariables,
  getStoreDetailsVariables
};

const ALT_URL_PREFIXES = {
  'en-us': 'https://www.childrensplace.com/us',
  'es-us': 'https://es.childrensplace.com/us',
  'en-ca': 'https://childrensplace.com/ca',
  'fr-ca': 'https://fr.childrensplace.com/ca'
};

function getCanonicalUrl (store, pageId, pathSuffix) {
  let storeState = store.getState();
  let locationWithNoRedirectBase = routingStoreView.getLocationFromPageInfo(storeState, {page: SERVER_PAGES[pageId].routingInfo, pathSuffix}, '');
  let location = {...locationWithNoRedirectBase, pathname: routingStoreView.getRedirectBase(storeState) + locationWithNoRedirectBase.pathname};
  return routingStoreView.getFullUrlForLocation(storeState, location);
}

function getCanonicalUrlAndAltLangs (store, pageId, pathSuffix) {
  let storeState = store.getState();
  let locationWithNoRedirectBase = routingStoreView.getLocationFromPageInfo(storeState, {page: SERVER_PAGES[pageId].routingInfo, pathSuffix}, '');
  let location = {...locationWithNoRedirectBase, pathname: routingStoreView.getRedirectBase(storeState) + locationWithNoRedirectBase.pathname};
  return {
    canonicalUrl: routingStoreView.getFullUrlForLocation(storeState, location),
    langs: Object.keys(ALT_URL_PREFIXES).map((id) => ({
      id,
      canonicalUrl: ALT_URL_PREFIXES[id] + locationWithNoRedirectBase.pathname
    }))
  };
}

function getNotFoundPageVariables (store, req, pageId) {
  return Promise.resolve({
    title: "Kids Clothes & Baby Clothes | The Children's Place | $10 Off*",
    description: "Check out The Children's Place for a great selection of kids clothes, baby clothes & more. Shop at the PLACE where big fashion meets little prices!"
  });
}

function getDefaultVariables (store, req, pageId) {
  return Promise.resolve({
    title: "Kids Clothes & Baby Clothes | The Children's Place | $10 Off*",
    description: "Check out The Children's Place for a great selection of kids clothes, baby clothes & more. Shop at the PLACE where big fashion meets little prices!",
    robots: 'index',
    ...getCanonicalUrlAndAltLangs(store, pageId)
  });
}

function getNoVariables (store, req, pageId) {
  return Promise.resolve({});
}

function getHomepageVariables (store, req, pageId) {
  return getDefaultVariables(store, req, pageId);
}

function getProductListingVariables (store, req, pageId) {
  let storeState = store.getState();
  let categoryPathSufix = productListingStoreView.getListingSeoKey(storeState) || productListingStoreView.getListingId(storeState);
  let maxPages = productListingStoreView.getMaxPageNumber(storeState);
  let currentPage = !isNaN(req.params.pageNumber) ? Math.max(parseInt(req.params.pageNumber), 1) : 1;
  let categoryDisplayName = productListingStoreView.getListingDisplayName(storeState);
  let categoryTitle = productListingStoreView.getListingTitle(storeState);
  let categoryDescription = productListingStoreView.getListingShortDescription(storeState);
  let isDepartmentLanding = productListingStoreView.getIsDepartmentLanding(storeState);

  return Promise.resolve({
    title: categoryTitle || (categoryDisplayName + " | The Children's Place"),
    description: categoryDescription || "Check out The Children's Place for a great selection of kids clothes, baby clothes & more. Shop at the PLACE where big fashion meets little prices!",
    robots: 'index',
    prev: (!isDepartmentLanding && currentPage > 1) ? getCanonicalUrl(store, pageId, `${categoryPathSufix}/${Math.min(currentPage, maxPages) - 1}`) : null,
    next: (!isDepartmentLanding && currentPage < maxPages) ? getCanonicalUrl(store, pageId, `${categoryPathSufix}/${currentPage + 1}`) : null,
    ...getCanonicalUrlAndAltLangs(store, pageId, currentPage > 1 ? `${categoryPathSufix}/${currentPage}` : categoryPathSufix)
  });
}

function getProductDetailsVariables (store, req, pageId) {
  let storeState = store.getState();
  let currentColorProductId = productDetailsStoreView.getCurrentColorProductId(storeState);
  let productInfo = productDetailsStoreView.getCurrentProduct(storeState);

  let titlePrefix = productInfo.name;
  let colorProduct = getMapSliceForColorProductId(productInfo.colorFitsSizesMap, currentColorProductId);
  let images = productInfo.imagesByColor[colorProduct.color.name].extraImages;

  return Promise.resolve({
    title: titlePrefix + " | The Children's Place",
    description: productInfo.shortDescription,
    robots: 'index',
    imageUrl: images.length ? images[0].regularSizeImageUrl : null,
    ...getCanonicalUrlAndAltLangs(store, pageId,
      matchPath(productInfo.pdpUrl, {path: SERVER_PAGES[pageId].routingInfo.pathPattern}).params.productKey)
  });
}

function getContentVariables (store, req, pageId) {
  let storeState = store.getState();
  let {extraInfo: {
    title,
    longDescription
  }} = generalStoreView.getEspotByName(storeState, CONTENT_PAGE_CUSTOM_ESPOT_NAME);

  return Promise.resolve({
    ...getDefaultVariables(store, req, pageId),
    title: title,
    description: longDescription
  });
}

function getStoreDetailsVariables (store, req, pageId) {
  let storeState = store.getState();
  let { basicInfo: {
    storeName,
    address: {
      city
    }
  } } = storesStoreView.getCurrentStore(storeState);

  return Promise.resolve({
    ...getDefaultVariables(store, req, pageId),
    title: `Kid’s Clothes Store in ${city} | ${storeName} | The Children’s Place`,
    description: `Looking for kid’s clothing in ${city}? Visit The Children’s Place at ${storeName} to find the perfect look and size at the best price.`
  });
}
