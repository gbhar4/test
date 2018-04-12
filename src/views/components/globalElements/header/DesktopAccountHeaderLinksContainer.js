/** @module DesktopAccountHeaderLinksContainer
 *
 * @author Ben
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {DesktopAccountHeaderLinks} from './DesktopAccountHeaderLinks.jsx';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {globalSignalsStoreView} from 'reduxStore/storeViews/globalSignalsStoreView';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isGuest: userStoreView.isGuest(state),
    isRemembered: userStoreView.isRemembered(state),
    isRewardsEnabled: sitesAndCountriesStoreView.isRewardsEnabled(state),
    openSelectedDrawer: storeOperators.globalSignalsOperator.openSelectedDrawer,
    activeDrawer: globalSignalsStoreView.getActiveDrawer(state)
  };
}

let DesktopAccountHeaderLinksContainer = connectPlusStoreOperators(
  {globalSignalsOperator: getGlobalSignalsOperator}, mapStateToProps
)(DesktopAccountHeaderLinks);

export {DesktopAccountHeaderLinksContainer};
