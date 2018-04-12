// import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
// import {routingInfoStoreView} from 'reduxStore/storeViews/routingInfoStoreView';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {MyAccountNavigation} from './MyAccountNavigation.jsx';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView.js';
import {getGeneralOperator} from 'reduxStore/storeOperators/generalOperator.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isUSSite: sitesAndCountriesStoreView.isUsSite(state),
    isMobile: routingInfoStoreView.getIsMobile(state),
    isRopisEnabled: sitesAndCountriesStoreView.getRopisEnabledFlag(state),
    isRopisEnabledFlag: sitesAndCountriesStoreView.getRopisEnabledFlag(state),
    isUsContry: sitesAndCountriesStoreView.getCurrentCountry(state) === 'US',
    isCommunicationPreferencesEnabled: generalStoreView.getSetIsCommunicationPreferencesEnabled(state),
    onClearSuccessMessage: storeOperators.generalOperator.clearFlashMessage
  };
}

let MyAccountNavigationContainer = connectPlusStoreOperators({
  generalOperator: getGeneralOperator
}, mapStateToProps)(MyAccountNavigation);

export {MyAccountNavigationContainer};
