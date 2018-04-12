/* @module BopisLastOrderStatusContainer
* @author DaMIaN <drossi@minutentag.com>
* Exports the container component for the BopisLastOrderStatus component,
*/

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {LastOrderStatus} from './LastOrderStatus.jsx';
import {ordersStoreView} from 'reduxStore/storeViews/ordersStoreView';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    order: ordersStoreView.getLastBopis(state),
    isMobile: routingInfoStoreView.getIsMobile(state),
    limitOfDaysToDisplayNotification: ordersStoreView.getLimitToDisplayLastOrderNotification(state),
    onCloseDrawer: ownProps.isDrawer && storeOperators.globalSignalsOperator.closeDrawers
  };
}

let BopisLastOrderStatusContainer = connectPlusStoreOperators({
  globalSignalsOperator: getGlobalSignalsOperator
}, mapStateToProps)(LastOrderStatus);

export {BopisLastOrderStatusContainer};
