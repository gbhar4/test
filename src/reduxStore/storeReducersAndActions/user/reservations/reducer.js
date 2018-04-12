import Immutable from 'seamless-immutable';

/**
 * Possible statuses for a reservation.
 *
 * FIXME?: The values for each key use the same values
 * as ORDER_STATUS because the are a different kind of the same thing to the
 * back-end. Maybe this matter should also be abstracted behind the service
 * absctractor?
 */
export const RESERVATION_STATUS = Immutable({
  /** The reservation is placed and is in process */
  RESERVATION_RECEIVED: 'order received',
  /**
   * This status will display when the order has been canceled due to existing
   * reasoning for cancelling a reservation.
   */
  RESERVATION_CANCELED: 'canceled',
  /** An reservation is ready for the user to pick up in-store */
  ITEMS_READY_FOR_PICKUP: 'ready for pickup',
  /** The reservation has been picked up in-store */
  ITEMS_PICKED_UP: 'picked up',
  /**
   * The reservation has not been picked up within the expiration period and the user
   * will not be able to pick up the reservation.
   */
  RESERVATION_EXPIRED: 'expired'
});

let defaultReservationsStore = Immutable({
  historyPages: [
    // undefined (page 1)
    // [ (page 2)
    //  {
    //    reserveDate: '4/4/2018',
    //    expiryDate: '4/4/2018',
    //    reservationId: '58322656564',
    //    reservationStatus: 'Shipped'
    //  },
    //  ...
    // ]
  ],
  historyTotalPages: 0,
  /** complete details of an reservation already submitted by the user */
  submittedReservationDetails: null
});

const reservationsReducer = function (reservations = defaultReservationsStore, action) {
  switch (action.type) {
    case 'USER_RESERVATIONS_SET_HISTORY_TOTAL_PAGES':
      return Immutable.merge(reservations, {historyTotalPages: action.totalPages});
    case 'USER_RESERVATIONS_SET_HISTORY_PAGE':
      let pages = Immutable.asMutable(reservations.historyPages);
      pages[action.pageNumber - 1] = action.pageReservations;
      return Immutable.merge(reservations, {historyPages: Immutable(pages)});
    case 'USER_RESERVATIONS_SET_SUBMITTED_RESERVATION_DETAILS':
      return Immutable.merge(reservations, {submittedReservationDetails: action.reservation});
    default:
      return reservations;
  }
};

export * from './actionCreators';
export {reservationsReducer};
