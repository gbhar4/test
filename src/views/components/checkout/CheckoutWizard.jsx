/**
 * @module CheckoutForm
 * @author Agustin H. Andina Silva <asilva@minutentag.com>
 */
import React from 'react';
import {PropTypes} from 'prop-types';

import {ModalAddressVerificationFormContainer} from 'views/components/address/verificationModal/ModalAddressVerificationFormContainer.js';
import {CheckoutPickUpFormContainer} from 'views/components/checkout/pickup/CheckoutPickUpFormContainer';
import {CheckoutShippingFormContainer} from 'views/components/checkout/shipping/CheckoutShippingFormContainer';
import {CheckoutBillingFormContainer} from 'views/components/checkout/billing/CheckoutBillingFormContainer';
import {CheckoutReviewFormContainer} from 'views/components/checkout/review/CheckoutReviewFormContainer';
import {CheckoutNavigationBarContainer} from 'views/components/checkout/CheckoutNavigationBarContainer';
import {CHECKOUT_STAGES} from 'reduxStore/storeOperators/uiSignals/checkoutSignalsOperator.js';
import {MyBagEmptyContainer} from 'views/components/shoppingCart/MyBagEmptyContainer.js';
import {CheckoutPLCCFormContainer} from 'views/components/plcc/PLCCFormContainer.js';
import cssClassName from 'util/viewUtil/cssClassName';

export class CheckoutWizard extends React.Component {
  static propTypes = {
    /** indicates device (mobile vs desktop) */
    isMobile: PropTypes.bool.isRequired,
    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool.isRequired,
    /** Flags if to render the express checkout form */
    isExpressCheckout: PropTypes.bool.isRequired,
    /** flags if the address verification modal should be rendered */
    isAddressVerifyModalOpen: PropTypes.bool.isRequired,

    /** callback to submit the pickup form part of this wizard */
    onPickupSubmit: PropTypes.func.isRequired,
    /** callback to submit the shipping form part of this wizard */
    onShippingSubmit: PropTypes.func.isRequired,
    /** callback to submit the billing form part of this wizard */
    onBillingSubmit: PropTypes.func.isRequired,
    /** callback to submit the last part of the chekout process */
    onReviewSubmit: PropTypes.func.isRequired,

    /** indicates the active step in the checkout */
    activeStage: PropTypes.oneOf(Object.keys(CHECKOUT_STAGES).map((key) => CHECKOUT_STAGES[key])).isRequired,
    /** callback to change stages in the checkout process **/
    moveToCheckoutStage: PropTypes.func.isRequired,
    /** the available stages in the current checkout flow <strong>in order</strong> */
    availableStages: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(CHECKOUT_STAGES).map((key) => CHECKOUT_STAGES[key]))).isRequired
  }

  static stageNamesTable = {
    [CHECKOUT_STAGES.PICKUP]: 'Pickup',
    [CHECKOUT_STAGES.SHIPPING]: 'Shipping',
    [CHECKOUT_STAGES.BILLING]: 'Billing',
    [CHECKOUT_STAGES.REVIEW]: 'Review'
  }

  constructor (props) {
    super(props);

    this.moveToCallbackTable = {
      [CHECKOUT_STAGES.PICKUP]: () => this.props.moveToCheckoutStage(CHECKOUT_STAGES.PICKUP),
      [CHECKOUT_STAGES.SHIPPING]: () => this.props.moveToCheckoutStage(CHECKOUT_STAGES.SHIPPING),
      [CHECKOUT_STAGES.BILLING]: () => this.props.moveToCheckoutStage(CHECKOUT_STAGES.BILLING),
      [CHECKOUT_STAGES.REVIEW]: () => this.props.moveToCheckoutStage(CHECKOUT_STAGES.REVIEW)
    };

    this.onCurrentStageSubmit = () => { this.currentStageRef.submit(); };
    this.captureCurrentStageRef = (ref) => {
      // for connected components (i.e., containers) one needs to invoke the getWrappedInstance()
      // method in order to get the contained redux-form.
      this.currentStageRef = ref && ref.getWrappedInstance ? ref.getWrappedInstance() : ref;
    };
  }

  render () {
    let {isGuest, isMobile, isExpressCheckout, itemsCount,
      onShippingSubmit, onBillingSubmit, onPickupSubmit, onReviewSubmit,
      activeStage, availableStages, isAddressVerifyModalOpen,
      isPlccFormModalOpen
    } = this.props;

    let curentStageIndex = availableStages.findIndex((stage) => stage === this.props.activeStage);
    let nextStage = availableStages[curentStageIndex + 1] ? availableStages[curentStageIndex + 1] : availableStages[curentStageIndex];
    let previousStage = availableStages[curentStageIndex - 1];
    let previousStageName = CheckoutWizard.stageNamesTable[previousStage];
    let nextStageName = CheckoutWizard.stageNamesTable[nextStage];
    let moveToNext = this.moveToCallbackTable[nextStage];
    let moveToPrevious = this.moveToCallbackTable[previousStage];

    let isNoPickupStage = availableStages.findIndex((stage) => stage === CHECKOUT_STAGES.PICKUP) < 0;
    let checkoutContentClassName = cssClassName('checkout-wizard-container', {' viewport-container': !isMobile});

    return (
      itemsCount === 0
        ? <MyBagEmptyContainer />
        : <div className={checkoutContentClassName}>
          {activeStage === CHECKOUT_STAGES.PICKUP
          ? <CheckoutPickUpFormContainer isGuest={isGuest} isMobile={isMobile} ref={this.captureCurrentStageRef}
            onSubmit={onPickupSubmit} onSubmitSuccess={moveToNext} nextStageName={nextStageName} />
          : activeStage === CHECKOUT_STAGES.SHIPPING
          ? <CheckoutShippingFormContainer isGuest={isGuest} isMobile={isMobile} ref={this.captureCurrentStageRef}
            onSubmit={onShippingSubmit} onSubmitSuccess={moveToNext} moveToPrevious={moveToPrevious}
            previousStageName={previousStageName} nextStageName={nextStageName} isShowGuestEmailSignup={isNoPickupStage} />
          : activeStage === CHECKOUT_STAGES.BILLING
          ? <CheckoutBillingFormContainer isGuest={isGuest} isMobile={isMobile} ref={this.captureCurrentStageRef}
            onSubmit={onBillingSubmit} onSubmitSuccess={moveToNext} moveToPrevious={moveToPrevious}
            previousStageName={previousStageName} nextStageName={nextStageName} />
          : activeStage === CHECKOUT_STAGES.REVIEW
          ? <CheckoutReviewFormContainer isGuest={isGuest} isMobile={isMobile} ref={this.captureCurrentStageRef}
            onSubmit={onReviewSubmit} moveToPrevious={moveToPrevious}
            onBackToPickup={this.moveToCallbackTable[CHECKOUT_STAGES.PICKUP]}
            onBackToShipping={this.moveToCallbackTable[CHECKOUT_STAGES.SHIPPING]}
            onBackToBilling={this.moveToCallbackTable[CHECKOUT_STAGES.BILLING]}
            previousStageName={previousStageName} isExpressCheckout={isExpressCheckout} />
          : null}

          <CheckoutNavigationBarContainer isMobile={isMobile} activeStage={activeStage}
            nextStage={nextStage} previousStage={previousStage}
            onNextClick={this.onCurrentStageSubmit} onPreviousClick={moveToPrevious} />

          {isPlccFormModalOpen && <CheckoutPLCCFormContainer isModal />}
          {isAddressVerifyModalOpen && <ModalAddressVerificationFormContainer isOpen />}
        </div>
    );
  }
}
