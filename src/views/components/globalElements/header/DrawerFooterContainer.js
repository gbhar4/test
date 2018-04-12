/** @module DrawerFooterContainer
 * @author Ben
 */
import {DrawerFooter} from './DrawerFooter.jsx';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    openSelectedDrawer: storeOperators.globalSignalsOperator.openSelectedDrawer,
    isCountryUS: sitesAndCountriesStoreView.getCurrentCountry(state) === 'US'
  };
}

let DrawerFooterContainer = connectPlusStoreOperators(
  {globalSignalsOperator: getGlobalSignalsOperator}, mapStateToProps
)(DrawerFooter);

export {DrawerFooterContainer};
