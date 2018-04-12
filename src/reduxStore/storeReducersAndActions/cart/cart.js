import {combineReducers} from 'redux';
import {summaryReducer} from './summary/reducer';
import {AVAILABILITY, itemsReducer} from './items/reducer';
import {operationsReducer} from './uiFlags/reducer';

const cartReducer = combineReducers(
  {
    summary: summaryReducer,
    items: itemsReducer,
    uiFlags: operationsReducer          // FIXME: fix it everywhere
  }
);

export * from './summary/actionCreators';
export * from './items/actionCreators';
export * from './uiFlags/actionCreators';
export {AVAILABILITY, cartReducer};
