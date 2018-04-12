/**
 * @module CouponCodeForm
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * Form to allow the user to manually add a coupon to the order, by entering
 * it's code.
 *
 * Style (ClassName) Elements description/enumeration
 *  -
 *
 * Uses
 *  <Field /> (from redux-form)
 *  <LabeledInputWithButton />
 */
import React from 'react';
import {Modal} from 'views/components/modal/Modal.jsx';
import {LabeledInputWithButton} from 'views/components/common/form/LabeledInputWithButton.jsx';
import {Field, reduxForm, reset, propTypes as reduxFormPropTypes} from 'redux-form';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';

class _CouponCodeForm extends React.Component {

  static propTypes = {
    ...reduxFormPropTypes
  }

  constructor (props) {
    super(props);

    this.state = {
      isNeedHelpModalOpen: false
    };

    this.toggleNeedHelpModal = this.toggleNeedHelpModal.bind(this);
    this.renderCouponCodeTitle = this.renderCouponCodeTitle.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.submitSucceeded && !this.props.submitSucceeded) {
      this.props.reset();
    }
  }

  toggleNeedHelpModal () {
    this.setState({isNeedHelpModalOpen: !this.state.isNeedHelpModalOpen});
  }

  renderCouponCodeTitle () {
    return (
      <strong className="coupon-code-title">COUPON CODE
        <button className="coupon-help-link" onClick={this.toggleNeedHelpModal} aria-label="Need help applying a coupon code?">
          Need help?
        </button>
      </strong>
    );
  }

  render () {
    let {error, handleSubmit, pristine, submitting} = this.props;
    let {isNeedHelpModalOpen} = this.state;

    return (
      <div className="coupon-code-container">
        {error && <ErrorMessage error={error} />}
        {this.renderCouponCodeTitle()}
        <form onSubmit={handleSubmit} className="coupon-code-form">
          <Field component={LabeledInputWithButton} buttonProps={{disabled: pristine || submitting, className: ' button-apply-coupons'}}
            className="coupon-code" name="couponCode" title="Enter Coupon Code" buttonText="Apply" />
        </form>

        {isNeedHelpModalOpen && <Modal contentLabel="Coupon Help" className="overlay-container overlay-coupon-information" overlayClassName="react-overlay overlay-center" isOpen>
          <ModalHeaderDisplayContainer onCloseClick={this.toggleNeedHelpModal} />
          <div className="overlay-content">
            <ContentSlot contentSlotName="bag_n_checkout_coupon_help" />
          </div>
        </Modal>}
      </div>
    );
  }
}

let onSubmitSuccess = (result, dispatch) => dispatch(reset('couponCodeForm'));

let validateMethod = createValidateMethod(getStandardConfig(['couponCode']));

let CouponCodeForm = reduxForm({
  form: 'couponCodeForm',  // a unique identifier for this form
  onSubmitSuccess,
  ...validateMethod
})(_CouponCodeForm);

export {CouponCodeForm};
