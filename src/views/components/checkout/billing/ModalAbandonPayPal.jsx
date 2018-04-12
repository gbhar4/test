/**
 * @module ModalAbandonPaypal
 * @author Florencia Acosta <facosta@minutentag>
 * @author Agu
 * Modal so that the user confirms he wants to abandon paypal payment method (going from paypal back to cart in type toggler)
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Modal} from 'views/components/modal/Modal.jsx';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';

class ModalAbandonPayPal extends React.Component {
  static propTypes = {
    /* callback to close the modal */
    onBackToPaypal: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);

    this.state = {
      abandonConfirmed: false
    };

    this.handleChangePayment = this.handleChangePayment.bind(this);
    this.handleBackToPaypal = this.handleBackToPaypal.bind(this);
  }

  handleChangePayment (event) {
    this.setState({
      abandonConfirmed: true
    });
    this.props.onChangeToCCPayment(event);
  }

  handleBackToPaypal (event) {
    this.props.onBackToPaypal(event);
  }

  render () {
    let title = 'Do you want to switch from PayPal to a different payment method?';
    let subtitle = 'Changing your payment method will log you out of PayPal. You can log back in at any time. Are you sure you want to proceed?';

    return (!this.state.abandonConfirmed &&
      <Modal onRequestClose={this.handleBackToPaypal} contentLabel="Abandon Paypal Confirmation Modal" className="overlay-container"
        overlayClassName="overlay-abandon-paypal react-overlay overlay-center" isOpen>
        <ModalHeaderDisplayContainer title={title} subtitle={subtitle} onCloseClick={this.handleBackToPaypal} />

        <div className="button-container">
          <button type="button" onClick={this.handleChangePayment} className="button-primary">Change Payment Method</button>
          <button type="button" onClick={this.handleBackToPaypal} className="button-secondary">Continue With Paypal</button>
        </div>
      </Modal>
    );
  }
}

export {ModalAbandonPayPal};
