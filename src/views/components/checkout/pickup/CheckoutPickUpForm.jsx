/**
* @module CheckoutPickUpForm
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* @author Ben
*/

import React from 'react';
import {PropTypes} from 'prop-types';
import {CheckoutProgressListContainer} from 'views/components/checkout/checkoutProgressList/CheckoutProgressListContainer.jsx';
import {CheckoutSummarySidebarContainer} from 'views/components/orderSummary/CheckoutSummarySidebarContainer';
import {PickUpFormPart} from './PickUpFormPart.jsx';
import {CheckoutSectionTitleDisplay} from 'views/components/checkout/CheckoutSectionTitleDisplay.jsx';
import cssClassName from 'util/viewUtil/cssClassName.js';
import {reduxForm} from 'redux-form';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';

if (DESKTOP) { // eslint-disable-line
  require('./_d.checkout-pick-up.scss');
} else {
  require('./_m.checkout-pick-up.scss');
}

class _CheckoutPickUpForm extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool.isRequired,
    /**
     * A callback to call whenever opening or closing the editing pickup contact sub-form.
     * Will accept a single Boolean parameter that is true when entering edit mode
     * and is false when exiting the edit mode.
     */
    onEditModeChange: PropTypes.func
  }

  static defaultValidation = PickUpFormPart.defaultValidation;

  render () {
    let {isMobile, isGuest, error, change, onEditModeChange} = this.props;
    let containerClassName = cssClassName('checkout-pickup-container');

    return (
      <div className={containerClassName}>
        <section className="checkout-content">
          {!isMobile && <CheckoutProgressListContainer />}
          <CheckoutSectionTitleDisplay title="Pickup" onEdit={this.handleToggle} className="summary-title-pick-up" />
          <PickUpFormPart change={change} error={error} isMobile={isMobile} isGuest={isGuest} isSMSActive={false}
            onEditModeChange={onEditModeChange} />
        </section>

        <CheckoutSummarySidebarContainer />
      </div>
    );
  }
}

let validateMethod = createValidateMethod(PickUpFormPart.defaultValidation);

let CheckoutPickUpForm = reduxForm({
  form: 'checkoutPickup',      // name will come from parent component
  ...validateMethod
//  forceUnregisterOnUnmount: true,
//  destroyOnUnmount: false
})(_CheckoutPickUpForm);

export {CheckoutPickUpForm};
