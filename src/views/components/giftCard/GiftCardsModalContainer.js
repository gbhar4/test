/** @module GiftCardsModalContainer
 *
 * @author Agu
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {GiftCardsModal} from './GiftCardsModal.jsx';
import {getPaymentCardsFormOperator} from 'reduxStore/storeOperators/formOperators/paymentCardsFormOperator.js';
import {paymentCardsStoreView} from 'reduxStore/storeViews/paymentCardsStoreView.js';
import {getGeneralOperator} from 'reduxStore/storeOperators/generalOperator';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    giftCardBalance: paymentCardsStoreView.getLastGiftCardLookUpBalance(state),
    onSubmit: storeOperators.paymentCardsFormOperator.submitGetGiftCardBalance,
    onClose: storeOperators.paymentCardsFormOperator.closeGiftCardModal
  };
}

let GiftCardsModalContainer = connectPlusStoreOperators({
  paymentCardsFormOperator: getPaymentCardsFormOperator,
  generalOperator: getGeneralOperator
}, mapStateToProps
)(GiftCardsModal);

export {GiftCardsModalContainer};
