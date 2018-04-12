/**
* @module ExpressCVVFormPart
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* Form to enter CVV in review section (express checkout only)
*/

import React from 'react';
import {PropTypes} from 'prop-types';
import {Field} from 'redux-form';
import {ButtonTooltip} from 'views/components/tooltip/ButtonTooltip.jsx';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';

if (DESKTOP) { // eslint-disable-line
  require('./_d.payment-method.scss');
} else {
  require('./_m.payment-method.scss');
}

export class ExpressCVVFormPart extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired
  }

  static defaultValidation = getStandardConfig(['cvv'])

  render () {
    let {isMobile} = this.props;
    return (
      <div className="express-cvv-container">
        <strong className="title-cvv">
          {!isMobile ? 'CVV CODE' : 'Cvv'}
          <ButtonTooltip className="tooltip-cvv" type="info" direction="bottom">
            <p>For your safety and security, The Children's Place requires that you enter your card's verification code.</p> <br />
            <p>For <b style={{fontWeight: 900}}>Visa, MasterCard, and Discover cards</b>, the verification code is a 3-digit number printed on the back of the card and appears on the right hand side after your account number.</p> <br />
            <p>For <b style={{fontWeight: 900}}>American Express</b> cards, the verification code is a 4-digit number printed on the front of the card and appears on the right hand side after your account number.</p> <br />
            <p><b style={{fontWeight: 900}}>Note: My Place Rewards Credit Cards do not have a CVV code.</b></p> <br />
          </ButtonTooltip>
        </strong>

        <fieldset className="express-cvv">
          <Field component={LabeledInput} title="" type="tel" name="cvv" className="input-cvv-express-checkout" placeholder="" autoComplete="off" />
        </fieldset>
      </div>
    );
  }
}
