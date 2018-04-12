/** @module
 * reducer for shopping cart items
 *
 * @author Mike Citro
 * @author Ben
 */
import Immutable from 'seamless-immutable';

export const AVAILABILITY = Immutable({
  OK: 'OK',
  SOLDOUT: 'SOLDOUT',
  UNAVAILABLE: 'UNAVAILABLE',
  SUGGESTED: 'SUGGESTED' // REVIEW: we need it to control an state to favorite's item (favorites' page).
});

let defaultItemsStore = Immutable([]);

export function itemsReducer (items = defaultItemsStore, action) {
  switch (action.type) {
    case 'CART_ITEMS_ADD_ITEM':
      return Immutable([...items, action.newItem]);
    case 'CART_ITEMS_DELETE_ITEM':
      return items.filter((item) => item.itemInfo.itemId !== action.itemId);
    case 'CART_ITEMS_UPDATE_ITEM':
      return items.map((item) => item.itemInfo.itemId !== action.itemId ? item : action.newItem);
    case 'CART_ITEMS_SET_OOS':
      return updateItemSetOOS(items, action.itemId);
    case 'CART_ITEMS_SET_IS_UPDATING':
      return setIsUpdating(items, action.itemId, action.isUpdating);
    case 'CART_ITEMS_SET_IS_EDITING':
      return setIsEditable(items, action.itemId, action.isEditable);
    case 'CART_ITEMS_SET_CART':
      return setCart(items, action.newItem);
    case 'CART_ITEMS_SET_ITEM_OPTIONS_MAP':
      return setItemColorsSizeOptions(items, action.itemId, action.detailsOptionsMap);
    case 'CART_ITEMS_SET_ITEM_OPTIONS_FOR_COLOR':
      return setColorOptions(items, action.itemId, action.colorProductId, action.colorOptionsMap);
    default:
      return items;
  }
}

function setCart (items, newItems) {
  let cartItems = Immutable(newItems);
  return cartItems.map((item) => (
    {...item, itemStatus: {isUpdating: false, isEditable: false}}
  ));
}

function updateItemSetOOS (items, itemId) {
  return items.map((item) => {
    return (item.itemInfo.itemId !== itemId)
      ? item
      : item.set('miscInfo', {...item.miscInfo, availability: AVAILABILITY.SOLDOUT});
  });
}

function setIsUpdating (items, itemId, isUpdating) {
  return items.map((item) => {
    return (item.itemInfo.itemId !== itemId)
      ? item
      : item.set('itemStatus', {...item.itemStatus, isUpdating: isUpdating});
  });
}

function setIsEditable (items, itemId, isEditable) {
  return items.map((item) => {
    return (item.itemInfo.itemId !== itemId)
      ? item.set('itemStatus', {...item.itemStatus, isEditable: false})
      : item.set('itemStatus', {...item.itemStatus, isEditable: isEditable});
  });
}

function setItemColorsSizeOptions (items, itemId, detailsOptionsMap) {
  return items.map((item) => item.itemInfo.itemId === itemId
    ? item.set('miscInfo', {...item.miscInfo, detailsOptionsMap: detailsOptionsMap})
    : item
  );
}

function setColorOptions (items, itemId, colorProductId, colorOptionsMap) {
  return items.map((item) => item.itemInfo.itemId !== itemId
    ? item
    : item.set('miscInfo', {
      ...item.miscInfo,
      detailsOptionsMap: item.miscInfo.detailsOptionsMap.map((colorEntry) =>
        colorEntry.colorProductId !== colorProductId
        ? colorEntry
        : colorOptionsMap
      )
    })
  );
}
