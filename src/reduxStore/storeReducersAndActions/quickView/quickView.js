import Immutable from 'seamless-immutable';

let defaultQuickViewStore = Immutable({
  quickViewRequestInfo: {
    // generalProductId: 'product-gr544r',
    // requestorKey: 'item7546'
    // showBopis: true
    // initialValues: {
    //   color: 'red'
    // }
  },
  quickViewProduct: null,
  lastAddedToBagItem: undefined
});

export function quickViewReducer (quickView = defaultQuickViewStore, action) {
  switch (action.type) {
    case 'QUICKVIEW_SET_REQUESTED_PRODUCT_ID':
      return Immutable.set(quickView, 'quickViewRequestInfo', action.quickViewRequestInfo || {});
    case 'QUICKVIEW_SET_PRODUCT':
      return Immutable.set(quickView, 'quickViewProduct', action.quickViewProduct);
    case 'QUICKVIEW_SET_OPTIONS_FOR_COLOR':
      return Immutable.setIn(quickView, ['quickViewProduct', 'colorFitsSizesMap'],
        quickView.quickViewProduct.colorFitsSizesMap.map((colorEntry) =>
          colorEntry.colorProductId !== action.colorProductId
          ? colorEntry
          : action.colorOptionsMap
      ));
    case 'QUICKVIEW_SET_LAST_ADDED_TO_BAG_ITEM':
      return Immutable.set(quickView, 'lastAddedToBagItem', action.lastAddedToBagItem);
    default:
      return quickView;
  }
}

export * from './actionCreators';
