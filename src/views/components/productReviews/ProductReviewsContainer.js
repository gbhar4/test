/** @module ProductReviewsContainer
 *
 * @author Agu
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {ProductReviews} from './ProductReviews.jsx';
import {getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator.js';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {vendorRoutingStoreView} from 'reduxStore/storeViews/routing/vendorRoutingStoreView.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isGuest: userStoreView.isGuest(state),
    userId: userStoreView.getUserId(state),
    onLoginClick: storeOperators.globalSignalsOperator.openLoginDrawer,
    bazaarvoiceApiUrl: vendorRoutingStoreView.getBazaarvoiceApiUrl(state)
  };
}

export let ProductReviewsContainer = connectPlusStoreOperators({
  globalSignalsOperator: getGlobalSignalsOperator
}, mapStateToProps)(ProductReviews);
