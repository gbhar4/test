/**
 * @module productListingStoreView
 * @author Gabriel Gomez
 */
import {routingStoreView} from 'reduxStore/storeViews/routing/routingStoreView';
import {routingConstants} from 'routing/routingConstants.js';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {PAGES} from 'routing/routes/pages';

export const productListingStoreView = {
  getListingSearchText,
  getIsDepartmentLanding,
  getListingId,
  getListingDisplayName,
  getListingType,
  getListingTitle,
  getListingDescription,
  getListingShortDescription,
  getListingSeoKey,
  getEspotByCategory,
  getLoadedProductsPages,
  getTotalProductsCount,
  getLoadedProductsCount,
  getPageSize,
  getLastLoadedPageNumber,
  getMaxPageNumber,
  getBreadcrumbs,
  getNavigationTree,
  getFiltersMaps,
  getAvailableSortsMap,
  getAppliedFilterIds,
  getAppliedSort,
  getOutfitListingIdentifier,
  getSearchEspotKey,
  isShowDepartmentFilterSelector,
  isShowSubDepartmentFilterSelector,
  getIsShowCategoryGrouping,
  getUniqueGridBlockId
};
export const SORT_OPTIONS_MAP_US = [
  {displayName: 'Best Match', id: ''},       // this id must be falsy, as it designates the default sorting, and is not passed to server
  {displayName: 'New Arrivals', id: '5'},
  {displayName: 'Price: Low to High', id: '3'},
  {displayName: 'Price: High to Low', id: '4'},
  {displayName: 'Most Favorited', id: '7'}
];

export const SORT_OPTIONS_MAP_CA = [
  {displayName: 'Best Match', id: ''},       // this id must be falsy, as it designates the default sorting, and is not passed to server
  {displayName: 'New Arrivals', id: '6'},
  {displayName: 'Price: Low to High', id: '3'},
  {displayName: 'Price: High to Low', id: '4'},
  {displayName: 'Most Favorited', id: '7'}
];

// #if !STATIC2
const PRODUCTS_PER_LOAD = 20;      // the number of products to load on each call to BE (as the user scrolls)
// #endif
// #if STATIC2
const PRODUCTS_PER_LOAD = 4;      // eslint-disable-line no-redeclare
// #endif
export {PRODUCTS_PER_LOAD};

function getListingSearchText (state) {
  return state.productListing.currentListingSearchForText;
}

function getIsDepartmentLanding (state) {
  return state.productListing.isDepartment;
}

function getOutfitListingIdentifier (state) {
  return state.productListing.outfitListingIdentifier;
}

function getListingId (state) {
  return state.productListing.currentListingId;
}

function getListingSeoKey (state) {
  return state.productListing.currentListingSeoKey;
}

function getListingDisplayName (state) {
  return state.productListing.currentListingName;
}

function getListingType (state) {
  return state.productListing.currentListingType;
}

function getListingTitle (state) {
  return state.productListing.currentListingTitle;
}

function getListingShortDescription (state) {
  return state.productListing.currentListingShortDescription;
}

function getListingDescription (state) {
  return state.productListing.currentListingDescription;
}

function getEspotByCategory (state) {
  /** More info see chore: DT-23850 / DT-23852 */
  let espotName = getBreadcrumbs(state).map((breadcrumb) => breadcrumb.displayName.replace(/[\W]+/g, '')).join(':');

  return [
    {contentSlotName: 'DT_' + espotName + '_Header'},
    {contentSlotName: 'DT_' + espotName + '_Espot2'},
    {contentSlotName: 'DT_' + espotName + '_Espot3'}
  ];
}

function getLoadedProductsPages (state) {
  return state.productListing.loadedProductsPages;
}

function getLoadedProductsCount (state) {
  return state.productListing.loadedProductsPages.reduce((sum, item) => item.length + sum, 0);
}

function getPageSize (state) {
  return PRODUCTS_PER_LOAD;
}

function getLastLoadedPageNumber (state) {
  // note that we do not assume all pages have the same size, to protect against BE returning less products then requested.
  return Math.ceil(getLoadedProductsCount(state) / getPageSize(state));
}

function getMaxPageNumber (state) {
  return Math.ceil(state.productListing.totalProductsCount / getPageSize(state));
}

function getTotalProductsCount (state) {
  return state.productListing.totalProductsCount;
}

function getBreadcrumbs (state) {
  return state.productListing.breadcrumbs;
}

function getNavigationTree (state) {
  return state.productListing.navigationTree;
}

function getFiltersMaps (state) {
  return state.productListing.filtersMaps;
}

function getAvailableSortsMap (state) {
  return sitesAndCountriesStoreView.getCurrentSiteId(state) === routingConstants.siteIds.us
    ? SORT_OPTIONS_MAP_US
    : SORT_OPTIONS_MAP_CA;
}

function getAppliedFilterIds (state) {
  return state.productListing.appliedFiltersIds;
}

function getAppliedSort (state) {
  return state.productListing.appliedSortId || getAvailableSortsMap(state)[0].id;
}

function getIsShowCategoryGrouping (state) {
  let isL2Category = getBreadcrumbs(state).length === 2;
  let isNotAppliedSort = !state.productListing.appliedSortId;
  let appliedFilters = getAppliedFilterIds(state);
  let isNotAppliedFilter = appliedFilters.departments.length === 0 &&
    appliedFilters.subDepartments.length === 0 &&
    appliedFilters.colors.length === 0 &&
    appliedFilters.sizes.length === 0;

  return isL2Category && isNotAppliedSort && isNotAppliedFilter;
}

function getSearchEspotKey (state) {
  let appliedFilters = getAppliedFilterIds(state);
  let espotSearchTerm = getListingSearchText(state);

  let departmentFilterId = appliedFilters.departments.length && appliedFilters.departments[0];
  let subDepartmentFilterId = appliedFilters.subDepartments.length && appliedFilters.subDepartments[0];

  if (departmentFilterId) {
    espotSearchTerm += `_${departmentFilterId}`;
  }

  if (subDepartmentFilterId) {
    espotSearchTerm += `_${subDepartmentFilterId}`;
  }

  return espotSearchTerm && espotSearchTerm.replace(/ /g, '_');
}

function isShowDepartmentFilterSelector (state) {
  return routingStoreView.getCurrentPageId(state) === PAGES.search.id &&
    getAppliedFilterIds(state).departments.length === 0;
}

function isShowSubDepartmentFilterSelector (state) {
  return routingStoreView.getCurrentPageId(state) === PAGES.search.id &&
    getAppliedFilterIds(state).subDepartments.length === 0;
}

function getUniqueGridBlockId (state) {
  let {departments, subDepartments, colors, sizes} = getAppliedFilterIds(state);
  return `${departments.length}_${subDepartments.length}_${colors.length}_${sizes.length}_${state.productListing.appliedSortId || 0}`;
}
