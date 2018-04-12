/** @module
 * @summary reducer for stores related information.
 *
 * @author Miguel <malvarez@minutentag.com>
 * @author Gabriel Gomez <ggomez@minutentag.com>
 */

import Immutable from 'seamless-immutable';

/* FIXME: BOPIS declares it's own availability status, but abstractor uses cart AVAILABILITY contant. it should be consistent */
export const BOPIS_ITEM_AVAILABILITY = {
  AVAILABLE: 'OK',
  LIMITED: 'LIMITED',
  UNAVAILABLE: 'UNAVAILABLE'
};

export const STORE_TYPES = {
  RETAIL: 'Retail Store',
  OUTLET: 'Outlet'
};

const defaultStoresStore = Immutable({
  suggestedStores: [],
  currentStore: {},
  defaultStore: null,
  storesSummaryListUS: [],
  storesSummaryListCA: [],
  storesSummaryListOthers: [],
  bopisStoresOnCart: []
});

export function storesReducer (stores = defaultStoresStore, action) {
  switch (action.type) {
    case 'STORES_SET_SUGGESTED_STORES':
      return Immutable.merge(stores, {suggestedStores: action.suggestedStores});
    case 'STORES_SET_STORES_SUMMARY_US':
      return Immutable.merge(stores, {storesSummaryListUS: action.storesListSummary});
    case 'STORES_SET_STORES_SUMMARY_CA':
      return Immutable.merge(stores, {storesSummaryListCA: action.storesListSummary});
    case 'STORES_SET_STORES_SUMMARY_OTHER':
      return Immutable.merge(stores, {storesSummaryListOthers: action.storesListSummary});
    case 'STORES_SET_CURRENT_STORE':
      return Immutable.merge(stores, {currentStore: action.store});
    case 'STORES_SET_BOPIS_ON_CART':
      return Immutable.merge(stores, {bopisStoresOnCart: action.bopisStoresOnCart});
    case 'STORES_SET_DEFAULT_STORE':
      return Immutable.merge(stores, {defaultStore: action.store});
    default:
      return stores;
  }
}

export * from './actionCreators';
