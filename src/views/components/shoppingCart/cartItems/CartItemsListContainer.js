/** @module
 * @summary A container component for {@linkcode CartItemsList}.
 *
 * @author Ben
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {CartItemsList} from './CartItemsList.jsx';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {getCartFormOperator} from 'reduxStore/storeOperators/formOperators/cartFormOperator';
import {getCartOperator} from 'reduxStore/storeOperators/cartOperator';
import {quickViewStoreView} from 'reduxStore/storeViews/quickViewStoreView';
import {getQuickViewOperator} from 'reduxStore/storeOperators/quickViewOperator.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    items: cartStoreView.getCartItems(state),

    currencySymbol: sitesAndCountriesStoreView.getCurrentCurrencySymbol(state),

    isBopisClearanceProductEnabled: sitesAndCountriesStoreView.getIsBopisClearanceProductEnabled(state),
    isBopisEnabled: sitesAndCountriesStoreView.getIsBopis(state),
    isShowBopisModal: quickViewStoreView.getQuickViewRequestInfo(state).showBopis,
    onQuickBopisOpenClick: storeOperators.quickViewOperator.loadBopisQuickViewInfo,
    onUpdateBopisItemInCart: storeOperators.cartFormOperator.submitUpdateBopisItemInCart,

    onDeleteItem: storeOperators.cartFormOperator.submitDeleteCartItem,
    onMoveItemToWishlist: storeOperators.cartFormOperator.submitMoveCartItemToWishlist,
    onEnterEditItem: storeOperators.cartOperator.setCartItemToEditMode,
    onSetShipToHome: storeOperators.cartOperator.setShipToHome
  };
}

export let CartItemsListContainer = connectPlusStoreOperators({
  cartFormOperator: getCartFormOperator,
  cartOperator: getCartOperator,
  quickViewOperator: getQuickViewOperator
}, mapStateToProps)(CartItemsList);
