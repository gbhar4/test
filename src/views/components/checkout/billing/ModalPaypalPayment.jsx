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
import {requireNamedOnlineModule} from 'util/resourceLoader';

if (DESKTOP) { // eslint-disable-line
  require('./_d.modal-paypal-payment.scss');
} else {
  require('./_m.modal-paypal-payment.scss');
}

class ModalPaypalPayment extends React.Component {
  static propTypes = {
    /** callback triggered when clicking on the button to start checkout */
    settings: PropTypes.shape({
      centinelPostbackUrl: PropTypes.string.isRequired,
      centinelTermsUrl: PropTypes.string.isRequired,
      centinelPayload: PropTypes.string.isRequired,
      centinelOrderId: PropTypes.string.isRequired
    }).isRequired,

    onClose: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);
    this.captureFormRef = (ref) => { this.formRef = ref; };
  }

  componentDidMount () {
    // create form and submit
    requireNamedOnlineModule('paypal').then(() => {
      this.formRef.submit();
    });
  }

  render () {
    let {centinelPostbackUrl, centinelTermsUrl, centinelPayload, centinelOrderId} = this.props.settings || {};

    return (
      <Modal contentLabel="Paypal Modal" className="overlay-container" overlayClassName="overlay-paypal-payment react-overlay overlay-center" preventEventBubbling isOpen>
        <ModalHeaderDisplayContainer title="Pay with PayPal" onCloseClick={this.props.onClose} >
          <button type="button" onClick={this.props.onClose} aria-label="back" className="button-back">Back</button>
        </ModalHeaderDisplayContainer>

        <form ref={this.captureFormRef} method="POST" action={centinelPostbackUrl}>
          <input type="hidden" name="PaReq" value={centinelPayload} />
          <input type="hidden" name="TermUrl" value={centinelTermsUrl + '&PaReq=' + encodeURIComponent(centinelPayload) + '&MD=' + encodeURIComponent(centinelOrderId)} />
          <input type="hidden" name="MD" value={centinelOrderId} />
        </form>
      </Modal>
    );
  }
}

export {ModalPaypalPayment};
