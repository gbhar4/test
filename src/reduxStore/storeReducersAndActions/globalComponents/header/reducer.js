import Immutable from 'seamless-immutable';

export const DRAWER_NAMES = Immutable({
  'mini-cart': 'Cart',
  'create-account': 'Create Account',
  'login': 'Log In',
  'login-after-reset': 'Log In',
  'my-account': 'My Account',
  'password-reset': 'Reset password',
  'request-password-reset': 'Reset password',
  'password-reset-confirm': 'Reset password',
  'wishlist-login': 'Favorites List',
  '': ''
});

export const DRAWER_IDS = Immutable({
  CREATE_ACCOUNT: 'create-account',
  LOGIN: 'login',
  WISHLIST_LOGIN: 'wishlist-login',
  MINI_CART: 'mini-cart',
  MY_ACCOUNT: 'my-account',
  // PLACE_REWARDS: 'my-place-rewards',
  EMPTY: ''
});

export const LOGIN_FORM_TYPES = Immutable({
  REQUEST_PASSWORD_RESET: 'request-password-reset',
  PASSWORD_RESET: 'password-reset',
  PASSWORD_RESET_CONFIRM: 'password-reset-confirm',
  LOGIN: 'login',
  LOGIN_AFTER_PWD_RESET: 'login-after-reset'
});

let defaultHeaderStore = Immutable({
  isNavigationTreeActive: false,
  searchSuggestions: [],
  navigationTree: [],
  activeDrawer: '',                    // see DRAWER_IDS for possible values
  activeForm: LOGIN_FORM_TYPES.LOGIN,   // see LOGIN_FORM_TYPES for possible values
  activeFormName: DRAWER_NAMES[DRAWER_IDS.LOGIN],    // This is to set a default Form Header Title
  isHamburgerMenuOpen: false
});

const setNavigationTree = function (header, navigationTree) {
  return Immutable.merge(header, {navigationTree});
};

const setIsNavigationTreeActive = function (header, isNavigationTreeActive) {
  return Immutable.merge(header, {isNavigationTreeActive});
};

const setActiveDrawer = function (header, activeDrawer) {
  let activeFormName = setHeaderTitle(activeDrawer);
  return Immutable.merge(header, {activeDrawer, activeFormName});
};

const setLoginDrawerFormType = function (header, type) {
  let activeFormName = header.activeFormName;
  if (header.activeDrawer === DRAWER_IDS.LOGIN) {
    activeFormName = setHeaderTitle(header.activeDrawer, type);
  }
  return Immutable.merge(header, {activeForm: type, activeFormName});
};

const setSearchSuggestions = function (header, searchSuggestions) {
  return Immutable.merge(header, {searchSuggestions});
};

const setHeaderTitle = function (drawer, form) {
  if (drawer === DRAWER_IDS.LOGIN && !!form) {
    return DRAWER_NAMES[form];
  }
  return DRAWER_NAMES[drawer];
};

export const headerReducer = function (header = defaultHeaderStore, action) {
  switch (action.type) {
    case 'GLOBAL_HEADER_SET_NAVTREE':
      return setNavigationTree(header, action.navigationTree);
    case 'GLOBAL_HEADER_SET_NAV_TREE_ACTIVE':
      return setIsNavigationTreeActive(header, action.isNavigationTreeActive);
    case 'GLOBAL_HEADER_SET_SEARCH_SUGGESTIONS':
      return setSearchSuggestions(header, action.searchSuggestions);
    case 'GLOBAL_HEADER_SET_ACTIVE_DRAWER':
      return setActiveDrawer(header, action.activeDrawer);
    case 'GLOBAL_HEADER_SET_LOGIN_DRAWER_FORM_TYPE':
      return setLoginDrawerFormType(header, action.activeForm);
    case 'GLOBAL_HEADER_SET_HAMBURGER_MENU_OPEN':
      return Immutable.set(header, 'isHamburgerMenuOpen', action.isHamburgerMenuOpen);
    default:
      return header;
  }
};
