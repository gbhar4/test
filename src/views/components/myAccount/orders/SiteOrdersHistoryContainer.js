/** @module SiteOrdersHistoryContainer
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import {PropTypes} from 'prop-types';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {SiteOrdersHistory} from './SiteOrdersHistory.jsx';
import {ordersStoreView} from 'reduxStore/storeViews/ordersStoreView';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView.js';
import {getOrdersOperator} from 'reduxStore/storeOperators/ordersOperator';
import {routingConstants} from 'routing/routingConstants.js';

const PROP_TYPES = {
  /**
   * Flags whether the orders from Canada site should be shown. Else, those from
   * US will.
   */
  isCanadaOrdersHistory: PropTypes.bool.isRequired
};

function mapStateToProps (state, ownProps, storeOperators) {
  let ordersSite = ownProps.isCanadaOrdersHistory
    ? routingConstants.siteIds.ca : routingConstants.siteIds.us;

  return {
    ordersPages: ordersStoreView.getSiteOrdersHistoryPages(state, ordersSite),
    totalNumberOfPages: ordersStoreView.getSiteOrdersHistoryTotalPages(state, ordersSite),
    onGoToPage: storeOperators.orders.getSiteOrdersHistoryPage,
    isMobile: routingInfoStoreView.getIsMobile(state),
    ordersSite
  };
}

let SiteOrdersHistoryContainer = connectPlusStoreOperators({
  orders: getOrdersOperator
}, mapStateToProps)(SiteOrdersHistory);
SiteOrdersHistoryContainer.propTypes = {...SiteOrdersHistoryContainer.propTypes, ...PROP_TYPES};

export {SiteOrdersHistoryContainer};
