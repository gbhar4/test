import Immutable from 'seamless-immutable';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {routingStoreView} from 'reduxStore/storeViews/routing/routingStoreView';
import {getProductsOperator, dispatchPlpInfo, getPlpUrlQueryValues} from '../productsOperator';
import {productListingStoreView} from 'reduxStore/storeViews/productListingStoreView.js';
import {getSubmissionError, logError} from '../operatorHelper';
import {getRoutingOperator} from 'reduxStore/storeOperators/routingOperator';
import {PAGES} from 'routing/routes/pages';
import {matchPath} from 'react-router';
import {
  getSetProductOptionsForColorActn, getSetOutfitProductWishlistStatusActn, getSetIsAddedToFavoritesActn
} from 'reduxStore/storeReducersAndActions/productDetails/productDetails.js';
import {getFavoritesFormOperator} from './favoritesFormOperator';
import {productDetailsStoreView} from 'reduxStore/storeViews/productDetailsStoreView';
import {getMapSliceForColorProductId} from 'util/viewUtil/productsCommonUtils';
import {favoritesStoreView} from 'reduxStore/storeViews/favoritesStoreView.js';
import {getFavoritesOperator} from '../favoritesOperator';
import {getGeneralOperator} from 'reduxStore/storeOperators/generalOperator';
import {getSetDefaultWishListActn} from 'reduxStore/storeReducersAndActions/favorites/favorites';

let previous = null;

export function getProductsFormOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new ProductsFormOperator(store);
  }
  return previous;
}

class ProductsFormOperator {

  constructor (store) {
    this.store = store;
    bindAllClassMethodsToThis(this);
  }

  // note that may reject with an undefined to signify that the user is a gues and dismissed the login dialog
  addToDefaultWishlistAndReloadCount (generalProductId, colorProductId, skuId, quantity) {
    return getFavoritesFormOperator(this.store).submitAddItemToDefaultWishlist(skuId || colorProductId, quantity || 1, !skuId)
    .then(() => {
      let productsOperator = getProductsOperator(this.store);
      let state = this.store.getState();
      let currentProduct = productDetailsStoreView.getCurrentProduct(state);
      let defaultWishlist = favoritesStoreView.getDefaultWishlistItemIds(state);
      this.store.dispatch(getSetDefaultWishListActn({...defaultWishlist, [colorProductId]: {'isInDefaultWishlist': true}}));

      if (!currentProduct) {      // if it's outfit PDP and not a regular PDP
        this.store.dispatch(getSetOutfitProductWishlistStatusActn(generalProductId, true));
        return productsOperator.loadOutfitInventory()     // this updates the favorited count for the products
        .catch((err) => {
          logError(this.store, 'ProductsFormOperator.addToDefaultWishlistAndReloadCount', err);
        });
      } else {      // regular PDP
        this.store.dispatch(getSetIsAddedToFavoritesActn(true));

        // Note that the inventory call is the one that returns the favorited count, and is the reason we call it here
        let colorOptionsMapEntry = getMapSliceForColorProductId(currentProduct.colorFitsSizesMap, colorProductId);
        if (!colorOptionsMapEntry) throw new Error(`ProductsFormOperator.addToDefaultWishlistAndReloadCount: colorFitsSizesMap missing entry for colorProductId='${colorProductId}'`);

        return productsOperator.getUpdatedOptionsInventoryForColor(colorOptionsMapEntry, Immutable.asMutable(colorOptionsMapEntry, {deep: true}))
        .then((newColorOptionsMap) => {
          this.store.dispatch(getSetProductOptionsForColorActn(colorProductId, newColorOptionsMap));
        }).catch((err) => {
          logError(this.store, 'ProductsFormOperator.addToDefaultWishlistAndReloadCount', err);
        });
      }
    });
  }

  addToDefaultWishlist (colorProductId, skuId, quantity) {
    return getFavoritesFormOperator(this.store).submitAddItemToDefaultWishlist(skuId || colorProductId, quantity || 1, !skuId)
    .then(() => {       // if in favorites page then refresh info
      let state = this.store.getState();
      if (routingStoreView.getCurrentPageId(state) === PAGES.favorites.id) {
        let wishlists = favoritesStoreView.getWishlistsSummaries(state);
        let defaultWishlist = wishlists.find((list) => list.isDefault);
        // assumed there's always a default one (as per requirements)
        return getFavoritesOperator(this.store).loadWishlistsSummariesAndCurrent(defaultWishlist.id);
      }
    });
  }

  submitProductListingFiltersForm (formData, reloadSearchEspot) {
    let state = this.store.getState();

    let isSearchPage = routingStoreView.getCurrentPageId(state) === PAGES.search.id;
    // when there is no department filter on search plp we have to remove all other filters, and let the user start filtering from scratch
    let removeNonDepartmentFilters = isSearchPage && formData.departments.length === 0;

    // On search plp, if the applied and requested subDepartment filters both contain at most a single element, and they are not equal,
    // then we have to remove all product customization filters. (note that currently only one subDepartment filter is ever present)
    let appliedSubDepartmentFilters = productListingStoreView.getAppliedFilterIds(this.store.getState()).subDepartments;
    let removeProductCustomizationFilters = isSearchPage && formData.subDepartments.length <= 1 && appliedSubDepartmentFilters.length <= 1 &&
      (appliedSubDepartmentFilters.length !== formData.subDepartments.length ||
        appliedSubDepartmentFilters.length === 1 && appliedSubDepartmentFilters[0] !== formData.subDepartments[0]);

    let filtersAndSort = {
      departmentFiltersIdsList: isSearchPage ? formData.departments : [],
      subDepartmentFiltersIdsList: removeNonDepartmentFilters ? [] : formData.subDepartments,
      colorFilterIdsList: (removeNonDepartmentFilters || removeProductCustomizationFilters) ? [] : formData.colors,
      sizeFiltersIdsList: (removeNonDepartmentFilters || removeProductCustomizationFilters) ? [] : formData.sizes,
      sortId: formData.sort
    };
    let searchPageMatch = isSearchPage && matchPath(routingInfoStoreView.getHistory(state).location.pathname, {path: PAGES.search.pathPattern});
    let seoKey = productListingStoreView.getListingSeoKey(state);

    return getProductsOperator(this.store).getProductsListingInfo(filtersAndSort, 1)
    .then((res) => {
      dispatchPlpInfo(this.store, res, false);

      // DT-31958
      // Reload the espot if the selected department / subdepartment filter has changed
      if (isSearchPage && reloadSearchEspot) {
        let searchEspots = require('service/resources/espots/espotsVersionsTableSearchPage.json');
        let searchEspotKey = productListingStoreView.getSearchEspotKey(this.store.getState());
        getGeneralOperator(this.store).loadSearchEspots(searchEspots, searchEspotKey);
      }

      getRoutingOperator(this.store).pushLocation(isSearchPage ? PAGES.search : PAGES.productListing,
        {
          queryValues: getPlpUrlQueryValues(routingInfoStoreView.getHistory(state).location.search, filtersAndSort),
          pathSuffix: isSearchPage ? searchPageMatch.params.searchTerm : seoKey
        }
      );
    }).catch((err) => {
      throw getSubmissionError(this.store, 'submitProductListingFiltersForm', err);
    });
  }

}
