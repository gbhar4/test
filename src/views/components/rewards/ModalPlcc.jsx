/**
 * @module Plcc Rewards.
 * @author Damián Rossi <drossi@minutentag.com>
 * Shows a benefiths for My Place Rewards
 * @param isMobile  = to define styles and visible texts
          FooterNotes = shows terms on footer notes.
 *
 * NOTE: THIS SHOULD BE DELETED
 */

import React from 'react';
import {Modal} from 'views/components/modal/Modal.jsx';

import {HeaderPlcc} from './plcc/HeaderPlcc.jsx';
import {ContentPlcc} from './plcc/ContentPlcc.jsx';

// TODO: rewrite this component
if (DESKTOP) { // eslint-disable-line
  require('./_d.plcc-rewards.scss');
} else {
  require('./_m.plcc-rewards.scss');
}

class ModalPlcc extends React.Component {
  render () {
    let {isMobile, footerNotes, isOpen} = this.props;

    if (!isOpen) {
      return null;
    }

    return (
      <Modal contentLabel="My Place Rewards Credit Card Modal" className="react-overlay modal-plcc" overlayClassName={'rewards ' + !isMobile
        ? 'overlay-center'
        : null} isOpen>
        <div className="overlay-container overlay-plcc-container">
          <button type="button" className="button-overlay-close" aria-label="Close this modal" onClick={false}></button>
          <HeaderPlcc isMobile={isMobile} footerNotes={footerNotes} />
          <p className="modal-content">Experience shopping in a whole new way with The Children's Place Credit Card. Named the My Place Rewards Credit Card, it can help cardholders save every day! You may enjoy special bonuses like 30% off your first My Place Rewards Credit Card purchase, 25% off Birthday Savings and Free Standard Shipping with your initial My Place Rewards Credit Card purchase. My Place Rewards Credit Card delivers automatic My Place Rewards membership, monthly exclusive credit card offers, as well as convenient payment options in stores and online for simple account management. Our online tools and customer support service make managing your account quick and easy.</p>

          <ContentPlcc footerNotes={footerNotes} />
        </div>
      </Modal>
    );
  }
}

export {ModalPlcc};
