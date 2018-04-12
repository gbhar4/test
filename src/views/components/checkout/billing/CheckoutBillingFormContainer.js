/** @module CheckoutBillingFormContainer
 *
 * @author Ben
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {formValueSelector, isPristine} from 'redux-form';
import {CheckoutBillingForm} from './CheckoutBillingForm.jsx';
import {getCheckoutOperator} from 'reduxStore/storeOperators/checkoutOperator.js';
import {getCheckoutSignalsOperator} from 'reduxStore/storeOperators/uiSignals/checkoutSignalsOperator';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView.js';
import {paymentCardsStoreView} from 'reduxStore/storeViews/paymentCardsStoreView.js';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';

const ERRORS_MAP = require('service/WebAPIServiceAbstractors/errorMapping.json');

function mapStateToProps (state, ownProps, storeOperators) {
  let isPaymentDisabled = checkoutStoreView.getIsPaymentDisabled(state);
  let isPaypalEnabled = cartStoreView.getIsPayPalEnabled(state);
  let isAbandonPayPalMethod = checkoutStoreView.getIsAbandonPaypal(state);
  let isPaypalSelected = checkoutStoreView.getIsPaypalMethodSelected(state);
  let isShippingRequired = checkoutStoreView.getIsShippingRequired(state);

  let initialValues = checkoutStoreView.getInitialBillingSectionValues(state);

  // REVIEW: we need to validate CVV length based of the type of the card. But we cannot bind to the cardNumber
  // because the cardNumber might be encoded for registered users, or user comming back from review to billing
  // we have no field for type, but we do have the card type in memory, so I'm passing it to some new validators as prop
  let creditCardEntries = checkoutStoreView.getDetailedCreditCardsBook(state);
  let selector = formValueSelector('checkoutBilling');
  let onFileCardId = creditCardEntries.length > 0 && selector(state, 'onFileCardId');
  let cardType;

  if (onFileCardId) {
    cardType = paymentCardsStoreView.getDetailedCreditCardById(state, onFileCardId).cardType;
  } else {
    let cardNumber = isPristine('checkoutBilling')(state) ? initialValues.cardNumber : selector(state, 'cardNumber');
    let checkoutDetails = checkoutStoreView.getBillingValues(state);
    let editingCardType = paymentCardsStoreView.getCreditCardType(checkoutDetails.billing);
    cardType = paymentCardsStoreView.getCreditCardType({ cardNumber: cardNumber, cardType: editingCardType });
  }

  let isPLCCPaymentEnabled = checkoutStoreView.getIsPLCCPaymentEnabled(state);
  let shippingValues = checkoutStoreView.getShippingDestinationValues(state);

  return {
    currentShippingDetails: shippingValues,
    setBillingAddressSameAsShipping: storeOperators.checkoutOperator.setBillingAddressSameAsShipping,
    onSubmitSuccess: storeOperators.checkoutSignalsOperator.openReviewSectionForm,
    isPaypalEnabled: isPaypalEnabled,
    isPaymentDisabled: isPaymentDisabled,
    isPaypalSelected: isPaypalSelected,
    isAbandonPayPalMethod: isAbandonPayPalMethod,
    isSameAsShippingEnabled: isShippingRequired,
    cardType: cardType, // we need to pass the cardType as prop for CVV validation
    isPLCCEnabled: isPLCCPaymentEnabled,
    initialValues: initialValues,
    isCountryUS: sitesAndCountriesStoreView.getCurrentCountry(state) === 'US',
    isEditingMode: checkoutStoreView.getIsEditingSubform(state),
    isInactivePayment: checkoutStoreView.getIsInactivePayment(state),
    inactivePaymentError: ERRORS_MAP['_RTPS_INACTIVE_PAYMENT']
  };
}

export let CheckoutBillingFormContainer = connectPlusStoreOperators(
  {
    checkoutOperator: getCheckoutOperator,
    checkoutSignalsOperator: getCheckoutSignalsOperator
  },
  mapStateToProps, undefined, undefined, {withRef: true}
)(CheckoutBillingForm);
