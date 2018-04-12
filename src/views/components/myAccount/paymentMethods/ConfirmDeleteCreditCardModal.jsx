/**
 * @module ConfirmDeleteCreditCardModal
 * Shows a confirmation modal to delete address
 *
 * @author Agu
 */

import React from 'react';
import {ConfirmationModalContainer} from 'views/components/modal/ConfirmationModalContainer';
import {CREDIT_CARD_ENTRY_PROPTYPE} from './CreditCardItem.jsx';
import {ContactInfoDisplay} from 'views/components/address/ContactInfoDisplay.jsx';
import {CONFIRM_MODAL_IDS} from 'reduxStore/storeOperators/formOperators/paymentCardsFormOperator.js';
import {ACCEPTED_CREDIT_CARDS} from 'reduxStore/storeViews/checkoutStoreView.js';

class ConfirmDeleteCreditCardModal extends React.Component {
  static propTypes = {
    /** Address of the item being deleted */
    deletingItem: CREDIT_CARD_ENTRY_PROPTYPE
  }

  render () {
    let {isMobile, deletingItem} = this.props;

    if (!deletingItem) {
      return null;
    }

    return (
      <ConfirmationModalContainer modalId={CONFIRM_MODAL_IDS.CONFIRM_DELETE_CREDIT_CARD}
        contentLabel="Delete credit card confirmation prompt"
        title={isMobile ? 'Delete card' : null}
        subtitle={isMobile ? 'Are you sure you want to delete this credit card?' : null}
        prompt={
          <div className="card-details-container">
            {!isMobile && <h2 className="title-confirmation">Are you sure you want to delete this credit card?</h2>}
            <p className="card-info">
              <img src={deletingItem.imgPath} alt={deletingItem.cardType} />
              <strong className="ending-numbers">ending in {deletingItem.cardEndingNumbers}</strong><br />
              {deletingItem.cardType !== ACCEPTED_CREDIT_CARDS['PLACE CARD'] && <strong className="expires-message">Expires on {deletingItem.expMonth}/{deletingItem.expYear}</strong>}
            </p>

            <ContactInfoDisplay address={deletingItem.address} isShowAddress />
          </div>
        }
        promptClassName="payment-method-confirm-card-delete"
        confirmButtonText="YES, DELETE"
        cancelButtonText="NO, DON'T DELETE" />
    );
  }
}

export {ConfirmDeleteCreditCardModal};
