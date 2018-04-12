import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {PaymentsList} from './PaymentsList.jsx';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {getPaymentCardsFormOperator} from 'reduxStore/storeOperators/formOperators/paymentCardsFormOperator.js';
import {paymentCardsStoreView} from 'reduxStore/storeViews/paymentCardsStoreView.js';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView.js';
import {getGeneralOperator} from 'reduxStore/storeOperators/generalOperator.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    paymentCardsEntries: paymentCardsStoreView.getDetailedCreditCardsBook(state),
    giftCardsEntries: paymentCardsStoreView.getDetailedGiftCardsBook(state),

    onDeleteCreditCard: storeOperators.paymentCardsFormOperator.submitDeleteCreditCard,
    onSetAsDefaultCreditCard: storeOperators.paymentCardsFormOperator.submitSetAsDefaultCreditCard,
    onDeleteGiftCard: storeOperators.paymentCardsFormOperator.submitDeleteGiftCard,
    successMessage: generalStoreView.getFlashSuccessMessage(state),
    onClearSuccessMessage: storeOperators.generalOperator.clearFlashMessage
  };
}

let PaymentsListContainer = connectPlusStoreOperators({
  paymentCardsFormOperator: getPaymentCardsFormOperator,
  generalOperator: getGeneralOperator
}, mapStateToProps)(PaymentsList);
export {PaymentsListContainer};
