/** @module Gift Cards Modal
 * @summary Gift Cards Modal
 *
 * @author Oliver Ramirez
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Modal} from 'views/components/modal/Modal.jsx';
import {Field, reduxForm} from 'redux-form';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';

import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';

import {Recaptcha} from 'views/components/recaptcha/recaptcha.jsx';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.gift-cards-modal.scss');
} else {
  require('./_m.gift-cards-modal.scss');
}

class _GiftCardsModal extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,

    /* last checked balance */
    giftCardBalance: PropTypes.number,

    /* operator method to close the modal */
    onClose: PropTypes.func.isRequired,

    /* operator method to check balance (submit the form) */
    onSubmit: PropTypes.func.isRequired
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
    let {isMobile, error, giftCardBalance, pristine, submitting} = this.props;

    return (
      <Modal className="overlay-container" contentLabel="Gift Cards Modal" overlayClassName="react-overlay overlay-center overlay-gift-card-balance" preventEventBubbling isOpen>
        <form className="gift-cards-modal" onSubmit={this.handleSubmit}>
          <ModalHeaderDisplayContainer title={isMobile ? 'How to check your balance' : 'How to check your gift card balance'} onCloseClick={this.props.onClose} />
          <div className="steps-container">
            <h3>Step 1:</h3>
            <p>Enter gift card number.</p>
            <h3>Step 2:</h3>
            <p>Enter PIN number. <br />
              <span>(See examples on the right if your gift card needs a PIN number to check balance.)</span>
            </p>
            <h3>Step 3:</h3>
            <p>Click Check Balance button.</p>
            <h3>Step 4:</h3>
            <p>To check balances on additional gift cards, repeat steps 1 - 3.</p>
          </div>

          <div className="images-container">
            <img src="/static/images/gift-card-one.png" alt="" className="img-gc" />
            <img src="/static/images/gift-card-two.png" alt="" className="img-gc" />
          </div>

          <Field component={LabeledInput} title="Gift Card Number" type="tel" name="cardNumber" autoComplete="off" className="input-gift-card" placeholder="" />
          <Field component={LabeledInput} title="PIN" type="tel" name="cardPin" className="input-pin" placeholder="" />

          {!isMobile && (giftCardBalance !== null ? <span className="current-balance button-secondary">Current balance: ${giftCardBalance}</span> : null)}

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

          <div className="gift-card-balance-error">
            <Field component={LabeledInput} title="" type="hidden" name="recaptchaToken" />          
          </div>

          {error && <ErrorMessage error={error} />}

          {isMobile && (giftCardBalance !== null ? <span className="current-balance button-secondary">Current balance: ${giftCardBalance}</span> : null)}

          <div className="buttons-container">
            <button type="submit" className="button-primary button-check" disabled={pristine || submitting}>Check balance</button>
            <button type="button" className="button-primary button-cancel" onClick={this.props.onClose}>Cancel</button>
          </div>
        </form>
      </Modal>
    );
  }
}

let validateMethod = createValidateMethod(getStandardConfig([{'cardNumber': 'giftCardNumber'}, 'cardPin', 'recaptchaToken']));

let GiftCardsModal = reduxForm({
  form: 'giftcardBalance',  // a unique identifier for this form
  ...validateMethod
})(_GiftCardsModal);

export { GiftCardsModal };
