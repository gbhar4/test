export function getSetCurrentOutfitActn (currentOutfit) {
  return {
    currentOutfit,
    type: 'PRODUCT_DETAILS_SET_CURRENT_OUTFIT'
  };
}

export function getSetCurrentProductActn (currentProduct) {
  return {
    currentProduct,
    type: 'PRODUCT_DETAILS_SET_CURRENT_PRODUCT'
  };
}

export function getSetCurrentColorProductIdActn (currentColorProductId) {
  return {
    currentColorProductId,
    type: 'PRODUCT_DETAILS_SET_CURRENT_COLOR_PRODUCT_ID'
  };
}

export function getSetCurrentProductBreadCrumbsActn (breadcrumbs) {
  return {
    breadcrumbs,
    type: 'PRODUCT_DETAILS_SET_BREADCRUMBS'
  };
}

export function getSetProductOptionsForColorActn (colorProductId, colorOptionsMap) {
  return {
    colorProductId,
    colorOptionsMap,
    type: 'PRODUCT_DETAILS_SET_OPTIONS_FOR_COLOR'
  };
}

export function getSetOutfitProductOptionsForColorActn (generalProductId, colorProductId, colorOptionsMap) {
  return {
    generalProductId,
    colorProductId,
    colorOptionsMap,
    type: 'PRODUCT_DETAILS_SET_OUTFIT_OPTIONS_FOR_COLOR'
  };
}

export function getSetOutfitProductWishlistStatusActn (generalProductId, isInDefaultWishlist) {
  return {
    generalProductId,
    isInDefaultWishlist,
    type: 'PRODUCT_DETAILS_OUTFIT_SET_WISHLIST_STATUS'
  };
}

export function getSetIsAddedToFavoritesActn (isAddedToFavorites) {
  return {
    isAddedToFavorites,
    type: 'PRODUCT_DETAILS_SET_IS_ADDED_TO_FAVORITES'
  };
}

export function getSetCurrentProductImagesByColorActn (imagesByColor) {
  return {
    imagesByColor,
    type: 'PRODUCT_DETAILS_SET_IMAGES_BY_COLOR'
  };
}

export function getSetIsInventoryLoadedActn (isInventoryLoaded) {
  return {
    isInventoryLoaded: isInventoryLoaded,
    type: 'PRODUCT_DETAILS_SET_IS_INVENTORY_LOADED'
  };
}
