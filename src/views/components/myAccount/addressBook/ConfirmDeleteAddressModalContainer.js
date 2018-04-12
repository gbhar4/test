/** @module ConfirmDeleteAddressModalContainer
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {ConfirmDeleteAddressModal} from './ConfirmDeleteAddressModal.jsx';
import {paymentCardsStoreView} from 'reduxStore/storeViews/paymentCardsStoreView';
import {ADDRESS_BOOK_ENTRY_PROPTYPE} from './AddressItem.jsx';

const PROP_TYPES = {
  /** Address of the item being deleted */
  deletingItem: ADDRESS_BOOK_ENTRY_PROPTYPE
};

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isAddressAssignedToCreditCard: ownProps.deletingItem !== null &&
      paymentCardsStoreView.getCreditCardByAddressId(state, ownProps.deletingItem.addressId) !== undefined,
    deletingItem: ownProps.deletingItem
  };
}

let ConfirmDeleteAddressModalContainer = connectPlusStoreOperators(mapStateToProps)(ConfirmDeleteAddressModal);
ConfirmDeleteAddressModalContainer.propTypes = {...ConfirmDeleteAddressModalContainer.propTypes, ...PROP_TYPES};

export {ConfirmDeleteAddressModalContainer};
