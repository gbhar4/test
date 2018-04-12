/**
* @module CheckBalanceFormContainer
* @author Agustin H. Andina Silva <asilva@minutentag.com>
*/
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {CheckBalanceForm} from 'views/components/myAccount/paymentMethods/CheckBalanceForm.jsx';
import {getPaymentCardsFormOperator} from 'reduxStore/storeOperators/formOperators/paymentCardsFormOperator.js';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    form: 'giftCardBalance-' + ownProps.giftCardEntry.onFileCardId,
    onCheckBalance: storeOperators.paymentCardsFormOperator.submitGetGiftCardBalance,
    isRecapchaEnabled: generalStoreView.getIsRecapchaEnabled(state)
  };
}

let CheckBalanceFormContainer = connectPlusStoreOperators({
  paymentCardsFormOperator: getPaymentCardsFormOperator
}, mapStateToProps)(CheckBalanceForm);

export {CheckBalanceFormContainer};
