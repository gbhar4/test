// FIXME: check how paypal interacts with this (including paypal modal), and if only in billing
/** @module CheckoutNavigationBar
 * @summary A presentational component rendering the buttons (next, previous, submit)
 * at the bottom of the checkout wizard.
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {ModalAbandonPayPal} from 'views/components/checkout/billing/ModalAbandonPayPal.jsx';
import {PaypalButtonContainer} from 'views/components/orderSummary/PaypalButtonContainer.js';
import {TermAndConditions} from 'views/components/checkout/TermAndConditions.jsx';
import {CHECKOUT_STAGES, CHECKOUT_STAGE_PROP_TYPE} from 'reduxStore/storeOperators/uiSignals/checkoutSignalsOperator.js';
import {CustomSpinnerIcon} from 'views/components/common/Spinner.jsx';

export class CheckoutNavigationBar extends React.Component {
  static propTypes = {
    activeStage: CHECKOUT_STAGE_PROP_TYPE.isRequired,
    /** optional next stage in checkout process */
    nextStage: CHECKOUT_STAGE_PROP_TYPE,
    /** optional previous stage in checkout process */
    previousStage: CHECKOUT_STAGE_PROP_TYPE,

    /** callback for clicks on the next button */
    onNextClick: PropTypes.func.isRequired,
    /** optional callback for clicks on the back-to button */
    onPreviousClick: PropTypes.func,

    /** flags to disable the 'next' button (usually since in the middle of submitting or other updates) */
    disableNext: PropTypes.bool,

    /** This flag indicates if the paypal option is selected */
    // REVIEW: this prop show the notification under de Payment Method. Please, review the use.
    isPaypalSelected: PropTypes.bool,

    /** This flag indicates if the modal is open when the user abandon checkout with Paypal */
    // REVIEW: I'm not sure if this modal should be here or with the return button.
    isAbandonPayPalMethod: PropTypes.bool.isRequired,

    /** callbacks to use on the paypal abandon modal */
    onChangeToCCPayment: PropTypes.func.isRequired,
    onBackToPaypal: PropTypes.func.isRequired,

    /** indicates device (mobile vs desktop) */
    isMobile: PropTypes.bool.isRequired
  }

  static stageNamesTable = {
    [CHECKOUT_STAGES.PICKUP]: 'Pickup',
    [CHECKOUT_STAGES.SHIPPING]: 'Shipping',
    [CHECKOUT_STAGES.BILLING]: 'Billing',
    [CHECKOUT_STAGES.REVIEW]: 'Review'
  }

  get nextButtonText () {
    let { activeStage, nextStage, disableNext } = this.props;

    /* Product team only wants loading spinner on review page. */
    if (activeStage === CHECKOUT_STAGES.REVIEW) {
      if (disableNext) {
        return <CustomSpinnerIcon className="submit-order-next-spinner" />;
      } else {
        return 'Submit order';
      }
    } else {
      return `NEXT: ${CheckoutNavigationBar.stageNamesTable[nextStage]}`;
    }
  }

  render () {
    let {
      activeStage, previousStage,
      onNextClick, onPreviousClick, disableNext,
      isPaypalSelected, isAbandonPayPalMethod, isMobile
    } = this.props;

    let previousButtonText = 'Return to ' + CheckoutNavigationBar.stageNamesTable[previousStage];

    return (
      <div className="container-button">
        {isPaypalSelected && activeStage === CHECKOUT_STAGES.BILLING
          ? <PaypalButtonContainer text="Proceed with Paypal" className="button-primary button-next-step button-proceed-with-paypal" isSkipPaymentEnabled />
        : [(!isMobile && activeStage === CHECKOUT_STAGES.REVIEW) && <TermAndConditions key="term-and-conditions" />,
          <button key="button-next-step" type="button" className="button-primary button-next-step" onClick={onNextClick} disabled={disableNext}>{this.nextButtonText}</button>,
          (isMobile && activeStage === CHECKOUT_STAGES.REVIEW) && <TermAndConditions key="term-and-conditions" />]
        }

        {previousStage && <button key="button-" type="button" onClick={onPreviousClick} className="button-previous-step">{previousButtonText}</button>}
        {isAbandonPayPalMethod && <ModalAbandonPayPal onBackToPaypal={this.props.onBackToPaypal} onChangeToCCPayment={this.props.onChangeToCCPayment} />}
      </div>
    );
  }
}
