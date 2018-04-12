/**
 * @module FormCountrySelectContainer
 *
 * @author Ben
 */
import {FormCountrySelect} from './FormCountrySelect.jsx';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';
import {getGlobalComponentsFormOperator} from 'reduxStore/storeOperators/formOperators/globalComponentsFormOperator';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';

const FORM_NAME = 'countrySelectForm';

function mapStateToProps (state, ownProps, storeOperators) {
  let initialCountry = sitesAndCountriesStoreView.getCurrentCountry(state);
  let initialLanguage = sitesAndCountriesStoreView.getCurrentLanguage(state);
  let initialCurrency = sitesAndCountriesStoreView.getCurrentCurrency(state);
  let countriesMap = sitesAndCountriesStoreView.getCountriesMap(state);
  let sitesTable = sitesAndCountriesStoreView.getSitesTable(state);
  let currenciesMap = sitesAndCountriesStoreView.getCurrenciesMap(state);

  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    countriesMap: countriesMap,
    sitesTable: sitesTable,
    currenciesMap: currenciesMap,

    onSubmit: storeOperators.globalComponentsFormOperator.submitCountrySelection,

    form: FORM_NAME,            // a unique identifier for this form
    initialValues: {
      country: initialCountry,
      language: initialLanguage,
      currency: initialCurrency
    }
  };
}

let FormCountrySelectContainer = connectPlusStoreOperators(
  {globalComponentsFormOperator: getGlobalComponentsFormOperator}, mapStateToProps)(FormCountrySelect);

export {FormCountrySelectContainer};
