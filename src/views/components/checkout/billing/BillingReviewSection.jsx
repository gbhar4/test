/**
* @module BillingReviewSection
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* Section to display pick up on review section of checkout, for normal checkout and express (form)
* @author Ben
*/

import React from 'react';
import {PropTypes} from 'prop-types';
import {FormSection} from 'redux-form';
import {GiftCardsSectionContainer} from 'views/components/checkout/giftCards/GiftCardsSectionContainer.jsx';
import {TitlePlusEditButton} from '../TitlePlusEditButton.jsx';
import {BillingAddressDisplay} from './BillingAddressDisplay.jsx';
import {PaymentMethodDisplay} from './PaymentMethodDisplay.jsx';
import {ExpressCVVFormPartContainer} from './ExpressCVVFormPartContainer.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.billing-review-section.scss');
} else {
  require('./_m.billing-review-section.scss');
}

export class BillingReviewSection extends React.Component {
  static propTypes = {
    orderRequiresPayment: PropTypes.bool.isRequired,
    cvvFormEnabled: PropTypes.bool,
    title: PropTypes.string,
    billingAddress: BillingAddressDisplay.propTypes.address,
    paymentMethod: PropTypes.shape({
      icon: PropTypes.string.isRequired,
      cardType: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired
    }),
    onEdit: PropTypes.func.isRequired
  }

  render () {
    let {cvvFormEnabled, billingAddress, paymentMethod, orderRequiresPayment, onEdit} = this.props;

    return (
      <div className="checkout-review-section checkout-review-billing">
        <TitlePlusEditButton title="Billing" onEdit={onEdit} />
        {orderRequiresPayment && (paymentMethod || billingAddress) &&
          <section className="payment-review-section">
            <FormSection name="billing" className="review-section payments">
              {paymentMethod && <PaymentMethodDisplay {...paymentMethod} />}
              {paymentMethod && cvvFormEnabled && <ExpressCVVFormPartContainer />}
              {billingAddress && <BillingAddressDisplay address={billingAddress} />}
            </FormSection>
          </section>
        }
        <GiftCardsSectionContainer />
      </div>
    );
  }
}
