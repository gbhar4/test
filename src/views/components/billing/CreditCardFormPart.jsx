/** @module CreditCardFormPart
 * @summary A FormSection component rendering a partial cc form
 *
 * The default name (for use by a containing redux-form) of this form section is 'card'.
 *
 * Provides fields with the following names:
 *   number, expMonth, expYear, cvv
 *
 * Provide a static defaultValidation property that is an object that can be passed to
 *  util/formsValidation/createValidateMethod.
 *
 *  This component extends redux-form's FormSection component.
 *
 * @author Agustin
 * // TODO: bind card value to card type detection. use example from shipping
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {Field} from 'redux-form';

import {ButtonTooltip} from 'views/components/tooltip/ButtonTooltip.jsx';
import {LabeledSelect} from 'views/components/common/form/LabeledSelect.jsx';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';

if (DESKTOP) { // eslint-disable-line
  require('views/components/checkout/_d.credit-card-fieldset.scss');
} else {
  require('views/components/checkout/_m.credit-card-fieldset.scss');
}

// note that we are extending FormSection (and not React.Component) just so that we can provide a default 'name' prop.
export class CreditCardFormPart extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    isExpirationRequired: PropTypes.bool.isRequired,
    isCVVRequired: PropTypes.bool.isRequired,

    /** card type */
    cardType: PropTypes.string,
    cardTypeImgUrl: PropTypes.string
  }

  static defaultValidation = getStandardConfig(['cardNumber', 'expMonth', 'expYear', 'cvv'])

  render () {
    let {isMobile, isExpirationRequired, isCVVRequired, expMonthOptionsMap, expYearOptionsMap, cardType, cardTypeImgUrl} = this.props;

    return (
      <fieldset className="fieldset-creditcard-editable">
        <legend className="sr-only">Card Details</legend>

        <Field name="cardNumber" component={LabeledInput}
          className="input-cc" type="tel" maxLength="16"
          title={<div>Card Number</div>} autoComplete="off">
          {cardType && <img className="credit-card-image" src={cardTypeImgUrl} alt={cardType} />}
        </Field>

        {isExpirationRequired &&
          <Field name="expMonth" component={LabeledSelect} className="select-exp-mm"
            title="Exp. Month" placeholder="MM" optionsMap={expMonthOptionsMap}
            format={String} parse={parseInt} />
        }

        {isExpirationRequired &&
          <Field name="expYear" component={LabeledSelect} className="select-exp-yy"
            title="Exp. Year" placeholder="YYYY" optionsMap={expYearOptionsMap}
            format={String} parse={parseInt} />
        }

        {isCVVRequired &&
          <Field name="cvv" component={LabeledInput} className="input-cvv" type="tel"
            title={isMobile ? <div>CVV</div> : <div>CVV Code</div>} placeholder="" autoComplete="off" >
            <ButtonTooltip type="info" direction="bottom">
              <p>For your safety and security, The Children's Place requires that you enter your card's verification code.</p> <br />
              <p>For <b style={{fontWeight: 900}}>Visa, MasterCard, and Discover cards</b>, the verification code is a 3-digit number printed on the back of the card and appears on the right hand side after your account number.</p> <br />
              <p>For <b style={{fontWeight: 900}}>American Express</b> cards, the verification code is a 4-digit number printed on the front of the card and appears on the right hand side after your account number.</p> <br />
              <p><b style={{fontWeight: 900}}>Note: My Place Rewards Credit Cards do not have a CVV code.</b></p> <br />
            </ButtonTooltip>
          </Field>
        }
      </fieldset>
    );
  }
}
