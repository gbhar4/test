import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {routingStoreView} from 'reduxStore/storeViews/routing/routingStoreView.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {AppRootPage} from './AppRootPage.jsx';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView';

const mapStateToProps = function (state, ownProps) {
  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    isLoading: generalStoreView.getIsLoading(state),
    activePage: routingStoreView.getCurrentPageId(state),
    isRewardsEnabled: sitesAndCountriesStoreView.isRewardsEnabled(state)
  };
};

export let AppRootPageContainer = connectPlusStoreOperators(mapStateToProps)(AppRootPage);
