import {logErrorAndServerThrow, getSubmissionError} from './operatorHelper';
import {
  getSetSuggestedStoresActn,
  getSetCurrentStoreActn,
  getSetDefaultStoreActn,
  getSetStoresSummaryUSActn,
  getSetStoresSummaryCAActn,
  getSetBopisStoresOnCartActn
} from 'reduxStore/storeReducersAndActions/stores/stores';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {getVendorAbstractors} from 'service/vendorServiceAbstractor';
import {getTcpStoresAbstractor} from 'service/tcpStoresServiceAbstractor';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {getGeneralOperator} from 'reduxStore/storeOperators/generalOperator';
import {storesStoreView} from 'reduxStore/storeViews/storesStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';

let previous = null;

export function getStoresOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new StoresOperator(store);
  }
  return previous;
}

class StoresOperator {
  constructor (store) {
    this.store = store;
    bindAllClassMethodsToThis(this);
  }

  get tcpStoreAbstractor () {
    return getTcpStoresAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  get vendorAbstractors () {
    return getVendorAbstractors(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  loadStorePlusNearbyStores (storeId, isClientRendered) {
    let currentStoreInfo = storesStoreView.getCurrentStore(this.store.getState());
    let nearbyStores = storesStoreView.getStoresList(this.store.getState());
    let serviceArgs = {storeLocationId: storeId, getNearby: true};

    /* On the browser if we have the store, requested by nodejs, just load extra info like geoloaction */
    if (isClientRendered && currentStoreInfo.basicInfo && currentStoreInfo.basicInfo.id) {
      return loadExtraStoreInfo(this.store, currentStoreInfo, nearbyStores, this.vendorAbstractors.calcDistanceByLatLng);
    }

    /* If we do not have the store info request it */
    return this.tcpStoreAbstractor.getStoreInfoByLocationId(serviceArgs).then((res) => {
      this.store.dispatch(getSetCurrentStoreActn(res.store));
      this.store.dispatch(getSetSuggestedStoresActn(res.nearbyStores));
      /* If on the browser request extra info, geoloaction */
      if (isClientRendered) {
        loadExtraStoreInfo(this.store, res.store, res.nearbyStores, this.vendorAbstractors.calcDistanceByLatLng);
      }
    }).catch((err) => {
      // #if !STATIC2
      if (isClientRendered) {
        document.location = '/404';
      }
      // #endif

      logErrorAndServerThrow(this.store, 'StoresOperator.loadStorePlusNearbyStores', err);
    });
  }

  loadDefaultStore () {
    // Dont Load In CA Site
    if (sitesAndCountriesStoreView.getIsCanada(this.store.getState())) {
      return Promise.resolve();
    }

    return this.tcpStoreAbstractor.getFavoriteStore().then((store) => {
      this.store.dispatch(getSetDefaultStoreActn(store));
    }).catch((err) => {
      logErrorAndServerThrow(this.store, 'StoresOperator.loadDefaultStore', err);
    });
  }

  /* Runs the api to load all stores for US and CA and stores them in the redux store */
  loadAllStoresMetaData () {
    return this.tcpStoreAbstractor.getFullStoresList().then((results) => {
      this.store.dispatch([
        getSetStoresSummaryUSActn(results.usStores),
        getSetStoresSummaryCAActn(results.caStores)
      ]);
    }).catch((err) => {
      logErrorAndServerThrow(this.store, 'StoresOperator.loadAllStoresMetaData', err);
    });
  }

  loadStoresByLatLng (userLatLngPromise, limit, radius) {
    return userLatLngPromise.then(({lat, lng}) => {
      return this.tcpStoreAbstractor.getStoresByLatLng({lat: lat(), lng: lng()}, limit, radius)
        .then((searchResults) => {
          this.store.dispatch(getSetSuggestedStoresActn(searchResults));
          /* as per Melvin, DT-27147, distance is already returned by servce, and elements sorted by it, so no need to do anything
          calculateLocationDistances(this.vendorAbstractors.calcDistanceByLatLng, searchResults, {lat: lat(), lng: lng()}).then((distances) => {
            this.store.dispatch(getSetSuggestedStoresActn(searchResults.map((location, index) => ({...location, distance: distances[index]}))));
          });
          */
        });
    }).catch((err) => {
      throw getSubmissionError(this.store, 'loadStoresByLatLng', err);
    });
  }

  getBopisStoresInCart () {
    return this.tcpStoreAbstractor.getBopisStoresInCart()
      .then((searchResults) => {
        this.store.dispatch(getSetBopisStoresOnCartActn(searchResults));
      }).catch((err) => {
        logErrorAndServerThrow(this.store, 'StoresOperator.getBopisStoresInCart', err);
      });
  }

  onBopisModalMount () {
    this.store.dispatch(getSetSuggestedStoresActn([]));
    return this.getBopisStoresInCart();
  }

}

function loadExtraStoreInfo (reduxStore, store, nearbyStores, distCalcMethod) {
  loadStoreEspots(reduxStore, store.basicInfo.id, store.basicInfo.address.state, store.basicInfo.address.country);
  calculateLocationDistances(distCalcMethod, [store, ...nearbyStores]).then((distances) => {
    reduxStore.dispatch([
      getSetCurrentStoreActn({...store, distance: distances.shift()}),
      getSetSuggestedStoresActn(nearbyStores.map((location, index) => ({...location, distance: distances[index]})))
    ]);
  });
}

function loadStoreEspots (reduxStore, storeId, storeState, country) {
  let espotsTable = require('service/resources/espots/espotsVersionsTableStorePage.json');
  let generalOperator = getGeneralOperator(reduxStore);

  for (let key of Object.keys(espotsTable)) {
    espotsTable[key].nameOnServer = espotsTable[key].nameOnServer
      .replace('<StoreLocatorId>', storeId)
      .replace('<STATE_CODE_US_CANADA>', storeState)
      .replace('<country>', country);
  }

  generalOperator.loadEspots(espotsTable);
}

/**
* @function calculateLocationDistances
* @summary This method can be used to calulate update location data with relative distances from the users current possition
* @param distanceCalulationMethod - The distance calculation method we are using, currently we only have google's, see vendorAbstractors.calcDistanceByLatLng
* @param locations - locations to consider, must be an array of object each object having Object.basicInfo.coordinates
* @return This function does not return anything it will dispatch the mainLocation.action and otherLocation.action to the reduxStore appending a distance to the mainLocation and otherLocation
*/
export function calculateLocationDistances (distanceCalulationMethod, locations, zero) {
  let destinations = locations.map((location) => location.basicInfo.coordinates);
  return distanceCalulationMethod(destinations, zero);
}
