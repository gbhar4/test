/** @module RegisteredShippingAddressContainer
 *
 * @author Ben
 */
import {RegisteredShippingAddress} from './RegisteredShippingAddress.jsx';
import {RegisteredShippingAddressMobile} from './RegisteredShippingAddressMobile.jsx';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {addressesStoreView} from 'reduxStore/storeViews/addressesStoreView';
import {getAccountFormOperator} from 'reduxStore/storeOperators/formOperators/accountFormOperator';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';

function mapStateToProps (state, ownProps, storeOperators) {
  let currentCountry = sitesAndCountriesStoreView.getCurrentCountry(state);
  return {
    addressBookEntries: addressesStoreView.getAddressBook(state, currentCountry, true),
    onNewAddressSubmit: storeOperators.accountFormOperator.submitAddAddress,
    onEditAddressSubmit: storeOperators.accountFormOperator.submitEditOnFileAddress,
    defaultCountry: currentCountry
  };
}

let RegisteredShippingAddressConnect = connectPlusStoreOperators({
  accountFormOperator: getAccountFormOperator
}, mapStateToProps);

let RegisteredShippingAddressContainer = RegisteredShippingAddressConnect(RegisteredShippingAddress);
let RegisteredShippingAddressMobileContainer = RegisteredShippingAddressConnect(RegisteredShippingAddressMobile);

export {RegisteredShippingAddressContainer, RegisteredShippingAddressMobileContainer};
