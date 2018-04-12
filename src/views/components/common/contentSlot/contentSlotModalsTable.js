/** @module contentSlotModalsTable
 *
 *  @author Ben
 */
import {PLCCPromoModalContainer} from 'views/components/plcc/PLCCPromoModalContainer';
import {LandingPLCCModalContainer} from 'views/components/plcc/LandingPLCCModalContainer';
import {PLCCFormContainer} from 'views/components/plcc/PLCCFormContainer.js';
import {GiftCardsModalContainer} from 'views/components/giftCard/GiftCardsModalContainer.js';
import {MODAL_IDS as PLCC_MODAL_IDS} from 'reduxStore/storeOperators/plccOperator';
import {MODAL_IDS as GC_MODAL_IDS} from 'reduxStore/storeOperators/giftcardOperator';

export const contentSlotModalsTable = {
  plccPromo: {
    modalId: PLCC_MODAL_IDS.plccPromoModalId,
    component: PLCCPromoModalContainer
    // componentProps:
  },

  wicPromo: {
    modalId: PLCC_MODAL_IDS.wicPromoModalId,
    component: LandingPLCCModalContainer
    // componentProps:
  },

  wicForm: {
    modalId: PLCC_MODAL_IDS.wicFormModalId,
    component: PLCCFormContainer,
    componentProps: {
      isModal: true,
      isInstantCredit: true
    }
  },

  gcBalance: {
    modalId: GC_MODAL_IDS.giftcardBalanceModalId,
    component: GiftCardsModalContainer
    // componentProps:
  }
};
