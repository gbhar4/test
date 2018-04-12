import {logErrorAndServerThrow} from './operatorHelper';
import {getR3Abstractor} from 'service/R3ServiceAbstractor';
import {
  getSetReservationsHistoryPageActn,
  getSetReservationsHistoryTotalPagesActn,
  getSetSubmittedReservationDetails
} from 'reduxStore/storeReducersAndActions/user/user';
import {bindAllClassMethodsToThis} from 'util/bindAllClassMethodsToThis';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {reservationsStoreView} from 'reduxStore/storeViews/reservationsStoreView.js';
import {userStoreView} from 'reduxStore/storeViews/userStoreView.js';

let previous = null;
export function getReservationsOperator (store) {
  if (!previous || previous.store !== store) {
    previous = new ReservationsOperator(store);
  }
  return previous;
}

class ReservationsOperator {
  constructor (store) {
    this.store = store;

    bindAllClassMethodsToThis(this);
  }

  get r3ServiceAbstractor () {
    return getR3Abstractor(routingInfoStoreView.getApiHelper(this.store.getState()));
  }

  getReservationsHistoryPage (pageNumber, useCache = true) {
    if (useCache) {
      let cachedReservationsPages = reservationsStoreView.getReservationsHistoryPages(this.store.getState());
      if (cachedReservationsPages[pageNumber - 1]) {
        return new Promise((resolve) => resolve());
      }
    }
    return this.r3ServiceAbstractor.getReservationHistory(pageNumber).then((res) => {
      return this.store.dispatch([
        getSetReservationsHistoryTotalPagesActn(res.totalPages),
        getSetReservationsHistoryPageActn(pageNumber, res.reservations)
      ]);
    }).catch((err) => {
      logErrorAndServerThrow(this.store, 'getReservationsHistoryPage', err);
    });
  }

  getSubmittedReservationDetails (reservationId, emailAddress) {
    let currentUserEmail = userStoreView.getUserEmail(this.store.getState());

    // Clear the order in the store while we're loading the new one from
    // back-end, to avoid showing the wrong order while loading or if the next
    // service call fails.
    this.store.dispatch(getSetSubmittedReservationDetails(null));
    return this.r3ServiceAbstractor.reservationLookUp(reservationId, emailAddress || currentUserEmail).then((res) => {
      return this.store.dispatch(getSetSubmittedReservationDetails(res));
    }).catch((err) => {
      logErrorAndServerThrow(this.store, 'getSubmittedReservationDetails', err);
    });
  }
}
