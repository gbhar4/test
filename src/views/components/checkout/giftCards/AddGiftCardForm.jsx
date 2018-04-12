/**
* @module AddGiftCardForm
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* Form to add a new gift card
*/

import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';

import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {LabeledCheckbox} from 'views/components/common/form/LabeledCheckbox.jsx';
import {Recaptcha} from 'views/components/recaptcha/recaptcha.jsx';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {Spinner} from 'views/components/common/Spinner.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.giftcards.scss');
} else {
  require('./_m.giftcards.scss');
}

class _AddGiftCardForm extends React.Component {
  static propTypes = {
    /** this is an accordion like component, we might receive a prop to make it expanded by default */
    expanded: PropTypes.bool,

    /** indicates the balance of the currently entered gift card */
    giftCardBalance: PropTypes.number,

    /** <code>true</code> indicates that the checkbox to store the giftcard on the user's account should be enabled. */
    saveToAccountEnabled: PropTypes.bool,

    ...reduxFormPropTypes
  }

  constructor (props) {
    super(props);

    this.state = {
      expanded: !!props.expanded,
      isTokenDirty: false
    };

    this.handleToggle = this.handleToggle.bind(this);
    this.handleRecaptchaOnload = this.handleRecaptchaOnload.bind(this);
    this.handleRecaptchaVerify = this.handleRecaptchaVerify.bind(this);
    this.handleRecaptchaExpired = this.handleRecaptchaExpired.bind(this);
    // this.handleCheckBalanceClick = this.handleCheckBalanceClick.bind(this);
    this.attachReCaptchaRef = this.attachReCaptchaRef.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleToggle () {
    this.setState({
      expanded: !this.state.expanded
    });

    if (!this.state.expanded) {
      this.props.reset();
    }
  }

  // REVIEW: recapcha needs to reset once the submit handler is called. I
  // I'm not sure this would be the place for it tho. Also, recaptchaToken needs to be 'prestine' (no error message)
  // when we manually set it's value. Not sure how to do that.
  handleSubmit (e) {
    e.preventDefault();

    if (this.state.isTokenDirty) {
      this.props.change('recaptchaToken', '');
      this.setState({
        isTokenDirty: false
      });
      return;
    }

    this.props.handleSubmit((formData) => {
      return this.props.onSubmit(formData).then(() => {
        this.handleToggle();
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
    let {expanded} = this.state;
    let {error, saveToAccountEnabled, giftCardBalance, pristine, submitting} = this.props;

    return (
      <form className="gift-card-add-form" onSubmit={this.handleSubmit} autoComplete="off">

        <fieldset className="gift-card-add-fieldset">
          <legend className="title-gift-card-add">Add Gift Card</legend>
          {!expanded && <button type="button" onClick={this.handleToggle} className="gift-card-toggle" aria-label="Add new gift card">+ New Gift Card</button>}

          {error && <ErrorMessage error={error} />}

          {expanded ? <div className="gift-card-add-fields">
            <Field component={LabeledInput} title="Gift Card #" type="tel" name="cardNumber" autoComplete="off" className="gift-card-number" placeholder="" />
            <Field component={LabeledInput} title="Pin #" type="tel" name="cardPin" className="gift-card-pin" placeholder="" />

            <Recaptcha
              ref={this.attachReCaptchaRef}
              className="giftcards-recaptcha"
              theme="light"
              type="image"
              size="normal"
              tabindex="0"
              onloadCallback={this.handleRecaptchaOnload}
              verifyCallback={this.handleRecaptchaVerify}
              expiredCallback={this.handleRecaptchaExpired}
            />
            <Field component={LabeledInput} title="" type="hidden" className="hidden-recaptcha-input" name="recaptchaToken" />

            {saveToAccountEnabled
              ? <Field component={LabeledCheckbox} title="Save gift card balance to my account" type="text" name="saveToAccount" placeholder="" className="save-giftcard-balance-checkbox" />
              : null}

            {typeof giftCardBalance === 'number' ? <p className="balance">Balance: ${giftCardBalance.toFixed(2)}</p> : ''}

            <div className={'gift-card-add-submit'}>
              {submitting && <Spinner />}
              <button type="button" onClick={this.handleToggle} className="gift-card-cancel">Cancel</button>
              <button type="submit" className="gift-card-apply" disabled={pristine || submitting}>Apply</button>
            </div>
          </div> : null}
        </fieldset>
      </form>
    );
  }
}

let validateMethod = createValidateMethod(getStandardConfig([{'cardNumber': 'giftCardNumber'}, 'cardPin', 'recaptchaToken']));

let AddGiftCardForm = reduxForm({
  form: 'addGiftCard',
  ...validateMethod
})(_AddGiftCardForm);

export {AddGiftCardForm};
