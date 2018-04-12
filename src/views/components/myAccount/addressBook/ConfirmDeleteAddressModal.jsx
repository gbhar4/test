/**
 * @module ConfirmDeleteAddressModal
 * Shows a confirmation modal to delete address
 *
 * @author Damian <drossi@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {ConfirmationModalContainer} from 'views/components/modal/ConfirmationModalContainer';
import {ADDRESS_BOOK_ENTRY_PROPTYPE} from './AddressItem.jsx';
import {ContactInfoDisplay} from 'views/components/address/ContactInfoDisplay.jsx';
import {CONFIRM_MODAL_IDS} from 'reduxStore/storeOperators/formOperators/accountFormOperator.js';

class ConfirmDeleteAddressModal extends React.Component {
  static propTypes = {
    /** address of the item being deleted */
    deletingItem: ADDRESS_BOOK_ENTRY_PROPTYPE,
    /** flags if the address is associated with a credit card */
    isAddressAssignedToCreditCard: PropTypes.bool.isRequired
  }

  render () {
    let {isMobile, deletingItem, isAddressAssignedToCreditCard} = this.props;

    if (!deletingItem) {
      return null;
    }

    return (
      <ConfirmationModalContainer modalId={CONFIRM_MODAL_IDS.CONFIRM_DELETE}
        title={isMobile ? 'Delete address' : null}
        subtitle={isMobile ? 'Are you sure you want to delete this address?' : null}
        contentLabel="Delete address confirmation prompt"
        prompt={
          <div className="card-details-container">
            {!isMobile && <h2 className="title-confirmation">Are you sure you want to delete this address?</h2>}
            {isAddressAssignedToCreditCard && <p className="credit-card-associated-warning">Credit cards associated to this address will also be deleted.</p>}
            <ContactInfoDisplay address={deletingItem.address} phoneNumber={deletingItem.phoneNumber} isShowAddress isShowPhone />
          </div>
        }
        promptClassName="address-book-confirm-address-delete" />
    );
  }
}

export {ConfirmDeleteAddressModal};
