import {combineReducers} from 'redux';
import {espotReducer} from './espots/reducer';
import {routingReducer} from './routing/reducer';
import {errorLogsReducer} from './errorLogs/reducer';
import {flagsReducer} from './uiFlags/reducer';
import {flashReducer, FLASH_TYPES} from './flash/reducer';

const generalReducer = combineReducers({
  espots: espotReducer,
  routing: routingReducer,
  errorLogs: errorLogsReducer,
  uiFlags: flagsReducer,
  flash: flashReducer
});

export {FLASH_TYPES};
export * from './errorLogs/actionCreators';
export * from './routing/actionCreators';
export * from './espots/actionCreators';
export * from './uiFlags/actionCreators';
export * from './flash/actionCreators';
export {CONTENT_PAGE_CUSTOM_ESPOT_NAME} from './espots/reducer';
export {generalReducer};
