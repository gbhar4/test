/**
 * @module RewardsStatusContainer
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * Exports the container component for the RewardsStatus component,
 * connecting state to it's props.
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {RewardsStatus} from './RewardsStatus.jsx';
import {rewardsStoreView} from 'reduxStore/storeViews/rewardsStoreView';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView.js';

const mapStateToProps = function (state) {
  return {
    userRewardsPoints: rewardsStoreView.getCurrentPoints(state),
    pointsToNextReward: rewardsStoreView.getRewardPointsToNextReward(state),
    currentMonthRewards: rewardsStoreView.getCurrentRewardDollars(state),
    isMobile: routingInfoStoreView.getIsMobile(state)
  };
};

let RewardsStatusContainer = connectPlusStoreOperators(mapStateToProps)(RewardsStatus);

export {RewardsStatusContainer};
