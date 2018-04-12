export function getSetPointsHistoryTotalPagesActn (totalPages) {
  return {
    totalPages,
    type: 'USER_POINTS_HISTORY_SET_TOTAL_PAGES'
  };
}

export function getSetPointsHistoryPageActn (pageNumber, pagePoints) {
  return {
    pagePoints,
    pageNumber,
    type: 'USER_POINTS_HISTORY_SET_PAGE'
  };
}
