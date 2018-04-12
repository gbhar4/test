/**
* @module ModalAddressVerificationFormContainer
* @author Agustin H. Andina Silva <asilva@minutentag.com>
*
* @TODO: mapToProps needs to match approach used in country selector
*/
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {ModalAddressVerificationForm} from './ModalAddressVerificationForm.jsx';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {addressesStoreView} from 'reduxStore/storeViews/addressesStoreView';
import {getCheckoutFormOperator} from 'reduxStore/storeOperators/formOperators/checkoutFormOperator';
import {VERIFICATION_STATUS} from 'reduxStore/storeReducersAndActions/addresses/addresses.js';

let mapStateToProps = function (state, ownProps, storeOperators) {
  return {
    isMobile: routingInfoStoreView.getIsMobile(state),

    originalAddress: addressesStoreView.getAddressPendingVerification(state),
    addressSuggestionsList: addressesStoreView.getSuggestedAddresses(state),
    onSubmit: addressesStoreView.getAddressVerifySubmitCallback(state),
    onModalClose: addressesStoreView.getAddressVerifyDismissCallback(state),
    displayAptMissingForm: addressesStoreView.getAddressVerificationStatus(state) === VERIFICATION_STATUS.APARTMENT_MISSING,
    modalSubTitle: addressesStoreView.getAddressVerificationMessage(state)
  };
};

let ModalAddressVerificationFormContainer = connectPlusStoreOperators(
  {checkoutFormOperator: getCheckoutFormOperator},
  mapStateToProps
)(ModalAddressVerificationForm);

export {ModalAddressVerificationFormContainer};
