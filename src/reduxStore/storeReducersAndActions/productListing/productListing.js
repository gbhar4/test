import Immutable from 'seamless-immutable';

let defaultProductListingStore = Immutable({
  currentListingSearchForText: null,
  currentListingId: null,
  currentListingSeoKey: null,
  currentListingName: null,
  currentListingType: null, // needed on the store because we are idenifying category types for badging on our end
  currentListingTitle: null,
  currentListingDescription: null,
  currentListingShortDescription: null,
  isDepartment: false,
  loadedProductsPages: [],           // the products currently loaded from the server. An array of pages. Each page is an array of products.
  // the total number of available products to load as the user scrolls down (-1 indicates no attempt to laod products has been made)
  totalProductsCount: -1,
  breadcrumbs: [],
  navigationTree: [],
  filtersMaps: {
    departments: [],
    subDepartments: [],
    colors: [],
    sizes: []
  },
  appliedFiltersIds: {
    departments: [],
    subDepartments: [],
    colors: [],
    sizes: []
  },
  appliedSortId: null,
  outfitListingIdentifier: null
});

export function productListingReducer (listing = defaultProductListingStore, action) {
  switch (action.type) {
    case 'PRODUCT_LISTING_SET_SEARCH_TEXT':
      return Immutable.set(listing, 'currentListingSearchForText', action.currentListingSearchForText);
    case 'PRODUCT_LISTING_SET_IS_DEPARTMENT':
      return Immutable.set(listing, 'isDepartment', action.isDepartment);
    case 'PRODUCT_LISTING_SET_LISTING_ID':
      return Immutable.set(listing, 'currentListingId', action.currentListingId);
    case 'PRODUCT_LISTING_SET_LISTING_SEO_KEY':
      return Immutable.set(listing, 'currentListingSeoKey', action.currentListingSeoKey);
    case 'PRODUCT_LISTING_SET_LISTING_NAME':
      return Immutable.set(listing, 'currentListingName', action.currentListingName);
    case 'PRODUCT_LISTING_SET_LISTING_TYPE':
      return Immutable.set(listing, 'currentListingType', action.currentListingType);
    case 'PRODUCT_LISTING_SET_TITLE':
      return Immutable.set(listing, 'currentListingTitle', action.currentListingTitle);
    case 'PRODUCT_LISTING_SET_DESCRIPTION':
      return Immutable.set(listing, 'currentListingDescription', action.currentListingDescription);
    case 'PRODUCT_LISTING_SET_SHORT_DESCRIPTION':
      return Immutable.set(listing, 'currentListingShortDescription', action.currentListingShortDescription);
    case 'PRODUCT_LISTING_SET_PRODUCTS_TOTAL_COUNT':
      return Immutable.set(listing, 'totalProductsCount', action.totalProductsCount);
    case 'PRODUCT_LISTING_SET_PRODUCTS_PAGES':
      return Immutable.set(listing, 'loadedProductsPages', action.loadedProductsPages);
    case 'PRODUCT_LISTING_SET_FIRST_PRODUCTS_PAGE':
      return Immutable.set(listing, 'loadedProductsPages', [action.productsPage]);
    case 'PRODUCT_LISTING_APPEND_PRODUCT_PAGE':
      return Immutable.set(listing, 'loadedProductsPages', (listing.loadedProductsPages).concat([action.productsPage]));
    case 'PRODUCT_LISTING_REPLACE_PRODUCT_PAGE':
      return Immutable.set(listing, 'loadedProductsPages', (listing.loadedProductsPages).map((page, index) => index === action.pageNumber ? action.productsPage : page));
    case 'PRODUCT_LISTING_SET_BREADCRUMBS':
      return Immutable.set(listing, 'breadcrumbs', action.breadcrumbs);
    case 'PRODUCT_LISTING_SET_NAVIGATION_TREE':
      return Immutable.set(listing, 'navigationTree', action.navigationTree);
    case 'PRODUCT_LISTING_SET_FILTERS_MAPS':
      return Immutable.set(listing, 'filtersMaps', action.filtersMaps);
    case 'PRODUCT_LISTING_SET_APPLIED_FILTERS':
      return Immutable.set(listing, 'appliedFiltersIds', action.appliedFiltersIds);
    case 'PRODUCT_LISTING_SET_APPLIED_SORT':
      return Immutable.set(listing, 'appliedSortId', action.appliedSortId);
    case 'PRODUCT_LISTING_SET_OUTFIT_LISTING_IDENTIFIER':
      return Immutable.set(listing, 'outfitListingIdentifier', action.outfitListingIdentifier);
    default:
      return listing;
  }
}

export * from './actionCreators';
