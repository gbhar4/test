/**
* @module AddGiftCardFormConnect
* @author Agustin H. Andina Silva <asilva@minutentag.com>
*
* @TODO: mapToProps, confirm with Ben about balance
*/

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {getCheckoutFormOperator} from 'reduxStore/storeOperators/formOperators/checkoutFormOperator.js';
// import {getPaymentCardsFormOperator} from 'reduxStore/storeOperators/formOperators/paymentCardsFormOperator.js';
import {paymentCardsStoreView} from 'reduxStore/storeViews/paymentCardsStoreView.js';
import {userStoreView} from 'reduxStore/storeViews/userStoreView.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    saveToAccountEnabled: !userStoreView.isGuest(state),
    giftCardBalance: paymentCardsStoreView.getLastGiftCardLookUpBalance(state),
    onSubmit: storeOperators.checkoutFormOperator.applyGiftCardToOrder
    // onCheckBalance: storeOperators.paymentCardsFormOperator.submitGetGiftCardBalance
  };
}

const AddGiftCardFormConnect = connectPlusStoreOperators({
  checkoutFormOperator: getCheckoutFormOperator
  // paymentCardsFormOperator: getPaymentCardsFormOperator
}, mapStateToProps);

export {AddGiftCardFormConnect};
