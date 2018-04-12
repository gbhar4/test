/** @module BopisStoresListContainer
 *
 * @author Ben
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {BopisStoresList} from './BopisStoresList.jsx';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {storesStoreView} from 'reduxStore/storeViews/storesStoreView';
import {getCartFormOperator} from 'reduxStore/storeOperators/formOperators/cartFormOperator';

function mapStateToProps (state, ownProps, storeOperators) {
  let suggestedStores = storesStoreView.getSuggestedStores(state);
  let defaultStore = storesStoreView.getDefaultStore(state);
  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    storesList: storesStoreView.getSuggestedStores(state),
    isShowFilterCheckbox: suggestedStores.length > 0,
    defaultStoreName: defaultStore ? defaultStore.basicInfo.storeName : null
  };
}

export let BopisStoresListContainer = connectPlusStoreOperators({
  cartFormOperator: getCartFormOperator
}, mapStateToProps)(BopisStoresList);
