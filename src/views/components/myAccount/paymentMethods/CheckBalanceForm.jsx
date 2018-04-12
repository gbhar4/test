/** @module AddGiftCardForm
 * @summary From My Account.
 *
 * @author Agu
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';

import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';

import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {Recaptcha} from 'views/components/recaptcha/recaptcha.jsx';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {Spinner} from 'views/components/common/Spinner.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.check-giftcard-balance.scss');
} else {
  require('./_m.check-giftcard-balance.scss');
}

class _CheckBalanceForm extends React.Component {
  static propTypes = {
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
    this.handleCheckBalanceClick = this.handleCheckBalanceClick.bind(this);
    this.attachReCaptchaRef = this.attachReCaptchaRef.bind(this);
  }

  handleCheckBalanceClick (e) {
    e.preventDefault();

    if (this.state.isTokenDirty) {
      this.props.change('recaptchaToken', '');
      this.setState({
        isTokenDirty: false
      });
      return;
    }

    return this.props.handleSubmit((formData) => {
      var operator = this.props.onCheckBalance;

      return operator({
        ...formData,
        onFileCardId: this.props.giftCardEntry.onFileCardId,
        cardNumber: this.props.giftCardEntry.cardNumber,
        cardPin: this.props.giftCardEntry.cardPin
      }).then(() => {
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
    let {error, submitting, isRecapchaEnabled} = this.props;

    return (<section className="check-giftcard-balance-container">
      <form className="check-gift-card-balance-form" onSubmit={this.handleSubmit} autoComplete="off">
        {error && <ErrorMessage error={error} />}

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
        {isRecapchaEnabled && <Field component={LabeledInput} title="" type="hidden" name="recaptchaToken" />}

        <div className="gift-card-add-submit">
          {submitting && <Spinner />}
          <button type="submit" onClick={this.handleCheckBalanceClick} className="gift-card-balance button-tertiary">Check Balance</button>
        </div>
      </form>
    </section>);
  }
}

let validateMethod = createValidateMethod(getStandardConfig(['recaptchaToken']));

let CheckBalanceForm = reduxForm({
  ...validateMethod,
  enableReinitialize: true
})(_CheckBalanceForm);

export {CheckBalanceForm};
