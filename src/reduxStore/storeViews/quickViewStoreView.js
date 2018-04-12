/** @module quickViewStoreView
 *
 * @author Ben
 */
import Immutable from 'seamless-immutable';
import {getDefaultSizeForProduct, getDefaultFitForColorSlice} from 'util/viewUtil/productsCommonUtils.js';
import {productListingStoreView} from 'reduxStore/storeViews/productListingStoreView.js';

const EMPTY_OBJECT = Immutable({});

export const quickViewStoreView = {
  getQuickViewRequestInfo,
  getQuickViewProduct,
  getLastAddedToBagItem,
  getQuickViewFormInitialValues
};

function getQuickViewProduct (state) {
  return state.quickView.quickViewProduct;
}

function getQuickViewRequestInfo (state) {
  return state.quickView.quickViewRequestInfo;
}

function getLastAddedToBagItem (state) {
  return state.quickView.lastAddedToBagItem;
}

function getQuickViewFormInitialValues (state, knownInitialValues) {
  let productInfo = getQuickViewProduct(state);
  if (!productInfo) return EMPTY_OBJECT;

  let filteredValues = getQuickViewFilteredValues(state);
  knownInitialValues = knownInitialValues || getQuickViewRequestInfo(state).initialValues || {};

  let initialMapEntry = productInfo.colorFitsSizesMap.find((entry) => entry.color.name === knownInitialValues.color) ||
    productInfo.colorFitsSizesMap[0];

  return {
    color: initialMapEntry && initialMapEntry.color.name,
    fit: (initialMapEntry && initialMapEntry.hasFits) ? getDefaultFitForColorSlice(initialMapEntry).fitName : null,
    size: productInfo.isGiftCard
      ? productInfo.colorFitsSizesMap[0].fits[0].sizes[0].sizeName      // on gift card we need something selected, otherwise no price would show up
      : getDefaultSizeForProduct(productInfo.colorFitsSizesMap),
    quantity: 1,
    // these will override any of the previous values if they both exist
    ...filteredValues,
    ...knownInitialValues
  };
}

// DT-32464
// If products have been filtered by color or size, use filters to determine initial quickview values
function getQuickViewFilteredValues (state) {
  let appliedFiltersIds = productListingStoreView.getAppliedFilterIds(state);
  let {colors, sizes} = productListingStoreView.getFiltersMaps(state);
  let appliedColors = appliedFiltersIds.colors.map((colorId) => colors.find((colorOption) => colorId === colorOption.id));
  let appliedSizes = appliedFiltersIds.sizes.map((sizeId) => sizes.find((sizeOption) => sizeId === sizeOption.id));
  let filteredValues = {};

  // If only one size filter applied, set initial size to filtered size
  if (appliedSizes.length === 1) {
    filteredValues.size = appliedSizes[0].displayName;
  }

  // If only one color filter applied, set initial color to filtered color
  if (appliedColors.length === 1) {
    let {colorFitsSizesMap} = getQuickViewProduct(state);
    let colorEntry = colorFitsSizesMap.find((entry) => entry.color.family === appliedColors[0].displayName);
    filteredValues.color = colorEntry.color.name;
  }

  return filteredValues;
}
