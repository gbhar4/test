export function getSetReservationsHistoryTotalPagesActn (totalPages) {
  return {
    totalPages,
    type: 'USER_RESERVATIONS_SET_HISTORY_TOTAL_PAGES'
  };
}

export function getSetReservationsHistoryPageActn (pageNumber, pageReservations) {
  return {
    pageReservations,
    pageNumber,
    type: 'USER_RESERVATIONS_SET_HISTORY_PAGE'
  };
}

export function getSetSubmittedReservationDetails (reservation) {
  return {
    reservation,
    type: 'USER_RESERVATIONS_SET_SUBMITTED_RESERVATION_DETAILS'
  };
}
