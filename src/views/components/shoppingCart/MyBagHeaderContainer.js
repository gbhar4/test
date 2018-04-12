/** @module MyBagHeaderContainer
 *
 * @author Ben
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {MyBagHeader} from './MyBagHeader.jsx';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';

function mapStateToProps (state) {
  return {
    itemsCount: cartStoreView.getItemsCount(state),
    itemWishlistId: cartStoreView.getLastMovedToWishlistItemId(state),
    itemDeletedId: cartStoreView.getLastDeletedItemId(state),
    itemUpdatedId: cartStoreView.getLastUpdatedItemId(state),
    recentlyRemovedItemsCount: cartStoreView.getRecentlyRemovedCount(state),
    currencySymbol: sitesAndCountriesStoreView.getCurrentCurrencySymbol(state),
    grandTotal: cartStoreView.getGrandTotal(state)
  };
}

let MyBagHeaderContainer = connectPlusStoreOperators(mapStateToProps)(MyBagHeader);

export {MyBagHeaderContainer};
