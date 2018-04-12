/**  @module PaymentMethodFormSection
 * @summary A shipping form for guest checkout.
 *
 * @author Agustin H. Andina Silva <asilva@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Field} from 'redux-form';
import {LabeledRadioButton} from 'views/components/common/form/LabeledRadioButton.jsx';
import cssClassName from 'util/viewUtil/cssClassName';

export class PaymentMethodFormSection extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool,

    /** This is a flag to enable us to toggle between copy changes for internationalization */
    isCountryUS: PropTypes.bool
  }

  render () {
    let {isMobile, isCountryUS} = this.props;
    let paymentMethodClassName = cssClassName(
      'payment-method-field ',
      {'payment-box ': isMobile},
      {'payment-box-radio-button ': !isMobile},
      {'payment-box-without-rewards': !isCountryUS}
    );

    return (<div className="payment-method-form-container">
      <div className={paymentMethodClassName}>
        <Field component={LabeledRadioButton} name="paymentMethod" selectedValue="creditCard" title="Credit Card" className="credit-card-method" />
      </div>

      <div className={'paypal-method ' + paymentMethodClassName}>
        <Field component={LabeledRadioButton} name="paymentMethod" selectedValue="paypal">
          <img src="/wcsstore/static/images/paypal.png" alt="Paypal" />
        </Field>
      </div>
    </div>);
  }
}
