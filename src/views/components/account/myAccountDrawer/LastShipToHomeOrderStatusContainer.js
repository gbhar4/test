/* @module LastShipToHomeOrderStatusContainer
  * @author DaMIaN <drossi@minutentag.com>
  * Exports the container component for the BopisLastOrderStatus component,
  */

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {LastOrderStatus} from './LastOrderStatus.jsx';
import {ordersStoreView} from 'reduxStore/storeViews/ordersStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';

function mapStateToProps (state, ownProps, storeOperators) {
  let siteId = sitesAndCountriesStoreView.getCurrentSiteId(state);
  return {
    order: ordersStoreView.getLastShipToHome(state, siteId),
    isMobile: routingInfoStoreView.getIsMobile(state),
    limitOfDaysToDisplayNotification: ordersStoreView.getLimitToDisplayLastOrderNotification(state),
    onCloseDrawer: ownProps.isDrawer && storeOperators.globalSignalsOperator.closeDrawers
  };
}

let LastShipToHomeOrderStatusContainer = connectPlusStoreOperators({
  globalSignalsOperator: getGlobalSignalsOperator
}, mapStateToProps)(LastOrderStatus);

export {LastShipToHomeOrderStatusContainer};
