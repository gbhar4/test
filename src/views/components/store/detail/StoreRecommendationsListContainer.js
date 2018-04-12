/** @module StoreRecommendationsListContainer
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {StoreRecommendationsList} from './StoreRecommendationsList.jsx';
import {storesStoreView} from 'reduxStore/storeViews/storesStoreView';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';

function mapStateToProps (state) {
  return {
    storeRecommendations: storesStoreView.getStoresList(state),
    isMobile: routingInfoStoreView.getIsMobile(state)
  };
}

let StoreRecommendationsListContainer = connectPlusStoreOperators(mapStateToProps)(StoreRecommendationsList);

export {StoreRecommendationsListContainer};
