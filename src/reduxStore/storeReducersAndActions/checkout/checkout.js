import {combineReducers} from 'redux';
import {orderOptionsReducer} from './options/reducer';
import {orderValuesReducer} from './values/reducer';
import {CHECKOUT_STAGES, flagsReducer} from './uiFlags/reducer';
import {PropTypes} from 'prop-types';

// note we cannot use Object.values since this is not yet supported in many environments (e.g., PM2)
export const CHECKOUT_STAGE_PROP_TYPE = PropTypes.oneOf(Object.keys(CHECKOUT_STAGES).map((key) => CHECKOUT_STAGES[key]));

export const checkoutReducer = combineReducers({
  options: orderOptionsReducer,
  values: orderValuesReducer,
  uiFlags: flagsReducer
});

export * from './options/actionCreators';
export * from './uiFlags/actionCreators';
export * from './values/actionCreators';
export {CHECKOUT_STAGES};
