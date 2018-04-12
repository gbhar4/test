import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {RoutingWindowRefresher} from './RoutingWindowRefresher.jsx';
import {getRoutingOperator} from 'reduxStore/storeOperators/routingOperator';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    onLocationChange: ownProps.onLocationChange || storeOperators.routingOperator.refreshPage
  };
}

export let RoutingWindowRefresherContainer = connectPlusStoreOperators({routingOperator: getRoutingOperator},
  mapStateToProps)(RoutingWindowRefresher);
