/**  @module SimpleShippingAddress
 * @summary A shipping form for guest or mobile registered checkout.
 *
 * @author Ben
 * @author ?
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, FormSection} from 'redux-form';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {LabeledCheckbox} from 'views/components/common/form/LabeledCheckbox.jsx';
import {AddressFormSection} from 'views/components/address/AddressFormSection.jsx';
import {AddressFormSectionContainer} from 'views/components/address/AddressFormSectionContainer.js';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';
import {SaveAndDefaultAddressBoxesFormPart} from 'views/components/address/SaveAndDefaultAddressBoxesFormPart.jsx';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {PAGES} from 'routing/routes/pages';

if (DESKTOP) { // eslint-disable-line
  require('./_d.shipping-guest.scss');
} else {
  require('./_m.shipping-guest.scss');
}

// This is done to take away the briteVerify asyncValidation. In future if we have other asynv validators we will have to explicity just exclude the BV one
let { asyncValidators, ...otherValidators } = getStandardConfig(['firstName', 'lastName', 'emailAddress', 'phoneNumber']);

export class SimpleShippingAddress extends React.Component {
  static propTypes = {
    /** see AddressFormSection.PropTypes.onStateZipOrLineChange  **/
    onStateZipOrLineChange: PropTypes.func.isRequired,

    /** flags to display the email address field (false for reg user having no address on the address book). */
    isShowEmailAddress: PropTypes.bool,
    isShowSaveToAccount: PropTypes.bool,
    isShowSetAsDefault: PropTypes.bool,

    /** flags to display the email signup checkbox */
    isShowEmailSignup: PropTypes.bool.isRequired
  }

  static defaultValidation = {
    address: AddressFormSection.defaultValidation,
    ...otherValidators
  }

  render () {
    let {onStateZipOrLineChange, isShowEmailAddress, isShowSetAsDefault, isShowSaveToAccount, isShowEmailSignup} = this.props;

    return (
      <FormSection name="shipTo" className="shipping-form-container">
        <h3 className="container-shipping-section-title">Shipping Details</h3>

        <AddressFormSectionContainer onStateZipOrLineChange={onStateZipOrLineChange} isShowInternationalShipping isDisableCountry />

        <Field name="phoneNumber" type="tel" component={LabeledInput} className="input-phone" title="Mobile Number" />
        {isShowEmailAddress && <Field name="emailAddress" component={LabeledInput} className="input-email" title="Email (for order updates)" />}

        <SaveAndDefaultAddressBoxesFormPart isShowSaveToAccount={isShowSaveToAccount} isShowSetAsDefault={isShowSetAsDefault} />

        {isShowEmailSignup && <div>
          <Field name="emailSignup" component={LabeledCheckbox} className="label-checkbox checkbox-get-email"
            subtitle="Sign up for email today & get $10 off your next purchase!*" />
          <p className="term-and-conditions-message">
            I understand I will receive marketing emails from The Children&#39;s Place. <br />
            *Applies to new email subscribers only. Exclusions apply. Offer valid on your next purchase of $40 or more.
            You may withdraw your consent at any time.<br />
          <HyperLink destination={PAGES.helpCenter} pathSuffix="#customerServiceli" className="contact-us-link" target="_blank">Contact us.</HyperLink>
          </p>
        </div>}
      </FormSection>
    );
  }
}
