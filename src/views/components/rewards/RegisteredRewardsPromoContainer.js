/**
 * @module RegisteredRewardsPromoContainer
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * Exports the container component for the RegisteredRewardsPromo component,
 * connecting state to it's props.
 */

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {RegisteredRewardsPromo} from './RegisteredRewardsPromo.jsx';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {rewardsStoreView} from 'reduxStore/storeViews/rewardsStoreView';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';

const mapStateToProps = function (state) {
  return {
    pointsInYourBag: cartStoreView.getEstimatedRewardsEarned(state),
    pointsToNextReward: rewardsStoreView.getRewardPointsToNextReward(state),
    userHasPlcc: userStoreView.getUserIsPlcc(state)
  };
};

let RegisteredRewardsPromoContainer = connectPlusStoreOperators(mapStateToProps)(RegisteredRewardsPromo);

export {RegisteredRewardsPromoContainer};
