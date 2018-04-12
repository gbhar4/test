/** @module storesStoreView
 *
 * @author Miguel
 * @author Gabriel Gomez
*  @author Damian
 */

import {routingConstants} from 'routing/routingConstants.js';

export function getStoreIdFromUrlPathPart (pathPart) {
  let pieces = pathPart.split('-');
  return pieces[pieces.length - 1];
}

export function buildStorePageUrlSuffix (storeBasicInfo) {
  let {id, storeName, address} = storeBasicInfo;
  return [storeName, address.state, address.city, address.zipCode, id].join('-').toLowerCase().replace(/ /g, '');
}

export const storesStoreView = {
  getStoresList,
  getCurrentStore,
  getDefaultStore,
  getSuggestedStores,
  getStoresSummary,
  getBopisStoresOnCart,
  getMaxAllowedStoresInCart,
  getSuggestedStoreById,
  getDistancesMap
};

function getStoresList (state) {
  return state.stores.suggestedStores;
}

function getSuggestedStoreById (state, storeId) {
  return state.stores.suggestedStores.find((stores) => stores.basicInfo.id === storeId);
}

function getCurrentStore (state) {
  return state.stores.currentStore;
}

function getDefaultStore (state) {
  return state.stores.defaultStore;
}

function getStoresSummary (state, siteId) {
  if (siteId === routingConstants.siteIds.ca) {
    return state.stores.storesSummaryListCA;
  } else {
    return state.stores.storesSummaryListUS;
  }
}

// NOTE: used for store locator to populate store geo-location search
function getSuggestedStores (state) {
  return state.stores.suggestedStores;
}

function getBopisStoresOnCart (state) {
  return state.stores.bopisStoresOnCart;
}

function getMaxAllowedStoresInCart (state) {
  // FIXME: backend should have a flag in this regard (most likely in the killswitch service)
  return 2;
}

function getDistancesMap (state) {
  return [{
    id: '25',
    displayName: '25 miles'
  }, {
    id: '50',
    displayName: '50 miles'
  }, {
    id: '75',
    displayName: '75 miles'
  }];
}
