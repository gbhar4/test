/**
 * @module StoreLocatorPageContainer
 *
 * @author Miguel <malvarez@minutentag.com>
 * @author Damian <drossi@minutentag.com>
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {StoreLocatorPage} from './StoreLocatorPage.jsx';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {storesStoreView} from 'reduxStore/storeViews/storesStoreView';
import {getStoresFormOperator} from 'reduxStore/storeOperators/formOperators/storesFormOperator';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {isClient} from 'routing/routingHelper';
import {PAGES} from 'routing/routes/pages';
import {matchPath} from 'react-router';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {getStoresOperator} from 'reduxStore/storeOperators/storesOperator';

function mapStateToProps (state, ownProps, storeOperators) {
  let defaultStore = storesStoreView.getDefaultStore(state);
  let pathname = isClient() && document.referrer && document.referrer.substr(document.location.origin.length);

  return {
    isGuest: userStoreView.isGuest(state),
    isShowBackToMyAccount: isClient() && !!pathname && !!matchPath(pathname, {path: PAGES.myAccount.pathPattern}),
    storesList: storesStoreView.getSuggestedStores(state),
    favoriteStoreId: defaultStore && defaultStore.basicInfo.id,
    isMobile: routingInfoStoreView.getIsMobile(state),
    isEnableSetAsDefault: sitesAndCountriesStoreView.isUsSite(state),
    onSetFavoriteStore: storeOperators.storesFormOperator.submitSetFavoriteStore,
    loadStoresByLatLng: storeOperators.storesOperator.loadStoresByLatLng
  };
}

let StoreLocatorPageContainer = connectPlusStoreOperators({
  storesFormOperator: getStoresFormOperator,
  storesOperator: getStoresOperator
}, mapStateToProps)(StoreLocatorPage);

export {StoreLocatorPageContainer};
