/** @module EditAddressContainer
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import {PropTypes} from 'prop-types';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {EditOrNewAddressBookEntryForm} from 'views/components/address/EditOrNewAddressBookEntryForm.jsx';
import {getAccountFormOperator} from 'reduxStore/storeOperators/formOperators/accountFormOperator';
import {getRoutingOperator} from 'reduxStore/storeOperators/routingOperator.js';
import {addressesStoreView} from 'reduxStore/storeViews/addressesStoreView.js';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';

const PROP_TYPES = {
  /** match prop passed by Route component */
  match: PropTypes.shape({
    params: PropTypes.object.isRequired
  }).isRequired
};

function mapStateToProps (state, ownProps, storeOperators) {
  // FIXME: we should not create functions in mapStateToProps, but there currently
  // is no other way to grab to store in containers and pass it to the factory
  // method of operators.
  const redirectToAddressBook =
    () => storeOperators.routing.pushLocation(MY_ACCOUNT_SECTIONS.addressBook);

  let editingAddress =
    addressesStoreView.getAddressByAddressId(state, ownProps.match.params.addressId);

  return {
    onCancelClick: redirectToAddressBook,
    onSubmit: storeOperators.accountForm.submitEditAddressOnAccount,
    onSubmitSuccess: redirectToAddressBook,
    isShowSaveToAccount: false,
    initialValues: editingAddress
      ? {
        ...editingAddress,
        setAsDefault: editingAddress.isDefault
      }
      : {}
  };
}

let EditAddressContainer = connectPlusStoreOperators({
  accountForm: getAccountFormOperator,
  routing: getRoutingOperator
}, mapStateToProps)(EditOrNewAddressBookEntryForm);
EditAddressContainer.propTypes = {...EditAddressContainer.propTypes, ...PROP_TYPES};

export {EditAddressContainer};
