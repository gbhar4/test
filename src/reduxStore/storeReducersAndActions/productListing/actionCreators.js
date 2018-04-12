export function getSetCurrentListingSearchForTextActn (currentListingSearchForText) {
  return {
    currentListingSearchForText,
    type: 'PRODUCT_LISTING_SET_SEARCH_TEXT'
  };
}

export function getSetCurrentListingIsDepartmentActn (isDepartment) {
  return {
    isDepartment,
    type: 'PRODUCT_LISTING_SET_IS_DEPARTMENT'
  };
}

export function getSetCurrentListingIdActn (currentListingId) {
  return {
    currentListingId,
    type: 'PRODUCT_LISTING_SET_LISTING_ID'
  };
}

export function getSetCurrentListingNameActn (currentListingName) {
  return {
    currentListingName,
    type: 'PRODUCT_LISTING_SET_LISTING_NAME'
  };
}

export function getSetCurrentListingTypeActn (currentListingType) {
  return {
    currentListingType,
    type: 'PRODUCT_LISTING_SET_LISTING_TYPE'
  };
}

export function getSetCurrentListingSeoKeyActn (currentListingSeoKey) {
  return {
    currentListingSeoKey,
    type: 'PRODUCT_LISTING_SET_LISTING_SEO_KEY'
  };
}

export function getSetProductsCountActn (totalProductsCount) {
  return {
    totalProductsCount,
    type: 'PRODUCT_LISTING_SET_PRODUCTS_TOTAL_COUNT'
  };
}

export function getSetListingProductsPagesActn (loadedProductsPages) {
  return {
    loadedProductsPages,
    type: 'PRODUCT_LISTING_SET_PRODUCTS_PAGES'
  };
}

export function getSetListingFirstProductsPageActn (productsPage) {
  return {
    productsPage,
    type: 'PRODUCT_LISTING_SET_FIRST_PRODUCTS_PAGE'
  };
}

export function getAppendListingProductsPageActn (productsPage) {
  return {
    productsPage,
    type: 'PRODUCT_LISTING_APPEND_PRODUCT_PAGE'
  };
}

export function getReplaceListingProductsPageActn (productsPage, pageNumber) {
  return {
    productsPage,
    pageNumber,
    type: 'PRODUCT_LISTING_REPLACE_PRODUCT_PAGE'
  };
}

export function getSetListingsBreadCrumbsActn (breadcrumbs) {
  return {
    breadcrumbs,
    type: 'PRODUCT_LISTING_SET_BREADCRUMBS'
  };
}

export function getSetListingNavigationTreeActn (navigationTree) {
  return {
    navigationTree,
    type: 'PRODUCT_LISTING_SET_NAVIGATION_TREE'
  };
}

export function getListingSetFiltersMapsActn (filtersMaps) {
  return {
    filtersMaps,
    type: 'PRODUCT_LISTING_SET_FILTERS_MAPS'
  };
}

export function getListingSetAppliedFiltersIdsActn (appliedFiltersIds) {
  return {
    appliedFiltersIds,
    type: 'PRODUCT_LISTING_SET_APPLIED_FILTERS'
  };
}

export function getListingSetAppliedSortActn (appliedSortId) {
  return {
    appliedSortId,
    type: 'PRODUCT_LISTING_SET_APPLIED_SORT'
  };
}

export function getListingSetOutfitListingIdentifierActn (outfitListingIdentifier) {
  return {
    outfitListingIdentifier,
    type: 'PRODUCT_LISTING_SET_OUTFIT_LISTING_IDENTIFIER'
  };
}

export function getSetCurrentListingTitleActn (currentListingTitle) {
  return {
    currentListingTitle,
    type: 'PRODUCT_LISTING_SET_TITLE'
  };
}

export function getSetCurrentListingDescriptionActn (currentListingDescription) {
  return {
    currentListingDescription,
    type: 'PRODUCT_LISTING_SET_DESCRIPTION'
  };
}

export function getSetCurrentListingShortDescriptionActn (currentListingShortDescription) {
  return {
    currentListingShortDescription,
    type: 'PRODUCT_LISTING_SET_SHORT_DESCRIPTION'
  };
}
