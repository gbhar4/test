export function getSetApiHelperActn (apiHelper) {
  return {
    apiHelper: apiHelper,
    type: 'GENERAL_MUTABLE_SET_API_HELPER'
  };
}

export function getSetHistoryActn (history) {
  return {
    history: history,
    type: 'GENERAL_MUTABLE_SET_HISTORY'
  };
}

export function getClearMutableActn () {
  return {
    type: 'GENERAL_MUTABLE_CLEAR'
  };
}
