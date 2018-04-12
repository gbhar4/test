/** @module OrdersHistoryContainer
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {OrdersHistory} from './OrdersHistory.jsx';
import {getOrdersOperator} from 'reduxStore/storeOperators/ordersOperator';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isCanada: sitesAndCountriesStoreView.getIsCanada(state)
  };
}

let OrdersHistoryContainer = connectPlusStoreOperators({
  orders: getOrdersOperator
}, mapStateToProps)(OrdersHistory);

export {OrdersHistoryContainer};
