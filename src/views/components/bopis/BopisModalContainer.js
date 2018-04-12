/** @module BopisModalContainer
 * @author Gabriel Gomez
 */
import {PropTypes} from 'prop-types';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {BopisModal} from './BopisModal.jsx';
import {storesStoreView} from 'reduxStore/storeViews/storesStoreView';
import {getCartFormOperator} from 'reduxStore/storeOperators/formOperators/cartFormOperator';
import {getStoresFormOperator} from 'reduxStore/storeOperators/formOperators/storesFormOperator';
import {getStoresOperator} from 'reduxStore/storeOperators/storesOperator';
import {getQuickViewOperator} from 'reduxStore/storeOperators/quickViewOperator';

const PROP_TYPES = {
  isShowAddItemSuccessNotification: PropTypes.bool
};

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    maxAllowedStoresInCart: storesStoreView.getMaxAllowedStoresInCart(state),
    cartBopisStoresList: storesStoreView.getBopisStoresOnCart(state),
    distancesMap: storesStoreView.getDistancesMap(),
    initialValues: {
      ...ownProps.initialValues,
      fit: 'regular'
    },
    isShowExtendedSizesNotification: ownProps.initialValues && ownProps.initialValues.fit !== 'regular',
    onMount: storeOperators.tcpStoresOperator.onBopisModalMount,
    onSearchInCurrentCartStoresSubmit: storeOperators.tcpStoresFormOperator.submitGetBopisSearchForStoresInCart,
    onSearchAreaStoresSubmit: storeOperators.tcpStoresFormOperator.submitGetBopisSearchByLatLng,
    onAddItemToCart: ownProps.onAddItemToCart || storeOperators.cartFormOperator.submitAddBopisItemToCart,
    onAddItemToCartSuccess: ownProps.isShowAddItemSuccessNotification
      ? storeOperators.quickViewOperator.openAddedToBagNotification
      : undefined
  };
}

let BopisModalContainer = connectPlusStoreOperators({
  cartFormOperator: getCartFormOperator,
  tcpStoresFormOperator: getStoresFormOperator,
  tcpStoresOperator: getStoresOperator,
  quickViewOperator: getQuickViewOperator
}, mapStateToProps)(BopisModal);
BopisModalContainer.propTypes = {...BopisModalContainer.propTypes, ...PROP_TYPES};

export {BopisModalContainer};
