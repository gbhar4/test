/**
 * @module HelloLinkContainer
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * Exports the container component for the desktop header link with the logged
 * in user name and rewards points, connecting state to HelloLink props.
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {HelloLink} from './HelloLink.jsx';
import {rewardsStoreView} from 'reduxStore/storeViews/rewardsStoreView';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';

const mapStateToProps = function (state) {
  return {
    firstName: userStoreView.getUserContactInfo(state).firstName,
    points: rewardsStoreView.getCurrentPoints(state),
    rewardsMoney: rewardsStoreView.getCurrentRewardDollars(state),
    isRewardsEnabled: sitesAndCountriesStoreView.isRewardsEnabled(state),
    isMobile: routingInfoStoreView.getIsMobile(state)
  };
};

let HelloLinkContainer = connectPlusStoreOperators(mapStateToProps)(HelloLink);

export {HelloLinkContainer};
