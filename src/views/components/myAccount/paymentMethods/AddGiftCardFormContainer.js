import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {AddGiftCardForm} from './AddGiftCardForm.jsx';
import {getPaymentCardsFormOperator} from 'reduxStore/storeOperators/formOperators/paymentCardsFormOperator.js';
import {paymentCardsStoreView} from 'reduxStore/storeViews/paymentCardsStoreView.js';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    giftCardBalance: paymentCardsStoreView.getLastGiftCardLookUpBalance(state),
    clearGiftCardBalance: storeOperators.paymentCardsFormOperator.clearGiftCardBalance,
    onSubmit: storeOperators.paymentCardsFormOperator.submitAddGiftCard,
    // onCheckBalance: storeOperators.paymentCardsFormOperator.submitGetGiftCardBalance,
    isRecapchaEnabled: generalStoreView.getIsRecapchaEnabled(state)
  };
}

let AddGiftCardFormContainer = connectPlusStoreOperators({
  paymentCardsFormOperator: getPaymentCardsFormOperator
}, mapStateToProps)(AddGiftCardForm);
export {AddGiftCardFormContainer};
