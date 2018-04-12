import {combineReducers} from 'redux';
import {personalDataReducer} from './personalData/reducer';
import {ordersReducer} from './orders/reducer';
import {reservationsReducer} from './reservations/reducer';
import {airmilesReducer} from './airmiles/reducer';
import {rewardsReducer} from './rewards/reducer';
import {pointsHistoryReducer} from './pointsHistory/reducer';
import {PLCC_OFFER_STATUS, plccReducer} from './plcc/reducer';

const userReducer = combineReducers(
  {
    orders: ordersReducer,
    reservations: reservationsReducer,
    personalData: personalDataReducer,
    airmiles: airmilesReducer,
    rewards: rewardsReducer,
    pointsHistory: pointsHistoryReducer,
    plcc: plccReducer
  }
);

export * from './airmiles/actionCreators';
export * from './rewards/actionCreators';
export * from './personalData/actionCreators';
export * from './orders/actionCreators';
export * from './reservations/actionCreators';
export * from './pointsHistory/actionCreators';
export * from './plcc/actionCreators';
export {PLCC_OFFER_STATUS, userReducer};
