/** @module AddressFormSectionContainer
 *
 * @author Ben
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {AddressFormSection} from './AddressFormSection.jsx';
import {addressesStoreView} from 'reduxStore/storeViews/addressesStoreView';
import {getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';

function mapStateToProps (state, ownProps, storeOperators) {
  let isMobile = routingInfoStoreView.getIsMobile(state);

  return {
    isShowInternationalShippingButton: ownProps.isShowInternationalShipping && !isMobile, // NOTE: re-enable for mobile on R5
    countriesOptionsMap: addressesStoreView.getCountriesOptionsMap(state),
    countriesStatesTable: addressesStoreView.getCountriesStatesTable(state),
    onShippingInternationallyClick: storeOperators.globalSignalsOperator.openCountrySelectorModal,
    isCountryUS: sitesAndCountriesStoreView.getCurrentCountry(state) === 'US'
  };
}

// make sure ownProps (i.e., props passed to this container) override the props created by the container
function mergeProps (stateProps, dispatchProps, ownProps) {
  return {...stateProps, ...dispatchProps, ...ownProps};
}

let AddressFormSectionContainer = connectPlusStoreOperators({
  globalSignalsOperator: getGlobalSignalsOperator
}, mapStateToProps, undefined, mergeProps)(AddressFormSection);
AddressFormSectionContainer.defaultValidation = AddressFormSection.defaultValidation;

export {AddressFormSectionContainer};
