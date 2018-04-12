import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {ProductBopis} from './ProductBopis.jsx';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';
import {storesStoreView} from 'reduxStore/storeViews/storesStoreView.js';
import {getCartFormOperator} from 'reduxStore/storeOperators/formOperators/cartFormOperator';
import {getQuickViewOperator} from 'reduxStore/storeOperators/quickViewOperator';
import {productDetailsStoreView} from 'reduxStore/storeViews/productDetailsStoreView.js';
import {formValueSelector} from 'redux-form';

function mapStateToProps (state, ownProps, storeOperators) {
  /*
   * Previously form values were tracked in the state of Product.jsx
   * This was causing unnecessary re-renders for the entire product card
   * Now using redux-form selector to pull the required values directly into
   * the components that need them
   */
  let selector = formValueSelector(ownProps.formName);

  return {
    itemValues: selector(state, 'color', 'fit', 'size', 'quantity'),
    isBopisEnabled: sitesAndCountriesStoreView.getIsBopis(state),
    preferredStore: storesStoreView.getDefaultStore(state),
    disabledFits: productDetailsStoreView.getBopisDisabledFits(state),
    onAddItemToPreferredStoreCart: storeOperators.cartFormOperator.submitAddItemToPreferredStoreCart,
    onAddItemToPreferredStoreCartSuccess: storeOperators.quickViewOperator.openAddedToBagNotification
  };
}

export let ProductBopisContainer = connectPlusStoreOperators({
  cartFormOperator: getCartFormOperator,
  quickViewOperator: getQuickViewOperator
}, mapStateToProps)(ProductBopis);
ProductBopisContainer.displayName = 'ProductBopisContainer';
