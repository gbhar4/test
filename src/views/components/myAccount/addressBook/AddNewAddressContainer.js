/** @module AddNewAddressContainer
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {EditOrNewAddressBookEntryForm} from 'views/components/address/EditOrNewAddressBookEntryForm.jsx';
import {getAccountFormOperator} from 'reduxStore/storeOperators/formOperators/accountFormOperator';
import {getRoutingOperator} from 'reduxStore/storeOperators/routingOperator.js';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {addressesStoreView} from 'reduxStore/storeViews/addressesStoreView.js';

function mapStateToProps (state, ownProps, storeOperators) {
  // FIXME: we shouldn't create functions in mapStateToProps, but there currently
  // is no other way to grab to store in containers and pass it to the factory
  // method of operators.
  const redirectToAddressBook =
    () => storeOperators.routing.pushLocation(MY_ACCOUNT_SECTIONS.addressBook);

  let isEmptyAddressBook = addressesStoreView.getAddressBook(state).length === 0;

  return {
    onCancelClick: redirectToAddressBook,
    onSubmit: storeOperators.accountForm.submitAddAddressToAccount,
    onSubmitSuccess: redirectToAddressBook,
    isShowSaveToAccount: false,
    isSetAsDefaultDisabled: isEmptyAddressBook,
    initialValues: {
      address: {
        country: sitesAndCountriesStoreView.getCurrentSiteId(state).toUpperCase()
      },
      setAsDefault: isEmptyAddressBook
    }
  };
}

let AddNewAddressContainer = connectPlusStoreOperators({
  accountForm: getAccountFormOperator,
  routing: getRoutingOperator
}, mapStateToProps)(EditOrNewAddressBookEntryForm);

export {AddNewAddressContainer};
