import Immutable from 'seamless-immutable';

let defaultRoutingInfo = Immutable({
  currentPage: 'home'
});

function routingReducer (routingInfo = defaultRoutingInfo, action) {
  switch (action.type) {
    case 'GENERAL_ROUTING_SET_CURRENT_PAGE':
      return Immutable.merge(routingInfo, {currentPage: action.currentPage});
    case 'GENERAL_ROUTING_SET_ERROR_CODE':
      return Immutable.merge(routingInfo, {errorCode: action.errorCode});
    default:
      return routingInfo;
  }
}

export * from './actionCreators';
export {routingReducer};
