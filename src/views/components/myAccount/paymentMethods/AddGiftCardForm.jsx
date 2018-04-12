/** @module AddGiftCardForm
 * @summary From My Account.
 *
 * @author Agu
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';

import {Route} from 'views/components/common/routing/Route.jsx';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';
import {BreadCrumbs} from 'views/components/common/routing/BreadCrumbs.jsx';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {Spinner} from 'views/components/common/Spinner.jsx';

import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';

import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {Recaptcha} from 'views/components/recaptcha/recaptcha.jsx';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {LocationChangeTrigger} from 'views/components/common/routing/LocationChangeTrigger.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.add-giftcard.scss');
} else {
  require('./_m.add-giftcard.scss');
}

class _AddGiftCardForm extends React.Component {
  static propTypes = {
    giftCardBalance: PropTypes.number,
    onSubmit: PropTypes.func.isRequired,
    onCheckBalance: PropTypes.func.isRequired,

    ...reduxFormPropTypes
  }

  constructor (props) {
    super(props);

    this.state = {
      isTokenDirty: false
    };

    this.handleRecaptchaOnload = this.handleRecaptchaOnload.bind(this);
    this.handleRecaptchaVerify = this.handleRecaptchaVerify.bind(this);
    this.handleRecaptchaExpired = this.handleRecaptchaExpired.bind(this);
    // this.handleCheckBalanceClick = this.handleCheckBalanceClick.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.attachReCaptchaRef = this.attachReCaptchaRef.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /*
  handleCheckBalanceClick (e) {
    this.handleSubmit(e, true);
  }
  */

  handleLocationChange () {
    this.props.clearGiftCardBalance();
  }

  handleSubmit (e, checkBalance) {
    e.preventDefault();

    if (this.state.isTokenDirty) {
      this.props.change('recaptchaToken', '');
      this.setState({
        isTokenDirty: false
      });
      return;
    }

    return this.props.handleSubmit((formData) => {
      var operator = (checkBalance === true) ? this.props.onCheckBalance : this.props.onSubmit;

      return operator(formData).then(() => {
        this.recaptcha && this.recaptcha.reset(); // if GC covers total, this ref no longer exists
        this.props.change('recaptchaToken', '');
        this.props.untouch('recaptchaToken');
      }).catch((err) => {
        this.recaptcha.reset();

        this.setState({
          isTokenDirty: true
        });

        throw err;
      });
    })();
  }

  handleRecaptchaOnload () {
    // nothing?
  }

  handleRecaptchaVerify (token) {
    this.props.change('recaptchaToken', token);

    this.setState({
      isTokenDirty: false
    });
  }

  handleRecaptchaExpired () {
    this.props.change('recaptchaToken', '');
  }

  attachReCaptchaRef (ref) {
    this.recaptcha = ref;
  }

  render () {
    let {error, giftCardBalance, pristine, submitting, isRecapchaEnabled} = this.props;

    return (<section className="add-giftcard-or-merchandise-container">
      <Route component={BreadCrumbs} componentProps={{sections: MY_ACCOUNT_SECTIONS}} />

      <form className="gift-card-add-form" onSubmit={this.handleSubmit} autoComplete="off">
        <strong className="title-gift-card-add">Add Gift Card</strong>

        <fieldset className="gift-card-add-fieldset">
          {error && <ErrorMessage error={error} />}

          <div className="gift-card-add-fields">
            <Field component={LabeledInput} title="Gift Card #" type="tel" name="cardNumber" autoComplete="off" className="gift-card-number" placeholder="" />
            <Field component={LabeledInput} title="Pin #" type="tel" name="cardPin" className="gift-card-pin" placeholder="" />

            {isRecapchaEnabled && <Recaptcha
              ref={this.attachReCaptchaRef}
              className="giftcards-recaptcha"
              theme="light"
              type="image"
              size="normal"
              tabindex="0"
              onloadCallback={this.handleRecaptchaOnload}
              verifyCallback={this.handleRecaptchaVerify}
              expiredCallback={this.handleRecaptchaExpired}
            />}
            {isRecapchaEnabled && <Field component={LabeledInput} title="" type="hidden" className="hidden-recaptcha-input" name="recaptchaToken" />}

            {(typeof giftCardBalance === 'number') && <p className="balance">Balance: <strong>${giftCardBalance.toFixed(2)}</strong></p>}

            <div className="add-giftcard-message-container">
              <p className="add-giftcard-message">
                <strong className="add-giftcard-message-title">HEADS UP - DON'T THROW AWAY YOUR GIFT CARD!</strong>
                Adding a gift card is a convenient way to save money in your account for future purchases. However, if you want to use your gift card for an in-store purchase you will need to present the physical card to the cashier.
              </p>
            </div>

            <div className={'button-container gift-card-add-submit'}>
              {submitting && <Spinner />}
              {/* <button type="button" onClick={this.handleCheckBalanceClick} className="gift-card-balance" disabled={pristine || submitting}>Check Balance</button> */}
              <HyperLink destination={MY_ACCOUNT_SECTIONS.paymentAndGiftCards} className="button-cancel link-button-cancel">Cancel</HyperLink>
              <button type="submit" className="gift-card-save button-save" disabled={pristine || submitting}>Save</button>
            </div>
          </div>
        </fieldset>
      </form>
      <LocationChangeTrigger onLocationChange={this.handleLocationChange} triggerOnMount />
    </section>);
  }
}

let validateMethod = createValidateMethod(getStandardConfig([{'cardNumber': 'giftCardNumber'}, 'cardPin', 'recaptchaToken']));

let AddGiftCardForm = reduxForm({
  form: 'addGiftCardCardForm',
  ...validateMethod,
  enableReinitialize: true
})(_AddGiftCardForm);

export {AddGiftCardForm};
