/** @module OrderDetailsContainer
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import {PropTypes} from 'prop-types';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {OrderDetails} from './OrderDetails.jsx';
import {ordersStoreView} from 'reduxStore/storeViews/ordersStoreView';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {getOrdersOperator} from 'reduxStore/storeOperators/ordersOperator';

const PROP_TYPES = {
  /** match prop passed by Route component */
  match: PropTypes.shape({
    params: PropTypes.object.isRequired
  }).isRequired
};

function mapStateToProps (state, ownProps, storeOperators) {
  let order = ordersStoreView.getSubmittedOrderDetails(state);

  return {
    orderId: ownProps.match && ownProps.match.params && ownProps.match.params.orderId ? ownProps.match.params.orderId : order && order.orderNumber,
    emailAddress: ownProps.match.params.emailAddress,
    onLoadOrderDetails: storeOperators.orders.getSubmittedOrderDetails,
    order: order,
    isMobile: routingInfoStoreView.getIsMobile(state),
    isGuest: userStoreView.isGuest(state)
  };
}

let OrderDetailsContainer = connectPlusStoreOperators({
  orders: getOrdersOperator
}, mapStateToProps)(OrderDetails);
OrderDetailsContainer.propTypes = {...OrderDetailsContainer.propTypes, ...PROP_TYPES};

export {OrderDetailsContainer};
