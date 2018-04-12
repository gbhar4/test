/**  @module CheckoutShippingForm
 * @summary the switch between the 2 different forms for shipping (guest & registered)
 * revisit with Ben... ideally this would have the progress bar, but for mobile the submit button is
 * located after the summary, so we need the form to also contain it, and because of that, most of the markup
 * needs to be inside the form itself, leaving this component pretty much empty, just the switch between guest and registered
 *
 * @author Agustin
 */

import React from 'react';
import {PropTypes} from 'prop-types';

import {SimpleShippingAddress} from './SimpleShippingAddress.jsx';
import {RegisteredShippingAddressContainer, RegisteredShippingAddressMobileContainer} from 'views/components/checkout/shipping/RegisteredShippingAddressContainer.js';
import {GiftWrappingFormSectionContainer} from 'views/components/checkout/giftWrapping/GiftWrappingFormSectionContainer.js';
import {ShippingMethodFormSectionContainer} from 'views/components/checkout/shipping/ShippingMethodFormSectionContainer.js';
import cssClassName from 'util/viewUtil/cssClassName.js';

import {CheckoutProgressListContainer} from 'views/components/checkout/checkoutProgressList/CheckoutProgressListContainer.jsx';
import {CheckoutSummarySidebarContainer} from 'views/components/orderSummary/CheckoutSummarySidebarContainer.js';
import {reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {scrollToFirstFormError} from 'util/formsValidation/scrollToFirstFormError';

if (DESKTOP) { // eslint-disable-line
  require('./_d.shipping.scss');
} else {
  require('./_m.shipping.scss');
}

class _CheckoutShippingForm extends React.Component {
  static propTypes = {
    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool.isRequired,

    /** Flags if to show email signup checkbox for guests */
    isShowGuestEmailSignup: PropTypes.bool,

    /** Indicates mobile version (most components need it to handle specific layout settings) */
    isMobile: PropTypes.bool.isRequired,

    /** indicates shipping methods are available and showing */
    isShippingMethodAvailable: PropTypes.bool.isRequired,

    /** see AddressFormSection.PropTypes.onStateZipOrLineChange */
    onStateZipOrLineChange: PropTypes.func.isRequired,

    /** Kill switch on if gift options should be displayed */
    isGiftOptionsEnabled: PropTypes.bool.isRequired,

    /**
     * A callback to call whenever opening or closing the editing address sub-form.
     * Will accept a single Boolean parameter that is true when entering edit mode
     * and is false when exiting the edit mode.
     */
    onEditModeChange: PropTypes.func,

    ...reduxFormPropTypes
  }

  render () {
    let {onStateZipOrLineChange, onEditModeChange, isGuest, /* isShippingMethodAvailable, */
      isMobile, isGiftOptionsEnabled, isShowGuestEmailSignup,
      error, change} = this.props;
    let containerClassName = cssClassName('checkout-shipping-container');

    return (
      <div className={containerClassName}>
        <section className="checkout-content">
          {!isMobile && <CheckoutProgressListContainer />}

          {error && <ErrorMessage error={error} />}

          <div className="address-shipping-container">
            {isGuest
              ? <SimpleShippingAddress onStateZipOrLineChange={onStateZipOrLineChange} isShowEmailSignup={isShowGuestEmailSignup} isShowEmailAddress />
              : isMobile
                ? <RegisteredShippingAddressMobileContainer onStateZipOrLineChange={onStateZipOrLineChange} change={change} />
                : <RegisteredShippingAddressContainer onStateZipOrLineChange={onStateZipOrLineChange} onEditModeChange={onEditModeChange} />
            }
            <ShippingMethodFormSectionContainer name="method" isMobile={isMobile} change={change} />
            {isGiftOptionsEnabled && <GiftWrappingFormSectionContainer />}
          </div>
        </section>
        <CheckoutSummarySidebarContainer />
        {/* !isShippingMethodAvailable && <p className="error-box warning-box">FPO COPY: Please enter shipping zipcode to retrieve available shipping methods.</p> */}
      </div>
    );
  }
}

let validateMethod = createValidateMethod({
  shipTo: SimpleShippingAddress.defaultValidation,
  method: ShippingMethodFormSectionContainer.defaultValidation,
  giftWrap: GiftWrappingFormSectionContainer.defaultValidation
});

let CheckoutShippingForm = reduxForm({
  form: 'checkoutShipping',     // name will come from parent component
  onSubmitFail: (errors, dispatch, submitError, props) => scrollToFirstFormError(props.form),
  ...validateMethod
  // forceUnregisterOnUnmount: true,
  // destroyOnUnmount: false
})(_CheckoutShippingForm);

export {CheckoutShippingForm};
