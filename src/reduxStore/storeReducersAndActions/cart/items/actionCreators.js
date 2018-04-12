// TODO: rename actions to start with get and end with actions
export function getSetCartActn (newItem) {
  return {
    newItem: newItem,
    type: 'CART_ITEMS_SET_CART'
  };
}

export function getAddItemActn (newItem) {
  return {
    newItem: newItem,
    type: 'CART_ITEMS_ADD_ITEM'
  };
}

export function getDeleteItemActn (itemId) {
  return {
    itemId: itemId,
    type: 'CART_ITEMS_DELETE_ITEM'
  };
}

export function getUpdateItemActn (itemId, newItem) {
  return {
    itemId: itemId,
    newItem: newItem,
    type: 'CART_ITEMS_UPDATE_ITEM'
  };
}

export function getSetItemOOSActn (itemId) {
  return {
    itemId,
    type: 'CART_ITEMS_SET_OOS'
  };
}

export function getSetIsUpdatingActn (itemId, isUpdating) {
  return {
    itemId: itemId,
    isUpdating: isUpdating,
    type: 'CART_ITEMS_SET_IS_UPDATING'
  };
}

export function getSetIsEditableActn (itemId, isEditable) {
  return {
    itemId: itemId,
    isEditable: isEditable,
    type: 'CART_ITEMS_SET_IS_EDITING'
  };
}

export function getSetItemColorsSizeOptionsAction (itemId, detailsOptionsMap) {
  return {
    itemId: itemId,
    detailsOptionsMap: detailsOptionsMap,
    type: 'CART_ITEMS_SET_ITEM_OPTIONS_MAP'
  };
}

export function getSetItemOptionsForColorAction (itemId, colorProductId, colorOptionsMap) {
  return {
    itemId: itemId,
    colorProductId: colorProductId,
    colorOptionsMap: colorOptionsMap,
    type: 'CART_ITEMS_SET_ITEM_OPTIONS_FOR_COLOR'
  };
}
