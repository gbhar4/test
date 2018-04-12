/**
 * @module CheckoutBillingForm
 * @author Agustin H. Andina Silva <asilva@minutentag.com>
 *
 * TODO: fix paypal vs cc payment render
 * TODO: add paypal modals
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {reduxForm} from 'redux-form';
import cssClassName from 'util/viewUtil/cssClassName.js';

import {CheckoutProgressListContainer} from 'views/components/checkout/checkoutProgressList/CheckoutProgressListContainer.jsx';
import {GiftCardsSectionContainer} from 'views/components/checkout/giftCards/GiftCardsSectionContainer.jsx';
import {CheckoutSummarySidebarContainer} from 'views/components/orderSummary/CheckoutSummarySidebarContainer';

import {GuestBillingFormPart} from './GuestBillingFormPart.jsx';
import {RegisteredBillingMobileContainer, RegisteredBillingContainer} from './RegisteredBillingContainer.js';
import {RegisteredBilling} from './RegisteredBilling.jsx';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {getAdaptiveFormPart} from 'reduxStore/util/adaptiveFormPart.js';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {FormValuesChangeTrigger} from 'reduxStore/util/FormValuesChangeTrigger.jsx';
import {scrollToFirstFormError} from 'util/formsValidation/scrollToFirstFormError';

if (DESKTOP) { // eslint-disable-line
  require('./_d.checkout-billing.scss');
} else {
  require('./_m.checkout-billing.scss');
}

class _CheckoutBillingForm extends React.Component {
  static propTypes = {
    /** indicates device (mobile vs desktop) */
    isMobile: PropTypes.bool.isRequired,

    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool.isRequired,

    /** true means paypal payment method enabled */
    isPaypalEnabled: PropTypes.bool.isRequired,

    /** This flag indicates if the modal is open when the user abandon checkout with Paypal */
    // REVIEW: I'm not sure if this modal should be here or with the return button.
    isAbandonPayPalMethod: PropTypes.bool.isRequired,

    /** true means order does not require any additional payment information (payed with GC) */
    isPaymentDisabled: PropTypes.bool.isRequired,

    /**
     * callback setting the values of the address fields of this section
     * to be the same as the shipping address. accepts a parameter
     * that is a function that can change the values of a form field
     */
    setBillingAddressSameAsShipping: PropTypes.func.isRequired,

    /** bopis orders don't require shipping, so "same as shipping" shouldn't be visible */
    isSameAsShippingEnabled: PropTypes.bool.isRequired,

    /** the selected shipping address details.
     * Required if the prop isSameAsShippingEnabled is true */
    currentShippingDetails: RegisteredBilling.propTypes.currentShippingDetails,

    /** This is a flag to enable us to toggle between copy changes for internationalization */
    isCountryUS: PropTypes.bool
  }

  constructor (props) {
    super(props);

    this.handleUseShippingAddress = this.handleUseShippingAddress.bind(this);
    this.handleCardSelectionChange = this.handleCardSelectionChange.bind(this);
    this.mapValuesToCountryMessageDisplay = this.mapValuesToCountryMessageDisplay.bind(this);
  }

  handleCardSelectionChange () {
    this.props.change('cvv', '');
    this.props.untouch('cvv');
  }

  mapValuesToCountryMessageDisplay (values) {
    let {currentShippingDetails} = this.props;
    // BOPIS only don't have currentShippingDetails
    return {
      isEnabledMessage: currentShippingDetails && currentShippingDetails.address && values.address.country !== currentShippingDetails.address.country
    };
  }

  handleUseShippingAddress () {
    this.props.setBillingAddressSameAsShipping(this.props.change);
  }

  render () {
    let {isSameAsShippingEnabled, isGuest, isMobile, isPaypalEnabled, isPaypalSelected,
      isPaymentDisabled, isInactivePayment, inactivePaymentError, currentShippingDetails, error, isCountryUS, change, untouch} = this.props;
    let containerClassName = cssClassName('checkout-billing-container');
    let paymentInformationClassName = cssClassName('payment-information-container', {' billing-form-disabled': isPaymentDisabled});

    return (
      <div className={containerClassName}>
        <section className="checkout-content">
          {!isMobile && <CheckoutProgressListContainer />}

          <GiftCardsSectionContainer isHideNoneApplied className="checkout-billing-section" />

          {error && <ErrorMessage error={error} />}
          {isInactivePayment && <ErrorMessage error={inactivePaymentError.errorMessage} />}

          {!isPaymentDisabled &&
            <div className={paymentInformationClassName}>
              {isGuest
                ? <GuestBillingFormPart isMobile={isMobile} isPaypalEnabled={isPaypalEnabled}
                  setAddressValuesSameAsShipping={this.handleUseShippingAddress}
                  isSameAsShippingEnabled={isSameAsShippingEnabled}
                  currentShippingDetails={currentShippingDetails} isCountryUS={isCountryUS} />
                : isMobile
                  ? <RegisteredBillingMobileContainer isMobile isSameAsShippingEnabled={isSameAsShippingEnabled}
                    currentShippingDetails={currentShippingDetails} change={change} untouch={untouch} />
                  : <RegisteredBillingContainer isSameAsShippingEnabled={isSameAsShippingEnabled}
                    currentShippingDetails={currentShippingDetails} change={change} untouch={untouch} />
              }
            </div>
          }

          {!isPaypalSelected && <CountryWarningMessageDisplay adaptTo="address.country" isEditingMode={this.props.isEditingMode} mapValuesToProps={this.mapValuesToCountryMessageDisplay} />}
          <FormValuesChangeTrigger adaptTo={'onFileCardId'} onChange={this.handleCardSelectionChange} />
        </section>
        <CheckoutSummarySidebarContainer />
      </div>
    );
  }
}

let CountryWarningMessageDisplay = getAdaptiveFormPart((props) => {
  let errorClassName = cssClassName('error-box', ' warning-box', {' error-message-edit-form': props.isEditingMode});
  return props.isEnabledMessage
      ? <ErrorMessage className={errorClassName}
        error="Because your Billing Country is different than your Ship To Country, you will be subject to the exchange rate charged by your bank or credit card company for foreign currency conversions at the time the order is placed. Any returns will be refunded in the currency originally charged at the time of purchase. The Children's Place is not responsible for any additional bank or credit card fees or for costs related to the currency conversion fees applied by your bank or  credit card company." />
      : null;
});

let validateMethod = createValidateMethod(GuestBillingFormPart.defaultValidation);

export let CheckoutBillingForm = reduxForm({
  form: 'checkoutBilling',
  ...validateMethod,
  onSubmitFail: (errors, dispatch, submitError, props) => scrollToFirstFormError(props.form),
  enableReinitialize: true,
  forceUnregisterOnUnmount: false,
  destroyOnUnmount: false
})(_CheckoutBillingForm);
