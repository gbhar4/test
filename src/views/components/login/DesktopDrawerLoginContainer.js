import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {DesktopDrawerLogin} from './DesktopDrawerLogin.jsx';
import {globalSignalsStoreView} from 'reduxStore/storeViews/globalSignalsStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    activeFormId: globalSignalsStoreView.getActiveForm(state),
    isRewardsEnabled: sitesAndCountriesStoreView.isRewardsEnabled(state),
    isCountryUS: sitesAndCountriesStoreView.getCurrentCountry(state) === 'US'
  };
}

let DesktopDrawerLoginContainer = connectPlusStoreOperators(mapStateToProps)(DesktopDrawerLogin);

export {DesktopDrawerLoginContainer};
