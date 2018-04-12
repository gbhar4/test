/**
 */
import {getAccountAbstractor} from 'service/accountServiceAbstractor';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {logErrorAndServerThrow} from './operatorHelper';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {getUserOperator} from 'reduxStore/storeOperators/userOperator';
import {getReservationsOperator} from 'reduxStore/storeOperators/reservationsOperator';
import {getOrdersOperator} from 'reduxStore/storeOperators/ordersOperator';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';

let previous = null;
export function getAccountOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new AccountOperator(store);
  }
  return previous;
}

class AccountOperator {
  constructor (store) {
    this.store = store;
    // create this-bound varsions of all methods of this class
    bindAllClassMethodsToThis(this);
  }

  get accountServiceAbstractor () {
    return getAccountAbstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  loadProfileInfoTabData () { // DT-23074
    // let pendingPromises = [];
    // let userOperator = getUserOperator(this.store);
    // pendingPromises.push(userOperator.getChildren().catch((err) => { logErrorAndServerThrow(this.store, 'loadProfileInfoTabData', err); }));
    // return Promise.all(pendingPromises);
    return getUserOperator(this.store).getChildren()
      .catch((err) => logErrorAndServerThrow(this.store, 'loadProfileInfoTabData', err));
  }

  loadReversationTabData () { // DT-23074
    return getReservationsOperator(this.store).getReservationsHistoryPage(1, false)
      .catch((err) => logErrorAndServerThrow(this.store, 'loadReversationTabData', err));
  }

  loadUSARewardsTabData () {
    return getUserOperator(this.store).getPointsHistoryPage(1, false)
      .catch((err) => { logErrorAndServerThrow(this.store, 'getPointsHistoryPage', err); });
  }

  loadOrdersTabData () {
    return getOrdersOperator(this.store).getSiteOrdersHistoryPage(sitesAndCountriesStoreView.getCurrentSiteId(this.store.getState()), 1, false)
      .catch((err) => { logErrorAndServerThrow(this.store, 'getSiteOrdersHistoryPage', err); });
  }
}
