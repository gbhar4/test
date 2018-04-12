// import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
// import {routingInfoStoreView} from 'reduxStore/storeViews/routingInfoStoreView';

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {rewardsStoreView} from 'reduxStore/storeViews/rewardsStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    isRewardsEnabled: sitesAndCountriesStoreView.isRewardsEnabled(state),
    currentPoints: rewardsStoreView.getCurrentPoints(state),
    currentRewards: rewardsStoreView.getCurrentRewardDollars(state),
    pendingRewards: rewardsStoreView.getRewardDollarsNextMonth(state),
    pointsToNextReward: rewardsStoreView.getRewardPointsToNextReward(state),
    rewardEarned: [] // FIXME: connect to store
  };
}

let MyAccountHeaderConnect = connectPlusStoreOperators(mapStateToProps);

export {MyAccountHeaderConnect};
