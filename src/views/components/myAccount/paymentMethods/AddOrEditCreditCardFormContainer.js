import {PropTypes} from 'prop-types';
import {formValueSelector, isPristine} from 'redux-form';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {AddOrEditCreditCardForm} from './AddOrEditCreditCardForm.jsx';
import {addressesStoreView} from 'reduxStore/storeViews/addressesStoreView';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {getPaymentCardsFormOperator} from 'reduxStore/storeOperators/formOperators/paymentCardsFormOperator.js';
import {paymentCardsStoreView} from 'reduxStore/storeViews/paymentCardsStoreView';

const PROP_TYPES = {
  /** match prop passed by Route component */
  match: PropTypes.shape({
    params: PropTypes.object.isRequired
  }).isRequired
};

function mapStateToProps (state, ownProps, storeOperators) {
  let isEditingForm = false;
  let creditCardEntry = {};
  let defaultAddress = addressesStoreView.getDefaultAddress(state) || {};
  let cardType;
  let formName = 'addOrEditCreditCardForm';
  let selector = formValueSelector(formName);

  if (ownProps.match.params.creditCardId) {
    // editing card
    isEditingForm = true;
    creditCardEntry = paymentCardsStoreView.getDetailedCreditCardById(state, ownProps.match.params.creditCardId);
    cardType = creditCardEntry.cardType;
  }

  let initialValues = {
    ...creditCardEntry,
    address: {
      onFileAddressKey: creditCardEntry.addressKey || defaultAddress.addressKey, // selected for edit, default for new
      country: sitesAndCountriesStoreView.getCurrentSiteId(state).toUpperCase()
    }
  };

  let cardNumber = isPristine(formName)(state) ? initialValues.cardNumber : selector(state, 'cardNumber');
  cardType = paymentCardsStoreView.getCreditCardType({ cardNumber: cardNumber, cardType: cardType });

  // get selected address country to disable PLCC
  let addressKey = selector(state, 'address.onFileAddressKey');
  let addressEntry = addressKey && addressesStoreView.getAddressByKey(state, addressKey);
  let country = (addressEntry && addressEntry.address.country) || selector(state, 'address.country') || sitesAndCountriesStoreView.getCurrentCountry(state);

  return {
    isPLCCEnabled: country === 'US', // FIXME: put somewhere else (maybe nowhere and have backend validate)
    isMobile: routingInfoStoreView.getIsMobile(state),
    isEditingForm,
    addressBookEntries: addressesStoreView.getAddressBook(state),
    isAddressVerifyModalOpen: addressesStoreView.isVerifyAddressModalOpen(state),
    cardType,
    initialValues,
    onSubmit: isEditingForm ? storeOperators.paymentCardsFormOperator.submitEditCreditCard : storeOperators.paymentCardsFormOperator.submitAddCreditCard
  };
}

let AddOrEditCreditCardFormContainer = connectPlusStoreOperators({
  paymentCardsFormOperator: getPaymentCardsFormOperator
}, mapStateToProps)(AddOrEditCreditCardForm);
AddOrEditCreditCardFormContainer.propTypes = {...AddOrEditCreditCardFormContainer.propTypes, ...PROP_TYPES};

export {AddOrEditCreditCardFormContainer};
