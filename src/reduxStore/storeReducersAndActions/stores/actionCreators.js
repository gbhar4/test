/** @module
 * @summary action creators for manipulating stores related information.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

export function getSetCurrentStoreActn (store) {
  return {
    store: store,
    type: 'STORES_SET_CURRENT_STORE'
  };
}

export function getSetDefaultStoreActn (store) {
  return {
    store: store,
    type: 'STORES_SET_DEFAULT_STORE'
  };
}

export function getSetSuggestedStoresActn (suggestedStores) {
  return {
    suggestedStores: suggestedStores,
    type: 'STORES_SET_SUGGESTED_STORES'
  };
}

export function getSetStoresSummaryUSActn (storesListSummary) {
  return {
    storesListSummary: storesListSummary,
    type: 'STORES_SET_STORES_SUMMARY_US'
  };
}

export function getSetStoresSummaryCAActn (storesListSummary) {
  return {
    storesListSummary: storesListSummary,
    type: 'STORES_SET_STORES_SUMMARY_CA'
  };
}

export function getSetStoresSummaryOtherActn (storesListSummary) {
  return {
    storesListSummary: storesListSummary,
    type: 'STORES_SET_STORES_SUMMARY_OTHER'
  };
}

export function getSetBopisStoresOnCartActn (bopisStoresOnCart) {
  return {
    bopisStoresOnCart: bopisStoresOnCart,
    type: 'STORES_SET_BOPIS_ON_CART'
  };
}
