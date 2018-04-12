import Immutable from 'seamless-immutable';

let defaultProductDetailsStore = Immutable({
  currentProduct: null,                // the product to show
  currentColorProductId: null,         // the id of the color-level customization of the currentProduct
  currentQvProduct: undefined,
  breadcrumbs: [],
  isAddedToFavorites: false,
  currentOutfit: undefined,
  isInventoryLoaded: false
  /*
  currentOutfit: {
    outfitImageUrl:
    products: []
  }
  */
});

export function productDetailsReducer (details = defaultProductDetailsStore, action) {
  switch (action.type) {
    case 'PRODUCT_DETAILS_SET_CURRENT_OUTFIT':
      return Immutable.set(details, 'currentOutfit', action.currentOutfit);
    case 'PRODUCT_DETAILS_SET_CURRENT_PRODUCT':
      return Immutable.set(details, 'currentProduct', action.currentProduct);
    case 'PRODUCT_DETAILS_SET_CURRENT_COLOR_PRODUCT_ID':
      return Immutable.set(details, 'currentColorProductId', action.currentColorProductId);
    case 'PRODUCT_DETAILS_SET_IMAGES_BY_COLOR':
      return Immutable.setIn(details, ['currentProduct', 'imagesByColor'], action.imagesByColor);
    case 'PRODUCT_DETAILS_SET_BREADCRUMBS':
      return Immutable.set(details, 'breadcrumbs', action.breadcrumbs);
    case 'PRODUCT_DETAILS_SET_OPTIONS_FOR_COLOR':
      return Immutable.setIn(details, ['currentProduct', 'colorFitsSizesMap'],
        details.currentProduct.colorFitsSizesMap.map((colorEntry) =>
          colorEntry.colorProductId !== action.colorProductId
          ? colorEntry
          : action.colorOptionsMap
      ));
    case 'PRODUCT_DETAILS_SET_IS_ADDED_TO_FAVORITES':
      return Immutable.set(details, 'isAddedToFavorites', action.isAddedToFavorites);
    case 'PRODUCT_DETAILS_SET_OUTFIT_OPTIONS_FOR_COLOR':
      return Immutable.setIn(details, ['currentOutfit', 'products'],
        getProductsWithPatchedColorMap(details.currentOutfit.products, action.generalProductId, action.colorProductId, action.colorOptionsMap));
    case 'PRODUCT_DETAILS_OUTFIT_SET_WISHLIST_STATUS':
      return Immutable.setIn(details, ['currentOutfit', 'products'],
        getProductsWithPatchedWishlistStatus(details.currentOutfit.products, action.generalProductId, action.isInDefaultWishlist));
    case 'PRODUCT_DETAILS_SET_IS_INVENTORY_LOADED':
      return Immutable.set(details, 'isInventoryLoaded', action.isInventoryLoaded);
    default:
      return details;
  }
}

function getProductsWithPatchedColorMap (products, generalProductId, colorProductId, colorOptionsMap) {
  return products.map((product) => product.generalProductId !== generalProductId
    ? product
    : product.set('colorFitsSizesMap', product.colorFitsSizesMap.map((colorEntry) =>
        colorEntry.colorProductId !== colorProductId
        ? colorEntry
        : colorOptionsMap
      )
    )
  );
}

function getProductsWithPatchedWishlistStatus (products, generalProductId, isInDefaultWishlist) {
  return products.map((product) =>
    product.generalProductId !== generalProductId
      ? product
      : product.set('isInDefaultWishlist', isInDefaultWishlist)
  );
}

export * from './actionCreators';
