/** @module DesktopAccountDrawersContainer
 *
 * @author Ben
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {DesktopAccountDrawers} from './DesktopAccountDrawers.jsx';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {globalSignalsStoreView} from 'reduxStore/storeViews/globalSignalsStoreView';
import {getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {getRoutingOperator} from 'reduxStore/storeOperators/routingOperator.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {PAGES} from 'routing/routes/pages.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isGuest: userStoreView.isGuest(state),
    isRemembered: userStoreView.isRemembered(state),
    activeTabId: globalSignalsStoreView.getActiveDrawer(state),
    activeFormName: globalSignalsStoreView.getActiveFormName(state),
    globalSignalsOperator: storeOperators.globalSignalsOperator,
    isRewardsEnabled: sitesAndCountriesStoreView.isRewardsEnabled(state),
    isMobile: routingInfoStoreView.getIsMobile(state),
    onWishlistSuccessfulLogin: function () {
      storeOperators.routingOperator.gotoPage(PAGES.favorites, null, true);
    }
  };
}

let DesktopAccountDrawersContainer = connectPlusStoreOperators({
  globalSignalsOperator: getGlobalSignalsOperator,
  routingOperator: getRoutingOperator
}, mapStateToProps)(DesktopAccountDrawers);

export {DesktopAccountDrawersContainer};
