/** @module AddCreditCard
 * @summary
 *
 * @author Agu
 */

import React from 'react';
// import {PropTypes} from 'prop-types';
import {reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';

import {Route} from 'views/components/common/routing/Route.jsx';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';
import {BreadCrumbs} from 'views/components/common/routing/BreadCrumbs.jsx';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';

import {CreditCardFormPartContainer as MyAccountCreditCardFormPartContainer} from './CreditCardFormPartContainer.js';
import {RegisteredBillingAddressMobileContainer} from 'views/components/checkout/billing/RegisteredBillingAddressMobileContainer.js';
import {SelectOrNewBillingAddressFormPart} from 'views/components/address/SelectOrNewBillingAddressFormPart.jsx';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {GuestBillingFormPart} from 'views/components/checkout/billing/GuestBillingFormPart.jsx'; // FIXME: import only to get default validation. Maybe put somehwere else?
import {ModalAddressVerificationFormContainer} from 'views/components/address/verificationModal/ModalAddressVerificationFormContainer.js';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {scrollToFirstFormError} from 'util/formsValidation/scrollToFirstFormError';

class _AddOrEditCreditCardForm extends React.Component {
  static propTypes = {
    addressBookEntries: SelectOrNewBillingAddressFormPart.propTypes.addressBookEntries,
    ...reduxFormPropTypes
  }

  render () {
    let {isMobile, isEditingForm, isAddressVerifyModalOpen, addressBookEntries, cardType, handleSubmit, error, change} = this.props;

    return (<section className="credit-and-debit-cards-container">
      <Route component={BreadCrumbs} componentProps={{sections: MY_ACCOUNT_SECTIONS}} />

      <form className="credit-card-add-edit-form" onSubmit={handleSubmit} autoComplete="off">
        {error && <ErrorMessage error={error} />}

        <MyAccountCreditCardFormPartContainer cardType={cardType} formName="addOrEditCreditCardForm" />

        {isMobile
          ? [<RegisteredBillingAddressMobileContainer key={1} change={change} />, isAddressVerifyModalOpen && <ModalAddressVerificationFormContainer key={2} isOpen />]
          : [addressBookEntries.length === 0 && <h2 className="title-billing-address" key={1}>Billing Address</h2>,
            <SelectOrNewBillingAddressFormPart addressBookEntries={addressBookEntries} key={2} />]}

        <HyperLink destination={MY_ACCOUNT_SECTIONS.paymentAndGiftCards} className="button-cancel">Cancel</HyperLink>

        {!isEditingForm
          ? <button type="submit" className="button-add-new-card" aria-label="">Add Card</button>
          : <button type="submit" className="button-save-changes" aria-label="">Save Changes</button>}
      </form>
    </section>);
  }
}

let validateMethod = createValidateMethod(GuestBillingFormPart.defaultValidation);

export let AddOrEditCreditCardForm = reduxForm({
  form: 'addOrEditCreditCardForm',
  ...validateMethod,
  enableReinitialize: true,
  onSubmitFail: (errors, dispatch, submitError, props) => scrollToFirstFormError(props.form)
})(_AddOrEditCreditCardForm);
