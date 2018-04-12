import {combineReducers} from 'redux';
import {siteDetailsReducer} from './siteDetails/reducer';
import {siteOptionsReducer} from './siteOptions/reducer';

const sessionReducer = combineReducers(
  {
    siteDetails: siteDetailsReducer,
    siteOptions: siteOptionsReducer
  }
);

export * from './siteDetails/actionCreators';
export * from './siteOptions/actionCreators';
export { sessionReducer };
