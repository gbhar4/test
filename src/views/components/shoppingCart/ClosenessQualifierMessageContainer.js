/**
 * @module ClosenessQualifierMessageContainer
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * Exports the container component for the ClosenessQualifierMessage component,
 * connecting state to it's props.
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {ClosenessQualifierMessage} from './ClosenessQualifierMessage.jsx';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {rewardsStoreView} from 'reduxStore/storeViews/rewardsStoreView';

let ClosenessQualifierMessageContainer;

// #if !STATIC2
const mapStateToProps = function (state) {
  return {
    orderTotal: cartStoreView.getSummary(state).total,
    pointsToNextReward: rewardsStoreView.getRewardPointsToNextReward(state),
    nextRewardAmount: rewardsStoreView.getRewardDollarsNextMonth(state),
    isGuest: userStoreView.isGuest(state)
  };
};
ClosenessQualifierMessageContainer = connectPlusStoreOperators(mapStateToProps)(ClosenessQualifierMessage);
// #endif

// #if STATIC2
// --------------For Static Testing only------------------
function mapStaticToProps () {
  let summary = window.store && window.store.summary || {};
  let user = window.store && window.store.user || {};
  return {
    orderTotal: summary.total,
    pointsToNextReward: user.pointsToNextReward,
    nextRewardAmount: user.nextRewardAmount,
    isGuest: window.store && window.store.isGuest
  };
}
ClosenessQualifierMessageContainer = connectPlusStoreOperators(mapStaticToProps)(ClosenessQualifierMessage);
// #endif

export {ClosenessQualifierMessageContainer};
