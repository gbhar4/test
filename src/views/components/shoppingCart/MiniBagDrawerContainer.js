import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {MiniBagDrawer} from './MiniBagDrawer.jsx';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';

const mapStateToProps = function (state) {
  return {
    isGuest: userStoreView.isGuest(state),
    isRemembered: userStoreView.isRemembered(state),
    itemsCount: cartStoreView.getItemsCount(state),
    isRewardsEnabled: sitesAndCountriesStoreView.isRewardsEnabled(state)
  };
};
let MiniBagDrawerContainer = connectPlusStoreOperators(mapStateToProps)(MiniBagDrawer);

export {MiniBagDrawerContainer};
