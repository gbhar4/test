/**  @module GuestBillingFormPart
 * @summary A shipping form for guest checkout.
 *
 * @author Agustin H. Andina Silva <asilva@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, FormSection} from 'redux-form';
import {FormValuesChangeTrigger} from 'reduxStore/util/FormValuesChangeTrigger.jsx';

import {CheckoutSectionTitleDisplay} from 'views/components/checkout/CheckoutSectionTitleDisplay.jsx';
import {PaymentMethodFormSection} from './PaymentMethodFormSection.jsx';
import {CreditCardFormPartContainer} from 'views/components/billing/CreditCardFormPartContainer.js';
import {AddressFormSectionContainer} from 'views/components/address/AddressFormSectionContainer.js';

import {LabeledCheckbox} from 'views/components/common/form/LabeledCheckbox.jsx';
import {AddressFormSection} from 'views/components/address/AddressFormSection.jsx';
import {getAdaptiveFormPart} from 'reduxStore/util/adaptiveFormPart.js';
import {ContactInfoDisplay} from 'views/components/address/ContactInfoDisplay.jsx';
import {CreditCardFormPart} from 'views/components/billing/CreditCardFormPart.jsx';
import {ADDRESS_PROP_TYPES_SHAPE} from 'views/components/common/propTypes/addressPropTypes';

export class GuestBillingFormPart extends React.Component {

  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    isPaypalEnabled: PropTypes.bool.isRequired,

    /**
     * callback setting the values of the address fields of this section
     * to be the same as the shipping address.
     */
    setAddressValuesSameAsShipping: PropTypes.func.isRequired,

    /** bopis orders don't require shipping, so "same as shipping" shouldn't be visible */
    isSameAsShippingEnabled: PropTypes.bool.isRequired,

    /** the selected shipping address details.
     * Required if the prop isSameAsShippingEnabled is true */
    currentShippingDetails: PropTypes.shape({
      address: ADDRESS_PROP_TYPES_SHAPE.isRequired
    }),

    /** This is a flag to enable us to toggle between copy changes for internationalization */
    isCountryUS: PropTypes.bool
  }

  static defaultValidation = {
    address: AddressFormSection.defaultValidation,
    ...CreditCardFormPart.defaultValidation
  }

  constructor (props) {
    super(props);

    this.handleSameAsShippingChange = this.handleSameAsShippingChange.bind(this);
    this.mapValuesToAddressProps = this.mapValuesToAddressProps.bind(this);
    this.mapValuesToCCFormProps = this.mapValuesToCCFormProps.bind(this);
  }

  handleSameAsShippingChange (values) {
    if (values.address && values.address.sameAsShipping) {
      this.props.setAddressValuesSameAsShipping();
    }
  }

  mapValuesToAddressProps (values) {
    return {
      sameAsShipping: values.address && values.address.sameAsShipping
    };
  }

  mapValuesToCCFormProps (values) {
    return {
      isPaypalSelected: values.paymentMethod === 'paypal',
      mapValuesToAddressProps: this.mapValuesToAddressProps
    };
  }

  render () {
    let {isMobile, isPaypalEnabled, isSameAsShippingEnabled, isCountryUS, currentShippingDetails} = this.props;

    return (<div className="guest-billing-form-container">
      <FormValuesChangeTrigger adaptTo={'address.sameAsShipping'} onChange={this.handleSameAsShippingChange} />

      <CheckoutSectionTitleDisplay title="Payment Method" className="payment-method-section" />

      <section className="checkout-billing-section">
        {isPaypalEnabled && <PaymentMethodFormSection isMobile={isMobile} isCountryUS={isCountryUS} />}
        <GuestCreditCardFormPart adaptTo={'paymentMethod'} mapValuesToProps={this.mapValuesToCCFormProps} />
      </section>

      <GuestBillingAddressFormPart adaptTo={'paymentMethod'} mapValuesToProps={this.mapValuesToCCFormProps}
        isSameAsShippingEnabled={isSameAsShippingEnabled} address={currentShippingDetails.address} />
    </div>);
  }
}

let GuestViewOrEditBillingAddress = getAdaptiveFormPart((props) => {
  return !props.sameAsShipping
    ? <AddressFormSectionContainer />
    : <div className="address-shipping-view">
        <ContactInfoDisplay address={props.address} isShowAddress />
      </div>;
});

let GuestCreditCardFormPart = getAdaptiveFormPart((props) => {
  return !props.isPaypalSelected && <CreditCardFormPartContainer />;
});

let GuestBillingAddressFormPart = getAdaptiveFormPart((props) => {
  let {isPaypalSelected, isSameAsShippingEnabled, mapValuesToAddressProps, address} = props;

  if (isPaypalSelected) {
    return <div className="message-paypal">
      <p className="message-paypal-selected">
        By selecting PayPal, you will leave childrensplace.com to complete the order process with PayPal's site.<br />
        Upon PayPal payment completion, you will be returned to childrensplace.com
      </p>
      <p className="message-paypal-selected">Please review your purchase and delivery details before proceeding.</p>
    </div>;
  } else {
    return <section className="checkout-billing-section">
      <CheckoutSectionTitleDisplay title="Billing Address" />

      {isSameAsShippingEnabled && <FormSection name="address">
        <div className="same-as-shipping-container">
          <Field component={LabeledCheckbox} name="sameAsShipping" title="Same as shipping" className="same-as-shipping-checkbox" />
        </div>
      </FormSection>}

      <GuestViewOrEditBillingAddress adaptTo={'address.sameAsShipping'} extraFields="/shipping" mapValuesToProps={mapValuesToAddressProps} address={address} />
    </section>;
  }
});
