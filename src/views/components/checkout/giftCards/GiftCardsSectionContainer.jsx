/**
* @module GiftCardsSection
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* Exports the container component for the GiftCardsSection component,
* connecting state to it's props.
*/
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {GiftCardsSection} from './GiftCardsSection.jsx';

import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView';
import {getCheckoutFormOperator} from 'reduxStore/storeOperators/formOperators/checkoutFormOperator.js';

import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';

function mapStateToProps (state, ownProps, storeOperators) {
  let isEnableAddGiftCardForm = checkoutStoreView.getIsAddGiftCardEnabled(state);
  let isEnableRemoveItem = checkoutStoreView.getIsRemoveGiftCardEnabled(state);

  let orderBalanceTotal = cartStoreView.getSummary(state).orderBalanceTotal;
  let isDisabledApply = orderBalanceTotal === 0;

  return {
    appliedGiftCards: checkoutStoreView.getGiftCards(state),
    availableGiftCards: checkoutStoreView.getAvailableGiftCards(state),
    isEnableAddGiftCardForm: isEnableAddGiftCardForm,
    isEnableRemoveItem: isEnableRemoveItem,
    maxGiftCards: checkoutStoreView.getMaxGiftCards(state),
    onRemoveItem: storeOperators.checkoutFormOperator.removeGiftCardFromOrder,
    onApplyItem: storeOperators.checkoutFormOperator.applyExistingGiftCardToOrder,
    isDisabledApply: isDisabledApply
  };
}

const GiftCardsSectionContainer = connectPlusStoreOperators({
  checkoutFormOperator: getCheckoutFormOperator
}, mapStateToProps)(GiftCardsSection);

export {GiftCardsSectionContainer};
