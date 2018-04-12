import Immutable from 'seamless-immutable';

let defaultPointsHistoryStore = Immutable({
  pages: [
    // undefined (page 1)
    // [{date: '', type: '', amount: ''}] (page 2)
  ],
  totalPages: 0
});

export function pointsHistoryReducer (pointsHistory = defaultPointsHistoryStore, action) {
  switch (action.type) {
    case 'USER_POINTS_HISTORY_SET_TOTAL_PAGES':
      return Immutable.merge(pointsHistory, {totalPages: action.totalPages});
    case 'USER_POINTS_HISTORY_SET_PAGE':
      let pages = Immutable.asMutable(pointsHistory.pages);
      pages[action.pageNumber - 1] = action.pagePoints;
      return Immutable.merge(pointsHistory, {pages: Immutable(pages)});
    default:
      return pointsHistory;
  }
}

export * from './actionCreators';
