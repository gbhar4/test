import {combineReducers} from 'redux';
import {footerReducer} from './footer/reducer';
import {headerReducer} from './header/reducer';
import {authReducer} from './auth/reducer';

const globalComponentsReducer = combineReducers({
  footer: footerReducer,
  header: headerReducer,
  auth: authReducer
});

export * from './footer/actionCreators';
export * from './header/actionCreators';
export * from './auth/actionCreators';
export {DRAWER_IDS, LOGIN_FORM_TYPES} from './header/reducer.js';
export { globalComponentsReducer };
