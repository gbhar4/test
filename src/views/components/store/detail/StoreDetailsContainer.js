/** @module StoreDetailsContainer
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import {PropTypes} from 'prop-types';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {StoreDetails} from './StoreDetails.jsx';
import {storesStoreView, getStoreIdFromUrlPathPart} from 'reduxStore/storeViews/storesStoreView';
import {getStoresOperator} from 'reduxStore/storeOperators/storesOperator.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';

const PROP_TYPES = {
  /** match prop passed by Route component */
  match: PropTypes.shape({
    params: PropTypes.object.isRequired
  }).isRequired
};

function mapStateToProps (state, ownProps, storeOperators) {
  let currentStore = storesStoreView.getCurrentStore(state);
  return {
    storeId: getStoreIdFromUrlPathPart(ownProps.match.params.storeStr),
    onLoadStoreDetails: storeOperators.stores.loadStorePlusNearbyStores,
    store: currentStore.basicInfo ? currentStore : null,      // return nul if store not loaded yet
    isMobile: routingInfoStoreView.getIsMobile(state)
  };
}

let StoreDetailsContainer = connectPlusStoreOperators({
  stores: getStoresOperator
}, mapStateToProps)(StoreDetails);
StoreDetailsContainer.propTypes = {...StoreDetailsContainer.propTypes, ...PROP_TYPES};

export {StoreDetailsContainer};
