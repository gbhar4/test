/**
 * @module CheckoutCartItemsListContainer
 * @summary A container component for {@linkcode CheckoutCartItemsList}.
 *
 * @author Miguel
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {CheckoutCartItemsList} from './CheckoutCartItemsList.jsx';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';

const mapStateToProps = function (state) {
  return {
    itemsCount: cartStoreView.getItemsCount(state),
    items: cartStoreView.getCartItems(state),
    currencySymbol: sitesAndCountriesStoreView.getCurrentCurrencySymbol(state)
  };
};

let CheckoutCartItemsListContainer = connectPlusStoreOperators(mapStateToProps)(CheckoutCartItemsList);

export {CheckoutCartItemsListContainer};
