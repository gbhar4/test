// TODO: rename actions to start with get and end with actions
export function setTrackOrderVisible (isVisible) {
  return {
    isTrackOrderVisible: isVisible,
    type: 'GLOBAL_FOOTER_SET_TRACK_ORDER_VISIBLE'
  };
}

export function setTrackReservationVisible (isVisible) {
  return {
    isTrackReservationVisible: isVisible,
    type: 'GLOBAL_FOOTER_SET_TRACK_RESERVATION_VISIBLE'
  };
}

export function setCountrySelectorVisible (isVisible) {
  return {
    isCountrySelectorVisible: isVisible,
    type: 'GLOBAL_FOOTER_SET_COUNTRY_SELECTOR_VISIBLE'
  };
}

export function setNewsLetterSignUpConfirming (isNewsLetterSignUpConfirming) {
  return {
    isNewsLetterSignUpConfirming: isNewsLetterSignUpConfirming,
    type: 'GLOBAL_FOOTER_SET_NEWS_LETTER_CONFIRM'
  };
}

export function setNewsLetterSignUpUpdating (isNewsLetterSignUpUpdating) {
  return {
    isNewsLetterSignUpUpdating: isNewsLetterSignUpUpdating,
    type: 'GLOBAL_FOOTER_SET_NEWS_LETTER_UPDATING'
  };
}

export function setFooterNavigationTree (navigationTree) {
  return {
    navigationTree: navigationTree,
    type: 'GLOBAL_FOOTER_SET_NAVIGATION_TREE'
  };
}
