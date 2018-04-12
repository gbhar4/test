/** @module RegisteredBillingAddressContainer
 *
 * @author Agu
 */
import {RegisteredBillingAddressMobile} from './RegisteredBillingAddressMobile.jsx';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {addressesStoreView} from 'reduxStore/storeViews/addressesStoreView';
import {getAccountFormOperator} from 'reduxStore/storeOperators/formOperators/accountFormOperator';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';

function mapStateToProps (state, ownProps, storeOperators) {
  let currentCountry = sitesAndCountriesStoreView.getCurrentCountry(state);
  return {
    addressBookEntries: addressesStoreView.getAddressBook(state),
    onNewAddressSubmit: storeOperators.accountFormOperator.submitAddAddress,
    onEditAddressSubmit: storeOperators.accountFormOperator.submitEditOnFileAddress,
    defaultCountry: currentCountry
  };
}

let RegisteredBillingAddressConnect = connectPlusStoreOperators({
  accountFormOperator: getAccountFormOperator
}, mapStateToProps);

let RegisteredBillingAddressMobileContainer = RegisteredBillingAddressConnect(RegisteredBillingAddressMobile);

export {RegisteredBillingAddressMobileContainer};
