/**
 * @module TrackOrder
 * @summary Modal form to allow a guest user to track the status of an order by entering
 * email address and order number.
 *
 *
 * Usage: use with container
 *  import {TrackOrderContainer} from 'views/trackOrder/TrackOrderContainer.js';
 *
 *  <TrackOrderContainer />
 *
 * Style (ClassName) Elements description/enumeration
 *  track-order
 *
 * Uses
 * <Modal /> (from react-modal)

 * @author Oliver Ramírez
 * @author Miguel Alvarez Igarzábal
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';
import {Modal} from 'views/components/modal/Modal.jsx';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';
import {HELP_CENTER_PAGE} from 'routing/routes/helpCenterRoutes.js';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {Field, reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {getStandardConfigRules, getStandardConfigMessages} from 'util/formsValidation/validatorStandardConfig';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';

if (DESKTOP) { // eslint-disable-line
  require('./_d.trackorder.scss');
} else {
  require('./_m.trackorder.scss');
}

class TrackOrder extends React.Component {
  static propTypes = {
    /** Whether the modal should be open. */
    isOpen: PropTypes.bool,

    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool.isRequired,

    /** Whether we are targeting mobile. */
    isMobile: PropTypes.bool,

    openTrackOrderModal: PropTypes.func.isRequired,
    closeTrackOrderModal: PropTypes.func.isRequired,
    openLoginModal: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);
    this.handleOpen = this.handleOpen.bind(this);
  }

  handleOpen (event) {
    this.props.openTrackOrderModal();
  }

  render () {
    let { title, isOpen } = this.props;

    return (<span>
      <button type="button" title={title} onClick={this.handleOpen} className="item-navigation-link">{title}</button>
      {isOpen && <TrackOrderForm {...this.props} />}
    </span>);
  }
}

// DT-32252
// In previous implementation the TrackOrderForm redux form was always in the DOM (whether modal was open or not)
// This was causing the validation to break if the user opened, closed, and re-opened the modal
// To fix we need to make sure the redux form is fully unmounted/destroyed when the modal closes
class _TrackOrderForm extends React.Component {
  static propTypes = {
    closeTrackOrderModal: PropTypes.func.isRequired,
    openLoginModal: PropTypes.func.isRequired,
    ...reduxFormPropTypes
  }

  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
  }

  handleClose(event) {
    this.props.closeTrackOrderModal();
  }

  handleLoginClick(event) {
    this.props.openLoginModal();
  }

  render() {
    let { isGuest, isMobile, error, handleSubmit, modalTitle, modalSubtitle, orderNumberLabel } = this.props;

    let overlayClassNameVar = cssClassName('react-overlay overlay-center ', {
      'track-order-mobile': isMobile,
      'track-order-desktop': !isMobile
    });

    return (
      <Modal contentLabel="Track Order Modal" className="overlay-container" overlayClassName={overlayClassNameVar} preventEventBubbling isOpen>
        <div className="track-order">
          <form className="container-popup" onSubmit={handleSubmit}>
            <ModalHeaderDisplayContainer title={modalTitle || 'Track Order'} subtitle={modalSubtitle || 'Enter your email address and order number.'} onCloseClick={this.handleClose} />

            {error && <ErrorMessage error={error} />}

            <Field component={LabeledInput} title="Email Address" type="text" name="emailAddress" placeholder="" />
            <Field component={LabeledInput} title={orderNumberLabel || 'Order Number'} type="text" name="orderNumber" placeholder="" />

            <HyperLink destination={HELP_CENTER_PAGE} pathSuffix="#faq" className="need-help" target="_blank">Need help?</HyperLink>

            <button className="button-primary button-submit" type="submit">Track order</button>

            <div className="container-shortcuts">
              {isGuest && <p className="login-to-see">Have an account? <br />
                <button type="button" title="Log In" onClick={this.handleLoginClick} className="button-login">Log In</button> to see your order history
              </p>}

              <p className="international-order">
                {/* FIXME: hardcoded url */}
                <a href="https://services.fiftyone.com/tracking.srv" target="_blank">Click here</a> to track an international order.
              </p>
            </div>
          </form>
        </div>
      </Modal>);
  }
}

let validateMethod = createValidateMethod({
  rules: {
    ...getStandardConfigRules([{ 'emailAddress': 'emailAddressNoAsync' }, 'orderNumber'])
  },
  messages: {
    ...getStandardConfigMessages([{ 'emailAddress': 'emailAddressNoAsync' }, 'orderNumber']),
    orderNumber: 'Please enter a valid order number'
  }
});

let TrackOrderForm = reduxForm({
  form: 'TrackOrderForm',  // a unique identifier for this form
  ...validateMethod
})(_TrackOrderForm);

export {TrackOrder};
