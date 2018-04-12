export const reservationsStoreView = {
  getReservationsHistoryPages,
  getReservationsHistoryTotalPages,
  getSubmittedReservationDetails,
  getReservationsHistorySummary
};

function getReservationsHistoryPages (state) {
  return state.user.reservations.historyPages;
}

function getReservationsHistoryTotalPages (state) {
  return state.user.reservations.historyTotalPages;
}

function getSubmittedReservationDetails (state) {
  return state.user.reservations.submittedReservationDetails;
}

function getReservationsHistorySummary (state, reservationId) {
  let reservationSummary;

  getReservationsHistoryPages(state).map((reservations) => {
    reservationSummary = reservationSummary || reservations.find((reservation) => reservation.reservationId === reservationId);
  });

  return reservationSummary;
}
