import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {HeaderGlobalMobile} from './HeaderGlobalMobile.jsx';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {globalSignalsStoreView} from 'reduxStore/storeViews/globalSignalsStoreView.js';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {getRoutingOperator} from 'reduxStore/storeOperators/routingOperator';
import {getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';
import {abTestingStoreView} from 'reduxStore/storeViews/abTestingStoreView';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isGuest: userStoreView.isGuest(state),
    isRemembered: userStoreView.isRemembered(state),
    isRewardsEnabled: sitesAndCountriesStoreView.isRewardsEnabled(state),
    goToPage: storeOperators.routingOperator.gotoPage,
    openSelectedDrawer: storeOperators.globalSignalsOperator.openSelectedDrawer,
    isHamburgerMenuOpen: globalSignalsStoreView.getIsHamburgerMenuOpen(state),
    setHamburgerMenuOpenState: storeOperators.globalSignalsOperator.setIsHamburgerMenuOpen,
    newNavigationVariants: abTestingStoreView.getNewMobileNavVariants(state)
  };
}

export let HeaderGlobalMobileContainer = connectPlusStoreOperators({
  routingOperator: getRoutingOperator,
  globalSignalsOperator: getGlobalSignalsOperator
}, mapStateToProps)(HeaderGlobalMobile);
