/**
 * @noam: moved to a webpack flag static store
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {CountrySelector} from './CountrySelector.jsx';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';
import {getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    currentLanguage: sitesAndCountriesStoreView.getCurrentLanguage(state),
    languages: sitesAndCountriesStoreView.getCurrentCountryLanguages(state),
    currentCountry: sitesAndCountriesStoreView.getCurrentCountry(state),
    currentCountryImage: sitesAndCountriesStoreView.getCountryImage(state),
    onOpenCountrySelectModalClick: storeOperators.globalSignalsOperator.openCountrySelectorModal
  };
}

let CountrySelectorContainer = connectPlusStoreOperators(
  {globalSignalsOperator: getGlobalSignalsOperator}, mapStateToProps
)(CountrySelector);

export {CountrySelectorContainer};
