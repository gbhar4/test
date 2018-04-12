/** @module CartUnavilableItemsNotificationContainer
 *
 * @author Ben
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {CartUnavailableItemsNotification} from './CartUnavailableItemsNotification.jsx';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {getCartFormOperator} from 'reduxStore/storeOperators/formOperators/cartFormOperator';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    unavailableItemsCount: cartStoreView.getUnavailableCount(state),
    onRemoveUnavailableItems: storeOperators.cartFormOperator.submitRemoveUnavailableItems
  };
}

let CartUnavailableItemsNotificationContainer = connectPlusStoreOperators({
  cartFormOperator: getCartFormOperator
}, mapStateToProps)(CartUnavailableItemsNotification);

export {CartUnavailableItemsNotificationContainer};
