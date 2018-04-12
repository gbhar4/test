/**
 * @module MyPlaceRewardsLinkContainer
 * @author Noam
 */

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {MyPlaceRewardsLink} from './MyPlaceRewardsLink.jsx';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';

const mapStateToProps = function (state) {
  return {
    isGuest: userStoreView.isGuest(state)
  };
};

let MyPlaceRewardsLinkContainer = connectPlusStoreOperators(mapStateToProps)(MyPlaceRewardsLink);

export {MyPlaceRewardsLinkContainer};
