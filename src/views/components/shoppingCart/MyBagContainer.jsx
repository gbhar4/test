import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {MyBag} from './MyBag.jsx';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {abTestingStoreView} from 'reduxStore/storeViews/abTestingStoreView.js';

const mapStateToProps = function (state) {
  return {
    isLoading: generalStoreView.getIsLoading(state),
    isGuest: userStoreView.isGuest(state),
    isRemembered: userStoreView.isRemembered(state),
    isMobile: routingInfoStoreView.getIsMobile(state),
    itemsCount: cartStoreView.getItemsCount(state),
    isRewardsEnabled: sitesAndCountriesStoreView.isRewardsEnabled(state),
    isAirMilesEnabled: sitesAndCountriesStoreView.isAirMilesEnabled(state),
    isPocTestActive: abTestingStoreView.getIsPocTestActive(state)
  };
};

let MyBagContainer = connectPlusStoreOperators(mapStateToProps)(MyBag);

export {MyBagContainer};
