/**
* @module CheckoutReviewForm
* @author Agustin H. Andina Silva <asilva@minutentag.com>
*/

import React from 'react';
import {PropTypes} from 'prop-types';

import {CheckoutProgressListContainer} from 'views/components/checkout/checkoutProgressList/CheckoutProgressListContainer.jsx';
import {PickUpReviewSectionContainer} from 'views/components/checkout/pickup/PickUpReviewSectionContainer';
import {ShippingReviewSectionContainer} from 'views/components/checkout/shipping/ShippingReviewSectionContainer.jsx';
import {BillingReviewSectionContainer} from 'views/components/checkout/billing/BillingReviewSectionContainer';
import {ExpressCVVFormPartContainer} from 'views/components/checkout/billing/ExpressCVVFormPartContainer.jsx';
import {CheckoutCartItemsListContainer} from 'views/components/checkout/cartItems/CheckoutCartItemsListContainer.js';
import {CheckoutSummarySidebarContainer} from 'views/components/orderSummary/CheckoutSummarySidebarContainer';
import cssClassName from 'util/viewUtil/cssClassName.js';
import {reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {scrollToFirstFormError} from 'util/formsValidation/scrollToFirstFormError';

if (DESKTOP) { // eslint-disable-line
  require('./_d.checkout-review.scss');
} else {
  require('./_m.checkout-review.scss');
}

class _CheckoutReviewForm extends React.Component {
  static propTypes = {
    /** indicates device (mobile vs desktop) */
    isMobile: PropTypes.bool.isRequired,
    /** Flags if to render the express checkout form */
    isExpressCheckout: PropTypes.bool.isRequired,

    /** <code>true</code> indicates the order contains pickup info */
    orderContainsPickup: PropTypes.bool,

    /** <code>true</code> indicates the order contains shipping info  */
    orderContainsShipping: PropTypes.bool,

    /** callback to go back to pickup section **/
    onBackToPickup: PropTypes.func.isRequired,
    /** callback to go back to shipping section **/
    onBackToShipping: PropTypes.func.isRequired,
    /** callback to go back to billing section **/
    onBackToBilling: PropTypes.func.isRequired,

    ...reduxFormPropTypes
  }

  componentWillMount () {
    this.checkForInactivePayment(this.props);
  }

  componentWillReceiveProps (nextProps) {
    this.checkForInactivePayment(nextProps);
  }

  // REVIEW: this is a hack because we're reusing the same component for all types of plcc forms
  // we should have different operators and containers for the 3 of them to make them simpler
  // (wic full screen, wic modal, plcc modal)
  checkForInactivePayment (props) {
    let { cardType, appliedGiftCards, onRedirectToBilling } = props;

    // DT-32443
    // If there are no valid payment methods, redirect to billing and show error
    if (cardType === null && appliedGiftCards.length === 0) {
      onRedirectToBilling();
    }
  }

  render () {
    let {isMobile, isExpressCheckout, onBackToBilling,
      orderContainsPickup, orderContainsShipping, orderRequiresPayment,
      error, change, handleSubmit, initialValues} = this.props;

    let containerClassName = cssClassName('checkout-review-container ', isExpressCheckout && 'express');
    return (
      <div className={containerClassName}>
        <section className="checkout-content">
          {!isMobile && <CheckoutProgressListContainer />}

          {error && <ErrorMessage error={error} />}

          {orderContainsPickup &&
            <PickUpReviewSectionContainer isMobile={isMobile} enablePickUpAlternateForm={isExpressCheckout}
              isHasPickUpAlternatePerson={initialValues.hasAlternatePickup} pickUpAlternatePerson={initialValues.pickUpAlternate}
              onEdit={this.props.onBackToPickup} />}

          {orderContainsShipping &&
            <ShippingReviewSectionContainer isMobile={isMobile}
              enableShippingMethodForm={isExpressCheckout}
              onEdit={this.props.onBackToShipping} change={change} />}

          <BillingReviewSectionContainer onEdit={onBackToBilling} orderRequiresPayment={orderRequiresPayment} />

          <CheckoutCartItemsListContainer isMobile={isMobile} />
        </section>

        <CheckoutSummarySidebarContainer onSubmit={handleSubmit} />
      </div>
    );
  }
}

let validateMethod = createValidateMethod({
  pickUpAlternate: PickUpReviewSectionContainer.defaultValidation,
  ...ShippingReviewSectionContainer.defaultValidation,
  billing: ExpressCVVFormPartContainer.defaultValidation
});

let CheckoutReviewForm = reduxForm({
  form: 'checkoutReview',     // name will come from parent component
  onSubmitFail: (errors, dispatch, submitError, props) => scrollToFirstFormError(props.form),
  ...validateMethod,
  enableReinitialize: true,
  forceUnregisterOnUnmount: false,
  destroyOnUnmount: false
})(_CheckoutReviewForm);

export {CheckoutReviewForm};
