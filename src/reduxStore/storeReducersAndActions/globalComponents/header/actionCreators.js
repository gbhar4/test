// TODO: rename actions to start with get and end with actions
export function setNavigationTree (navigationTree) {
  return {
    navigationTree: navigationTree,
    type: 'GLOBAL_HEADER_SET_NAVTREE'
  };
}

export function setIsNavigationTreeActive (isNavigationTreeActive) {
  return {
    isNavigationTreeActive: isNavigationTreeActive,
    type: 'GLOBAL_HEADER_SET_NAV_TREE_ACTIVE'
  };
}

export function setSearchSuggestions (searchSuggestions) {
  return {
    searchSuggestions: searchSuggestions,
    type: 'GLOBAL_HEADER_SET_SEARCH_SUGGESTIONS'
  };
}

export function setActiveDrawer (activeDrawer) {
  return {
    activeDrawer: activeDrawer,
    type: 'GLOBAL_HEADER_SET_ACTIVE_DRAWER'
  };
}

export function setActiveLoginDrawerForm (activeForm) {
  return {
    activeForm: activeForm,
    type: 'GLOBAL_HEADER_SET_LOGIN_DRAWER_FORM_TYPE'
  };
}

export function setIsHamburgerMenuOpenActn (isHamburgerMenuOpen) {
  return {
    isHamburgerMenuOpen: isHamburgerMenuOpen,
    type: 'GLOBAL_HEADER_SET_HAMBURGER_MENU_OPEN'
  };
}
