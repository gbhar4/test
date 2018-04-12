export function getSetQuickviewProductActn (quickViewProduct) {
  return {
    quickViewProduct,
    type: 'QUICKVIEW_SET_PRODUCT'
  };
}

export function getSetQuickViewRequestInfoActn (quickViewRequestInfo) {
  return {
    quickViewRequestInfo,
    type: 'QUICKVIEW_SET_REQUESTED_PRODUCT_ID'
  };
}

export function getClearQuickviewProductActn () {
  return {
    quickViewRequestInfo: {},
    type: 'QUICKVIEW_SET_REQUESTED_PRODUCT_ID'
  };
}

export function getSetQuickviewProductOptionsForColorActn (colorProductId, colorOptionsMap) {
  return {
    colorProductId,
    colorOptionsMap,
    type: 'QUICKVIEW_SET_OPTIONS_FOR_COLOR'
  };
}

export function getSetLastAddedToBagItemActn (lastAddedToBagItem) {
  return {
    lastAddedToBagItem,
    type: 'QUICKVIEW_SET_LAST_ADDED_TO_BAG_ITEM'
  };
}

export function getForgetLastAddedToBagItemActn () {
  return {
    undefined,
    type: 'QUICKVIEW_SET_LAST_ADDED_TO_BAG_ITEM'
  };
}
