/**
 * @module OrderConfirmationLedgerContainer
 * @author Agu
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {Ledger} from './Ledger.jsx';
import {confirmationStoreView} from 'reduxStore/storeViews/confirmationStoreView.js';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';

const mapStateToProps = function (state) {
  let summary = confirmationStoreView.getSummary(state);
  let fullfilmentCentersMap = confirmationStoreView.getFullfilmentCentersMap(state);
  let totalsByFullfillmentCenterMap = fullfilmentCentersMap ? fullfilmentCentersMap.map((center) => {
    return {
      name: center.storeName || 'Online',
      amount: center.orderTotal
    };
  }) : null;

  return {
    ...summary,
    totalsByFullfillmentCenterMap: totalsByFullfillmentCenterMap,
    itemsCount: confirmationStoreView.getItemsCount(state),
    isTotalEstimated: false,
    isOrderHasShipping: confirmationStoreView.getIsOrderHasShipping(state),
    currencySymbol: sitesAndCountriesStoreView.getCurrentCurrencySymbol(state)
  };
};

let OrderConfirmationLedgerContainer = connectPlusStoreOperators(mapStateToProps)(Ledger);

export {OrderConfirmationLedgerContainer};
