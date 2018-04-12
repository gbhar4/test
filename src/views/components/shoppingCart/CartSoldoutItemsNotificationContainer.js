/** @module CartSoldoutItemsNotificationContainer
 *
 * @author Ben
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {CartSoldoutItemsNotification} from './CartSoldoutItemsNotification.jsx';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {getCartFormOperator} from 'reduxStore/storeOperators/formOperators/cartFormOperator';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    soldoutItemsCount: cartStoreView.getOOSCount(state),
    onRemoveSoldoutItems: storeOperators.cartFormOperator.submitRemoveOOSItems
  };
}

let CartSoldoutItemsNotificationContainer = connectPlusStoreOperators({
  cartFormOperator: getCartFormOperator
}, mapStateToProps)(CartSoldoutItemsNotification);

export {CartSoldoutItemsNotificationContainer};
