/** @module productDetailsStoreView
 *
 * @author Miguel
 * @author Ben
 */
import {isClient} from 'routing/routingHelper';
import {PAGES} from 'routing/routes/pages';
import {matchPath} from 'react-router';
import {getMapSliceForColorProductId} from 'util/viewUtil/productsCommonUtils.js';

export const productDetailsStoreView = {
  getCurrentOutfit,
  getCurrentProduct,
  getCurrentColorProductId,
  getCurrentProductBreadcrumbs,
  getIsAddedToFavorites,
  getCurrentVendorProductId,
  getBopisDisabledFits,
  getIsShowGoBackLinkInPdp,
  getOutfitRepresentativeProductId,
  getIsInventoryLoaded,
  getProductAllColorIds
};

const BOPIS_DISABLED_FITS = ['slim', 'husky', 'plus'];

function getProductAllColorIds (state) {
  let product = state.productDetails.currentProduct;
  let colorProductList = [];

  if (product.colorFitsSizesMap) {
    colorProductList = product.colorFitsSizesMap.map((item) => {
      return item.colorProductId;
    });
  }
  return colorProductList;
}

function getCurrentProduct (state) {
  return state.productDetails.currentProduct;
}

function getCurrentOutfit (state) {
  return state.productDetails.currentOutfit;
}

function getCurrentColorProductId (state) {
  return state.productDetails.currentColorProductId;
}

function getCurrentVendorProductId (state) {
  let generalProductId = state.productDetails.currentProduct.generalProductId;
  let vendorProductId = state.productDetails.currentProduct.colorFitsSizesMap.find(item => item.colorProductId === generalProductId);
  return vendorProductId && vendorProductId.colorDisplayId;
}

// FIXME: hash not nice, but we don't have support for DT-29489
function getCurrentProductBreadcrumbs (state) {
  if (!isClient()) return state.productDetails.breadcrumbs;

  return document.location.hash === '#ref=sr' ? [{
    displayName: 'Home',
    destination: PAGES.homePage
  }] : state.productDetails.breadcrumbs;
}

function getOutfitRepresentativeProductId (state) {
  let highestPrice = 0;
  let result = null;

  for (let product of getCurrentOutfit(state).products) {
    let productMainColorSlice = getMapSliceForColorProductId(product.colorFitsSizesMap, product.generalProductId) || product.colorFitsSizesMap[0];

    if (productMainColorSlice && productMainColorSlice.offerPrice > highestPrice) {
      highestPrice = productMainColorSlice.offerPrice;
      result = productMainColorSlice.colorDisplayId;
    }
  }

  return result;
}

/**
 * Indicates if any color or size of the currentProduct has been added to
 * favorites.
 */
function getIsAddedToFavorites (state) {
  return state.productDetails.isAddedToFavorites;
}

function getBopisDisabledFits (state) {
  return BOPIS_DISABLED_FITS;
}

// FIXME: hash not nice, but we don't have support for DT-29489
function getIsShowGoBackLinkInPdp (state) {
  if (!isClient()) return false;

  let pathname = document.referrer && document.referrer.substr(document.location.origin.length).split('?')[0];
  return !!pathname && !!matchPath(pathname, {path: PAGES.search.pathPattern}) && document.location.hash !== '#ref=sr';
}

function getIsInventoryLoaded (state) {
  return state.productDetails.isInventoryLoaded;
}
