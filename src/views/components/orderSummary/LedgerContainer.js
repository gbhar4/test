/**
 * @module LedgerContainer
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * Exports the container component for the Ledger component,
 * connecting state to it's props.
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {Ledger} from './Ledger.jsx';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';

const mapStateToProps = function (state) {
  let summary = cartStoreView.getSummary(state);
  return {
    ...summary,
    // itemsCount: cartStoreView.getItemsCount(state),
    // subTotal: cartStoreView.getSubTotal(state),
    isTotalEstimated: cartStoreView.getIsTotalEstimated(state),
    // total: cartStoreView.getGrandTotal(state),
    isOrderHasShipping: cartStoreView.getIsOrderHasShipping(state),
    currencySymbol: sitesAndCountriesStoreView.getCurrentCurrencySymbol(state)
  };
};

let LedgerContainer = connectPlusStoreOperators(mapStateToProps)(Ledger);

export {LedgerContainer};
