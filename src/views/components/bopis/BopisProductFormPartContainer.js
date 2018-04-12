/** @module BopisProductFormPartContainer
 *
 * @author Ben
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {BopisProductFormPart} from './BopisProductFormPart.jsx';
import {productDetailsStoreView} from 'reduxStore/storeViews/productDetailsStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    currencySymbol: sitesAndCountriesStoreView.getCurrentCurrencySymbol(state),
    disabledFits: productDetailsStoreView.getBopisDisabledFits(state)
  };
}

export let BopisProductFormPartContainer = connectPlusStoreOperators(mapStateToProps)(BopisProductFormPart);
