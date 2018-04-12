/** @module productsCommonUtils
 * @summary product related utility functions.
 *
 * @author Ben
 */

export function getIconImageForColor (productInfo, colorId) {
  if (!productInfo.imagesByColor) return null;

  let imagesByColorEntry = productInfo.imagesByColor[colorId] || productInfo.imagesByColor[Object.keys(productInfo.imagesByColor)[0]];
  return imagesByColorEntry.extraImages && imagesByColorEntry.extraImages[0]
    ? imagesByColorEntry.extraImages[0].iconSizeImageUrl
    : imagesByColorEntry.basicImageUrl;
}

export function getSkuId (colorFitsSizesMap, color, fit, size) {
  let currentSizeEntry = getMapSliceForSize(colorFitsSizesMap, color, fit, size);
  return currentSizeEntry && currentSizeEntry.skuId;
}

/**
 * Returns the list and offer prices corresponding to the sku with the given color, fit and size.
 */
export function getPrices (productInfo, color, fit, size) {
  let currentSizeEntry = getMapSliceForSize(productInfo.colorFitsSizesMap, color, fit, size);
  if (currentSizeEntry && currentSizeEntry.listPrice) {
    return {listPrice: currentSizeEntry.listPrice, offerPrice: currentSizeEntry.offerPrice};
  }

  let currentColorEntry = getMapSliceForColor(productInfo.colorFitsSizesMap, color);
  if (currentColorEntry && currentColorEntry.listPrice) {
    return {listPrice: currentColorEntry.listPrice, offerPrice: currentColorEntry.offerPrice};
  }

  return {listPrice: productInfo.listPrice, offerPrice: productInfo.offerPrice};
}

/**
 * @return the first element in the colorFitsSizesMap array that corresponds to the given colorName.
 */
export function getMapSliceForColor (colorFitsSizesMap, colorName) {
  return colorFitsSizesMap.find((entry) => entry.color.name === colorName);
}

/**
 * @return the first element in the colorFitsSizesMap array that corresponds to the given colorProductId.
 */
export function getMapSliceForColorProductId (colorFitsSizesMap, colorProductId) {
  return colorFitsSizesMap.find((entry) => entry.colorProductId === colorProductId || entry.colorDisplayId === colorProductId);
}

/**
 * @return the element flagged as default (or the first one) on the fits array
 */
export function getDefaultFitForColorSlice (colorFitsSizesMapEntry) {
  return colorFitsSizesMapEntry.fits.find((fit) => fit.isDefault && fit.maxAvailable > 0) ||
    colorFitsSizesMapEntry.fits.find((fit) => fit.maxAvailable > 0) ||
    colorFitsSizesMapEntry.fits[0];
}

/**
 * @return if the product has a single fit with a single size common to all colors then return that common sizeName;
 * otherwise return the empty string.
 */
export function getDefaultSizeForProduct (colorFitsSizesMap) {
  let firstSizeName = colorFitsSizesMap[0].fits[0].sizes[0].sizeName;
  for (let colorEnrtry of colorFitsSizesMap) {
    if (colorEnrtry.fits.length > 1 || colorEnrtry.fits[0].sizes.length > 1 || colorEnrtry.fits[0].sizes[0].sizeName !== firstSizeName) {
      return '';
    }
  }
  return firstSizeName;
}

/**
 * @return the first element in the getMapSliceForColor(colorFitsSizesMap, colorName).fits array that corresponds to the given fit.
 * If there are no fits associated with the given color, then the first element in the array is returned.
 */
export function getMapSliceForFit (colorFitsSizesMap, colorName, fitName) {
  let currentColorEntry = getMapSliceForColor(colorFitsSizesMap, colorName);
  if (!currentColorEntry) { return; }
  if (currentColorEntry.hasFits) {
    return currentColorEntry.fits.find((entry) => entry.fitName === fitName);
  } else {
    return currentColorEntry.fits[0];
  }
}

export function getMapSliceForSize (colorFitsSizesMap, colorName, fitName, sizeName) {
  let currentFitEntry = getMapSliceForFit(colorFitsSizesMap, colorName, fitName);
  if (!currentFitEntry) return;
  return currentFitEntry.sizes.find((entry) => entry.sizeName === sizeName);
}
