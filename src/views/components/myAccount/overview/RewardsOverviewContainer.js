/** @module RewardsOverviewContainer
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {RewardsOverview} from './RewardsOverview.jsx';
import {couponsAndPromosStoreView} from 'reduxStore/storeViews/couponsAndPromosStoreView.js';
import {getCouponsAndPromosFormOperator} from 'reduxStore/storeOperators/formOperators/couponsAndPromosFormOperators.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    coupons: couponsAndPromosStoreView.getRecentCouponsAndPromos(state),
    onApplyCouponToBag: storeOperators.couponsOperator.submitCode,
    onRemove: storeOperators.couponsOperator.submitRemoveCode,
    isRewardsEnabled: sitesAndCountriesStoreView.isRewardsEnabled(state),
    hasLoyaltyCoupons: couponsAndPromosStoreView.hasLoyaltyCoupons(state),
    isCanada: sitesAndCountriesStoreView.getIsCanada(state)
  };
}

let RewardsOverviewContainer = connectPlusStoreOperators({
  couponsOperator: getCouponsAndPromosFormOperator
}, mapStateToProps)(RewardsOverview);

export {RewardsOverviewContainer};
