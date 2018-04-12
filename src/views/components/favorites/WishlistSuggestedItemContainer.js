import {PropTypes} from 'prop-types';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {WishlistSuggestedItem} from './WishlistSuggestedItem.jsx';
import {favoritesStoreView} from 'reduxStore/storeViews/favoritesStoreView';
import {getFavoritesOperator} from 'reduxStore/storeOperators/favoritesOperator.js';
import {getFavoritesFormOperator} from 'reduxStore/storeOperators/formOperators/favoritesFormOperator.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';

const PROP_TYPES = {
  /** id of the wishlist item for which to show a suggestion */
  itemId: PropTypes.string.isRequired
};

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    isOpen: favoritesStoreView.getCurrentSuggestionSourceItemId(state) === ownProps.itemId,
    product: favoritesStoreView.getCurrentSuggestedProduct(state),

    onReplaceWishlistItem: storeOperators.favoritesFormOperator.submitReplaceWishlistItem,
    onClose: storeOperators.favoritesOperator.clearItemSuggestion,
    onOpen: storeOperators.favoritesOperator.loadItemSuggestion,
//    isShowBopisButton: !sitesAndCountriesStoreView.getIsCanada(state)
    currencySymbol: sitesAndCountriesStoreView.getCurrentCurrencySymbol(state)
  };
}

export let WishlistSuggestedItemContainer = connectPlusStoreOperators({
  favoritesFormOperator: getFavoritesFormOperator,
  favoritesOperator: getFavoritesOperator
}, mapStateToProps)(WishlistSuggestedItem);
WishlistSuggestedItemContainer.propTypes = {...WishlistSuggestedItemContainer.propTypes, ...PROP_TYPES};
