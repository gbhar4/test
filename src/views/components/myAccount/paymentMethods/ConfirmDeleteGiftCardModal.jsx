/**
 * @module ConfirmDeleteGiftCardModal
 * Shows a confirmation modal to delete address
 *
 * @author Agu
 */

import React from 'react';
import {ConfirmationModalContainer} from 'views/components/modal/ConfirmationModalContainer';
import {GIFT_CARD_ENTRY_PROPTYPE} from './GiftCardItem.jsx';
import {CONFIRM_MODAL_IDS} from 'reduxStore/storeOperators/formOperators/paymentCardsFormOperator.js';

class ConfirmDeleteGiftCardModal extends React.Component {
  static propTypes = {
    /** Address of the item being deleted */
    deletingItem: GIFT_CARD_ENTRY_PROPTYPE
  }

  render () {
    let {isMobile, deletingItem} = this.props;

    if (!deletingItem) {
      return null;
    }

    return (
      <ConfirmationModalContainer modalId={CONFIRM_MODAL_IDS.CONFIRM_DELETE_GIFT_CARD}
        title={isMobile ? 'Delete giftcard' : null}
        subtitle={isMobile ? 'Are you sure you want to delete this gift card?' : null}
        contentLabel="Delete gift card confirmation prompt"
        prompt={
          <div className="card-details-container">
            {!isMobile && <h2 className="title-confirmation">Are you sure you want to delete this gift card?</h2>}
            <p className="card-info">
              <img src={deletingItem.imgPath} alt="Card icon" />
              <strong className="ending-numbers">ending in {deletingItem.cardEndingNumbers}</strong>
            </p>
          </div>
        }
        promptClassName="payment-method-confirm-card-delete"
        confirmButtonText="YES, DELETE"
        cancelButtonText="NO, DON'T DELETE" />
    );
  }
}

export {ConfirmDeleteGiftCardModal};
