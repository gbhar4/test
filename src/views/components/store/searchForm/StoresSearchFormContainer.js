/**
 * @module Store List Container
 * Exports the container component for the stores list
 * @author Damián Rossi
 * TODO one storeViews work, replace vars and remove from indicated lines from-to
 */
import {PropTypes} from 'prop-types';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {StoresSearchForm} from './StoresSearchForm.jsx';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {getStoresOperator} from 'reduxStore/storeOperators/storesOperator';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';

const PROP_TYPES = {
  /** flags if the Show Only BOPIS Stores should start checked */
  isShowOnlyBopisStoresInitialValue: PropTypes.bool.isRequired,
  /** flags if the Show Only Outlet Stores should start checked */
  isShowOnlyOutletStoresInitialValue: PropTypes.bool.isRequired
};

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    loadStoresByLatLng: storeOperators.storesOperator.loadStoresByLatLng,
    initialValues: {
      isShowOnlyBopisStores: ownProps.isShowOnlyBopisStoresInitialValue,
      isShowOnlyOutletStores: ownProps.isShowOnlyOutletStoresInitialValue
    },
    country: sitesAndCountriesStoreView.getCurrentCountry(state)
  };
}

let StoresSearchFormContainer = connectPlusStoreOperators({
  storesOperator: getStoresOperator
}, mapStateToProps)(StoresSearchForm);
StoresSearchFormContainer.propTypes = {...StoresSearchFormContainer.propTypes, ...PROP_TYPES};

export {StoresSearchFormContainer};
