/** @module CheckoutWizardContainer
 *
 * @author Ben
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView';
import {getCheckoutFormOperator} from 'reduxStore/storeOperators/formOperators/checkoutFormOperator.js';
import {getCheckoutSignalsOperator} from 'reduxStore/storeOperators/uiSignals/checkoutSignalsOperator';
import {getAddressesOperator} from 'reduxStore/storeOperators/addressesOperator';
import {addressesStoreView} from 'reduxStore/storeViews/addressesStoreView';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {CheckoutWizard} from './CheckoutWizard.jsx';
import {MODAL_IDS} from 'reduxStore/storeOperators/plccOperator';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    itemsCount: cartStoreView.getItemsCount(state),
    isGuest: userStoreView.isGuest(state),
    isMobile: routingInfoStoreView.getIsMobile(state),

    isExpressCheckout: checkoutStoreView.isExpressCheckout(state),
    activeStage: checkoutStoreView.getCheckoutStage(state),

    isAddressVerifyModalOpen: addressesStoreView.isVerifyAddressModalOpen(state),
    onPickupSubmit: storeOperators.checkoutFormOperator.submitPickupSection,
    onShippingSubmit: storeOperators.checkoutFormOperator.submitShippingSection,
    onBillingSubmit: storeOperators.checkoutFormOperator.submitBillingSection,
    onReviewSubmit: storeOperators.checkoutFormOperator.submitOrderForProcessing,

    activeStep: checkoutStoreView.getCheckoutStage(state),
    moveToCheckoutStage: storeOperators.checkoutSignalsOperator.moveToStage,
    availableStages: storeOperators.checkoutSignalsOperator.getAvailableStages(),

    // isPlccOfferModalOpen: generalStoreView.getOpenModalId(state) === MODAL_IDS.plccPromoModalId,
    isPlccFormModalOpen: generalStoreView.getOpenModalId(state) === MODAL_IDS.plccFormModalId
  };
}

let CheckoutWizardContainer = connectPlusStoreOperators(
  {
    checkoutFormOperator: getCheckoutFormOperator,
    checkoutSignalsOperator: getCheckoutSignalsOperator,
    addressesOperator: getAddressesOperator
  },
  mapStateToProps)(CheckoutWizard);
export {CheckoutWizardContainer};
