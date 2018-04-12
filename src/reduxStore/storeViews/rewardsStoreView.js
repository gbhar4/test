export const rewardsStoreView = {
  getCurrentPoints,
  getCurrentRewardDollars,
  getRewardPointsToNextReward,
  getRewardDollarsNextMonth,
  getRewardsAccountNumber
};

function getCurrentPoints (state) {
  return state.user.rewards.rewardPoints;
}

function getCurrentRewardDollars (state) {
  return state.user.rewards.rewardDollars;
}

function getRewardPointsToNextReward (state) {
  return state.user.rewards.rewardPointsToNextReward;
}

function getRewardDollarsNextMonth (state) {
  return state.user.rewards.rewardDollarsNextMonth;
}

function getRewardsAccountNumber (state) {
  return state.user.rewards.accountNumber;
}
