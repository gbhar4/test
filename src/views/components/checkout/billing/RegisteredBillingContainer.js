/**
* @module RegisteredBillingContainer
* @author Agustin H. Andina Silva <asilva@minutentag.com>
*
* @TODO: mapToProps needs to match appraoch used in shipping section
*/
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {RegisteredBilling} from './RegisteredBilling.jsx';
import {RegisteredBillingMobile} from './RegisteredBillingMobile.jsx';
import {addressesStoreView} from 'reduxStore/storeViews/addressesStoreView';
// import {paymentCardsStoreView} from 'reduxStore/storeViews/paymentCardsStoreView';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView';
import {getCheckoutFormOperator} from 'reduxStore/storeOperators/formOperators/checkoutFormOperator.js';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {getPaymentCardsFormOperator} from 'reduxStore/storeOperators/formOperators/paymentCardsFormOperator.js';
import {getCheckoutSignalsOperator} from 'reduxStore/storeOperators/uiSignals/checkoutSignalsOperator';

import {formValueSelector} from 'redux-form';
import {paymentCardsStoreView} from 'reduxStore/storeViews/paymentCardsStoreView.js';

const mapStateToProps = function (state, ownProps, storeOperators) {
  let creditCardEntries = checkoutStoreView.getDetailedCreditCardsBook(state);
  let isPLCCPaymentEnabled = checkoutStoreView.getIsPLCCPaymentEnabled(state);

  // FIXME: this code is repeated in several places, we should think of a centralized place for it
  // INI
  let selector = formValueSelector('editCreditCardForm');
  let cardNumber = selector(state, 'cardNumber');
  let onFileCardId = selector(state, 'onFileCardId');
  let editingCardType;

  if (onFileCardId) {
    editingCardType = paymentCardsStoreView.getDetailedCreditCardById(state, onFileCardId).cardType;
  }

  let card = { cardNumber: cardNumber, cardType: editingCardType };
  let cardType = paymentCardsStoreView.getCreditCardType(card);
  let cardIcon = paymentCardsStoreView.getCreditCardIcon(card);

  if (!cardNumber || !cardType) {
    let billingValues = checkoutStoreView.getBillingValues(state);
    card = billingValues.billing || {};
    cardType = paymentCardsStoreView.getCreditCardType(card);
    cardIcon = paymentCardsStoreView.getCreditCardIcon(card);
  }
  // END

  return {
    cardType,
    cardIcon,

    isPaypalEnabled: cartStoreView.getIsPayPalEnabled(state),
    addressBookEntries: addressesStoreView.getAddressBook(state),
    creditCardEntries: creditCardEntries,

    onEditCardSubmit: storeOperators.paymentCardsFormOperator.submitEditCreditCardForCheckout,
    onNewCardSubmit: storeOperators.checkoutFormOperator.submitNewAccountCard,
    onEditModeChange: storeOperators.checkoutSignalsOperator.setIsEditingSubform,

    isSameAsShippingEnabled: checkoutStoreView.getIsShippingRequired(state),
    isSaveCCToAccountEnabled: true,
    isSetCCAsDefaultEnabled: true,

    isPLCCEnabled: isPLCCPaymentEnabled,
    isCountryUS: sitesAndCountriesStoreView.getCurrentCountry(state) === 'US'
  };
};

let RegisteredBillingConnect = connectPlusStoreOperators({
  checkoutFormOperator: getCheckoutFormOperator,
  paymentCardsFormOperator: getPaymentCardsFormOperator,
  checkoutSignalsOperator: getCheckoutSignalsOperator
}, mapStateToProps);

let RegisteredBillingContainer = RegisteredBillingConnect(RegisteredBilling);
let RegisteredBillingMobileContainer = RegisteredBillingConnect(RegisteredBillingMobile);

export {RegisteredBillingContainer, RegisteredBillingMobileContainer};
