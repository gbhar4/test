/** @module AddressBookContainer
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {AddressBook} from './AddressBook.jsx';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {addressesStoreView} from 'reduxStore/storeViews/addressesStoreView';
import {getAccountFormOperator} from 'reduxStore/storeOperators/formOperators/accountFormOperator.js';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView.js';
import {getGeneralOperator} from 'reduxStore/storeOperators/generalOperator.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    addressItems: addressesStoreView.getAddressBook(state),
    onDeleteItem: storeOperators.accountFormOperator.deleteAddress,
    onSetAsDefaultAddress: storeOperators.accountFormOperator.setDefaultAddress,
    isAddressVerifyModalOpen: addressesStoreView.isVerifyAddressModalOpen(state),
    successMessage: generalStoreView.getFlashSuccessMessage(state),
    onClearSuccessMessage: storeOperators.generalOperator.clearFlashMessage
  };
}

let AddressBookContainer = connectPlusStoreOperators({
  accountFormOperator: getAccountFormOperator,
  generalOperator: getGeneralOperator
}, mapStateToProps)(AddressBook);

export {AddressBookContainer};
