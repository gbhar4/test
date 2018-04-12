/**
 * @module CouponModal
 * Modal for showing coupon info and printable options
 *
 * @author Damian <drossi@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Modal} from 'views/components/modal/Modal.jsx';
import cssClassName from 'util/viewUtil/cssClassName';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';
import Barcode from 'react-barcode';

if (DESKTOP) { // eslint-disable-line
  require('./menu/rewards/_d.print-and-view-overlay.scss');
} else {
  require('./menu/rewards/_m.print-and-view-overlay.scss');
}

class CouponModal extends React.Component {
  static propTypes = {
    /** Whether to render for mobile. */
    isMobile: PropTypes.bool,

    isOpen: PropTypes.bool.isRequired,

    coupon: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      details: PropTypes.string.isRequired
    }),

    onClose: PropTypes.func.isRequired
  }

  handlePrint (coupon) {
    window.print();
  }

  render () {
    let {isMobile, isOpen, coupon, onClose} = this.props;
    let containerModalClass = cssClassName('react-overlay ', 'overlay-center ', 'overlay-coupon-printable');

    return (
      <Modal contentLabel="Authentication Modal" className="overlay-container" overlayClassName={containerModalClass} isOpen={isOpen}>
        <ModalHeaderDisplayContainer title={isMobile ? 'My Rewards & Offers' : ''} onCloseClick={onClose} />

        <figure className="coupon-item">
          <img className="logo-image-coupon" src="/wcsstore/static/images/TCP-Logo.svg" />

          {coupon &&
            <div className="barcode-coupon-container">
              <h1 className="reward-value">{coupon.title}</h1>
              <div className="barcode-vector">
                <Barcode value={coupon.id} />
              </div>
              <span className="web-code-container">{coupon.id}</span>
            </div>
          }
        </figure>

        {coupon && coupon.details && <p className="claim-text">
          {coupon.details}
        </p>}

        {!isMobile && <button className="button-coupon-print" onClick={this.handlePrint}>Print</button>}
        <button className="button-coupon-cancel" onClick={onClose}>Cancel</button>
      </Modal>
    );
  }
}

export {CouponModal};
