/**
 * @module ModalPaypalSelected
 * @author Florencia Acosta <facosta@minutentag>
 * @author Agu
 * Modal for showing the message of Paypal, in the cart section, when choosing Paypal as payment method.
 *
 * Style (ClassName) Elements description/enumeration
 *  .overlay-paypal-selected
 *
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Modal} from 'views/components/modal/Modal.jsx';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';

class ModalConfirmPaypalPayment extends React.Component {
  static propTypes = {
    /** callback triggered when clicking on the button to start checkout */
    onStartPaypalPayment: PropTypes.func.isRequired,

    /** callback triggered when clicking close button */
    onClose: PropTypes.func.isRequired,

    isMobile: PropTypes.bool.isRequired
  }

  render () {
    return (
      <Modal contentLabel="Proceed to Paypal Confirmation Modal" className="overlay-container" overlayClassName="overlay-paypal-selected react-overlay overlay-center" isOpen>
        <ModalHeaderDisplayContainer className="header-modal-paypal" title="Pay with PayPal" onCloseClick={this.props.onClose} >
          {this.props.isMobile && <button type="button" onClick={this.props.onClose} aria-label="back" className="button-back">Back</button>}
        </ModalHeaderDisplayContainer>

        <div className="message-paypal">
          <p className="message-paypal-selected">By selecting PayPal, you will leave childrensplace.com to complete the order process with PayPal's site.<br />
            Upon PayPal payment completion, you will be returned to childrensplace.com</p>
          <p className="message-paypal-selected">Please review your purchase and delivery details before proceeding.</p>
        </div>

        <button type="button" onClick={this.props.onStartPaypalPayment} className="button-primary">Proceed with PayPal</button>
      </Modal>
    );
  }
}

export {ModalConfirmPaypalPayment};
