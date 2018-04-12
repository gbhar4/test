import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {getSubmissionError} from '../operatorHelper';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {getTcpStoresAbstractor} from 'service/tcpStoresServiceAbstractor';
import {calculateLocationDistances} from '../storesOperator';
import {getVendorAbstractors} from 'service/vendorServiceAbstractor';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {storesStoreView} from 'reduxStore/storeViews/storesStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';
import {getSetDefaultStoreActn, getSetSuggestedStoresActn, BOPIS_ITEM_AVAILABILITY} from 'reduxStore/storeReducersAndActions/stores/stores';

const EMPTY_ARRAY = [];

let previous = null;

export function getStoresFormOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new StoresFormOperator(store);
  }
  return previous;
}

class StoresFormOperator {
  constructor (store) {
    this.store = store;
    bindAllClassMethodsToThis(this);
  }

  get tcpStoresAbstractor () {
    return getTcpStoresAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  get vendorAbstractors () {
    return getVendorAbstractors(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  submitSetFavoriteStore (storeId) {
    let userId = userStoreView.getUserId(this.store.getState());

    // NOTE: should we reload the whole favorite store or should we just set the Id? we are losing some info such as store name/address/lat & lng
    let suggestedStore = storesStoreView.getSuggestedStoreById(this.store.getState(), storeId);
    return this.tcpStoresAbstractor.setFavoriteStore(storeId, userId)
      .then((res) => this.store.dispatch(getSetDefaultStoreActn(suggestedStore)))
      .catch((err) => {
        throw getSubmissionError(this.store, 'submitSetFavoriteStore', err);
      });
  }

  submitGetBopisSearchByLatLng (skuId, quantity, distance, locationPromise) {
    this.store.dispatch(getSetSuggestedStoresActn(EMPTY_ARRAY));     // clear previous search results
    return locationPromise
    .then((location) => this.tcpStoresAbstractor.getStoresPlusInventorybyLatLng(skuId, quantity, distance, location.lat(), location.lng(), location.country))
    .then((searchResults) => {
      this.store.dispatch(getSetSuggestedStoresActn(searchResults));
      /** distance calculated based of user input, not user location
      calculateLocationDistances(this.vendorAbstractors.calcDistanceByLatLng, searchResults).then((distances) => {
        this.store.dispatch(getSetSuggestedStoresActn(searchResults.map((location, index) => ({...location, distance: distances[index]}))));
      });
      */
    }).catch((err) => {
      throw getSubmissionError(this.store, 'submitGetBopisSearchByLatLng', err);
      // throw new SubmissionError({_error: 'We were unable to find the address you typed. Please try again.'});
    });
  }

  /* special helper method, it does not store anything, it's used to check whether the favorite store has inventory or not */
  isItemAvailableOnFavoriteStore (skuId, quantity) {
    this.store.dispatch(getSetSuggestedStoresActn(EMPTY_ARRAY));     // clear previous search results
    let storeState = this.store.getState();
    let preferredStore = storesStoreView.getDefaultStore(storeState);
    let {coordinates} = preferredStore.basicInfo;
    let currentCountry = sitesAndCountriesStoreView.getCurrentCountry(storeState);

    return this.tcpStoresAbstractor.getStoresPlusInventorybyLatLng(skuId, quantity, 25, coordinates.lat, coordinates.long, currentCountry).then((searchResults) => {
      let store = searchResults.find((storeDetails) => storeDetails.basicInfo.id === preferredStore.basicInfo.id);
      return store && store.productAvailability.status !== BOPIS_ITEM_AVAILABILITY.UNAVAILABLE;
    }).catch(() => {
      // assume not available
      return false;
    });
  }

  submitGetBopisSearchForStoresInCart (skuId, quantity) {
    this.store.dispatch(getSetSuggestedStoresActn(EMPTY_ARRAY));     // clear previous search results
    return this.tcpStoresAbstractor.getBopisStoresInCartPlusInventory(skuId, quantity)
      .then((searchResults) => {
        this.store.dispatch(getSetSuggestedStoresActn(searchResults));
        calculateLocationDistances(this.vendorAbstractors.calcDistanceByLatLng, searchResults).then((distances) => {
          this.store.dispatch(getSetSuggestedStoresActn(searchResults.map((location, index) => ({...location, distance: distances[index]}))));
        });
      }).catch((err) => {
        throw getSubmissionError(this.store, 'submitGetBopisSearchForStoresInCart', err);
      });
  }

}
