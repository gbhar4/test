/**
* @module EditOrNewCreditCardEntryFormContainer
* @author Agustin H. Andina Silva <asilva@minutentag.com>
*
* @TODO: mapToProps needs to match appraoch used in shipping section
*/
import {formValueSelector, isPristine} from 'redux-form';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {EditOrNewCreditCardEntryForm} from './EditOrNewCreditCardEntryForm.jsx';
import {addressesStoreView} from 'reduxStore/storeViews/addressesStoreView';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView.js';
import {paymentCardsStoreView} from 'reduxStore/storeViews/paymentCardsStoreView.js';

const mapStateToProps = function (state, ownProps, storeOperators) {
  let initialValues = ownProps.initialValues || {
    expMonth: '',
    expYear: '',
    address: {
      onFileAddressKey: (addressesStoreView.getDefaultAddress(state) || {}).addressKey
    }
  };

  let selector = formValueSelector('editOrAddCreditCardForm');
  let cardNumber = isPristine('editOrAddCreditCardForm')(state) ? initialValues.cardNumber : selector(state, 'cardNumber');

  let editingCardType = paymentCardsStoreView.getCreditCardType({ cardNumber: initialValues.cardNumber, cardType: initialValues.cardType });
  let cardType = paymentCardsStoreView.getCreditCardType({ cardNumber: cardNumber, cardType: editingCardType });
  let isPLCCPaymentEnabled = checkoutStoreView.getIsPLCCPaymentEnabled(state);

  return {
    initialValues: initialValues,
    cardType: cardType, // we need to pass the cardType as prop for CVV validation
    isPLCCEnabled: isPLCCPaymentEnabled
  };
};

export let EditOrNewCreditCardEntryFormContainer = connectPlusStoreOperators(mapStateToProps)(EditOrNewCreditCardEntryForm);
