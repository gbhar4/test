// TODO: rename actions to start with get and end with actions
export function setRewardPoints (rewardPoints) {
  return {
    rewardPoints,
    type: 'USER_PERSONALDATA_SET_REWARD_POINTS'
  };
}

export function setRewardDollars (rewardDollars) {
  return {
    rewardDollars,
    type: 'USER_PERSONALDATA_SET_REWARD_DOLLARS'
  };
}

export function setRewardDollarsNextMonth (rewardDollarsNextMonth) {
  return {
    rewardDollarsNextMonth,
    type: 'USER_PERSONALDATA_SET_REWARD_DOLLARS_NEXT_MONTH'
  };
}

export function setRewardPointsToNextReward (rewardPointsToNextReward) {
  return {
    rewardPointsToNextReward,
    type: 'USER_PERSONALDATA_SET_REWARD_POINTS_TO_NEXT_REWARD'
  };
}

export function getSetRewardAccountNumber (accountNumber) {
  return {
    accountNumber,
    type: 'USER_PERSONALDATA_SET_REWARD_ACCOUNT_NUMBER'
  };
}

// FIXME: move this to a more appropriate place
export function getSetDefaultWishlistIdActn (defaultWishlistId) {
  return {
    defaultWishlistId: defaultWishlistId,
    type: 'USER_PERSONALDATA_SET_DEFAULT_WISHLIST_ID'
  };
}
