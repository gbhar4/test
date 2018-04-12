/** @module MoveItemContainer
 * @author Agu
 */

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {MoveItem} from './MoveItem.jsx';
import {getFavoritesFormOperator} from 'reduxStore/storeOperators/formOperators/favoritesFormOperator.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    onCreateSubmit: storeOperators.favoritesFormOperator.submitCreateWishListThenMoveItem,
    onMoveItem: storeOperators.favoritesFormOperator.submitMoveItemToOtherWishlist
  };
}

let MoveItemContainer = connectPlusStoreOperators({
  favoritesFormOperator: getFavoritesFormOperator
}, mapStateToProps)(MoveItem);

export {MoveItemContainer};
