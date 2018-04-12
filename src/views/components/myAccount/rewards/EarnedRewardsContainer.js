/** @module EarnedRewardsContainer
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {EarnedRewards} from './EarnedRewards.jsx';
import {couponsAndPromosStoreView} from 'reduxStore/storeViews/couponsAndPromosStoreView.js';
import {rewardsStoreView} from 'reduxStore/storeViews/rewardsStoreView';
import {getCouponsAndPromosFormOperator} from 'reduxStore/storeOperators/formOperators/couponsAndPromosFormOperators.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView.js';
import {getGeneralOperator} from 'reduxStore/storeOperators/generalOperator.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    currentMonthCoupons: couponsAndPromosStoreView.getLoyaltyCoupons(state),
    userHasRewards: rewardsStoreView.getCurrentPoints(state) > 0,
    pointsToNextReward: rewardsStoreView.getRewardPointsToNextReward(state),
    nextRewardAmount: rewardsStoreView.getRewardDollarsNextMonth(state),
    onApplyCouponToBag: storeOperators.couponsOperator.submitCode,
    onRemove: storeOperators.couponsOperator.submitRemoveCode,
    successMessage: generalStoreView.getFlashSuccessMessage(state),
    errorMessage: generalStoreView.getFlashErrorMessage(state),
    onClearFlashMessage: storeOperators.generalOperator.clearFlashMessage
  };
}

let EarnedRewardsContainer = connectPlusStoreOperators({
  couponsOperator: getCouponsAndPromosFormOperator,
  generalOperator: getGeneralOperator
}, mapStateToProps)(EarnedRewards);

export {EarnedRewardsContainer};
