import {logErrorAndServerThrow} from './operatorHelper';
import {getSetOrderConfirmationActn} from 'reduxStore/storeReducersAndActions/confirmation/confirmation';
import {getUserAbstractor} from 'service/userServiceAbstractor';
import {getCheckoutAbstractor} from 'service/checkoutServiceAbstractor';
import {getR3Abstractor} from 'service/R3ServiceAbstractor';
import {
  getSetSiteOrdersHistoryPageActn,
  getSetSiteOrdersHistoryTotalPagesActn,
  getSetClearSiteOrdersHistoryActn,
  getSetSubmittedOrderDetailsActn,
  getSetLastOrderActn,
  getSetPickupStoreDistanceActn
} from 'reduxStore/storeReducersAndActions/user/user';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {ordersStoreView} from 'reduxStore/storeViews/ordersStoreView.js';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {getProductsOperator} from 'reduxStore/storeOperators/productsOperator.js';
import {calculateLocationDistances} from './storesOperator';
import {getVendorAbstractors} from 'service/vendorServiceAbstractor';
import {getAddressLocationInfo} from 'views/components/common/form/LabeledInputGoogleAutoComplete.jsx';

let previous = null;
export function getOrdersOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new OrdersOperator(store);
  }
  return previous;
}

class OrdersOperator {
  constructor (store) {
    this.store = store;

    bindAllClassMethodsToThis(this);
  }

  get userServiceAbstractor () {
    return getUserAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  get checkoutServiceAbstractor () {
    return getCheckoutAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  get r3ServiceAbstractor () {
    return getR3Abstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  get vendorAbstractors () {
    return getVendorAbstractors(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  trackLastOrder () {
    return this.userServiceAbstractor.getLastOrder().then((res) => {
      this.store.dispatch(getSetLastOrderActn(res.orderTrackingNumber, res.orderNumber, res.orderStatus));
    }).catch((err) => {
      logErrorAndServerThrow(this.store, 'updateLastOrder', err);
    });
  }

  getOrderConfirmation (orderId) {
    return this.checkoutServiceAbstractor.getOrderConfirmation(orderId).then((res) => {
      this.store.dispatch(getSetOrderConfirmationActn(res));
    }).catch((err) => {
      logErrorAndServerThrow(this.store, 'getOrderConfirmation', err);
    });
  }

  clearOrdersHistoryCache (site) {
    this.store.dispatch(getSetClearSiteOrdersHistoryActn());
  }

  /**
   * Retrieves one page of orders for a given site.
   */
  getSiteOrdersHistoryPage (site, pageNumber, useCache = true) {
    if (useCache) {
      let cachedOrdersPages = ordersStoreView.getSiteOrdersHistoryPages(this.store.getState(), site);
      if (cachedOrdersPages[pageNumber - 1]) {
        return new Promise((resolve) => resolve());
      }
    }
    let currentSiteId = sitesAndCountriesStoreView.getCurrentSiteId(this.store.getState());
    return this.r3ServiceAbstractor.getOrderHistory(site, currentSiteId, pageNumber).then((res) => {
      return this.store.dispatch([
        getSetSiteOrdersHistoryTotalPagesActn(site, res.totalPages),
        getSetSiteOrdersHistoryPageActn(site, pageNumber, res.orders)
      ]);
    }).catch((err) => {
      logErrorAndServerThrow(this.store, 'getSiteOrdersHistoryPage', err);
    });
  }

  getSubmittedOrderDetails (orderId, emailAddress = userStoreView.getUserEmail(this.store.getState())) {
    let storeState = this.store.getState();
    let isGuest = userStoreView.isGuest(storeState);
    let imageGenerator = getProductsOperator(this.store).getSwatchImgPath;

    // Clear the order in the store while we're loading the new one from
    // back-end, to avoid showing the wrong order while loading or if the next
    // service call fails.
    this.store.dispatch(getSetSubmittedOrderDetailsActn(null));
    return this.r3ServiceAbstractor.getOrderInfoByOrderId(orderId, emailAddress, isGuest, imageGenerator).then((res) => {
      // DT-29837 pickup store distance is not displayed.
      this.getPickUpStoreDistance(res);
      return this.store.dispatch(getSetSubmittedOrderDetailsActn(res));
    }).catch((err) => {
      logErrorAndServerThrow(this.store, 'getSubmittedOrderDetails', err);
    });
  }

  getPickUpStoreDistance (res) {
    if (res.isBopisOrder) {
      let {address, storeName} = res.checkout.pickUpStore.basicInfo;
      let addressInfo = storeName + ',' + address.city + ',' + address.state + ',' + address.zipCode;
      let storeLocationPromise = getAddressLocationInfo(addressInfo);

      storeLocationPromise.then((location) => {
        let storePosition = [{basicInfo: {coordinates: {lat: location.lat(), long: location.lng()}}}];
        calculateLocationDistances(this.vendorAbstractors.calcDistanceByLatLng, storePosition).then((response) => {
          let distance = isNaN(response[0]) ? response[0] : null;
          return this.store.dispatch(getSetPickupStoreDistanceActn(distance));
        }).catch((error) => {
          console.log(error);
        });
      });
    }
  }
}
