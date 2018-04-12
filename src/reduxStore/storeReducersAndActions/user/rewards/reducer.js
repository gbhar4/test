import Immutable from 'seamless-immutable';

let studDefaultRewardsStore = Immutable({
  rewardPoints: 0,
  rewardPointsToNextReward: 0,
  rewardDollars: 0,
  rewardDollarsNextMonth: 0,
  accountNumber: '',
  // FIXME: move this to a more appropriate place
  defaultWishlistId: ''
});

const setRewardPoints = function (rewards, rewardPoints) {
  return Immutable.merge(rewards, {rewardPoints});
};

const setRewardDollars = function (rewards, rewardDollars) {
  return Immutable.merge(rewards, {rewardDollars});
};

const setRewardDollarsNextMonth = function (rewards, rewardDollarsNextMonth) {
  return Immutable.merge(rewards, {rewardDollarsNextMonth});
};

const setRewardPointsToNextReward = function (rewards, rewardPointsToNextReward) {
  return Immutable.merge(rewards, {rewardPointsToNextReward});
};

const rewardsReducer = function (rewards = studDefaultRewardsStore, action) {
  switch (action.type) {
    case 'USER_PERSONALDATA_SET_REWARD_POINTS':
      return setRewardPoints(rewards, action.rewardPoints);
    case 'USER_PERSONALDATA_SET_REWARD_DOLLARS':
      return setRewardDollars(rewards, action.rewardDollars);
    case 'USER_PERSONALDATA_SET_REWARD_DOLLARS_NEXT_MONTH':
      return setRewardDollarsNextMonth(rewards, action.rewardDollarsNextMonth);
    case 'USER_PERSONALDATA_SET_REWARD_POINTS_TO_NEXT_REWARD':
      return setRewardPointsToNextReward(rewards, action.rewardPointsToNextReward);
    case 'USER_PERSONALDATA_SET_REWARD_ACCOUNT_NUMBER':
      return Immutable.merge(rewards, {accountNumber: action.accountNumber});
    case 'USER_PERSONALDATA_SET_DEFAULT_WISHLIST_ID':
      return Immutable.merge(rewards, {defaultWishlistId: action.defaultWishlistId});
    default:
      return rewards;
  }
};

export * from './actionCreators';
export {rewardsReducer};
