/** @module Promo Modal PLCC
 * @summary Promo Modal PLCC
 *
 * @author Oliver Ramirez
 */

import React from 'react';
import {Modal} from 'views/components/modal/Modal.jsx';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {PAGES} from 'routing/routes/pages.js';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.promo-modal-plcc.scss');
} else {
  require('./_m.promo-modal-plcc.scss');
}

export class PLCCPromoModal extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.state = {
      error: null
    };

    this.handleDeclinePlccPromo = this.handleDeclinePlccPromo.bind(this);
    this.handleAcceptPlccPromo = this.handleAcceptPlccPromo.bind(this);
  }

  handleDeclinePlccPromo () {
    this.setState({
      error: null
    });

    this.props.onDeclinePlccPromo().catch((err) => {
      if (err && err.errors) {
        this.setState({
          error: err.errors._error
        });
      }
    });
  }

  handleAcceptPlccPromo () {
    this.setState({
      error: null
    });

    this.props.onAcceptPlccPromo().then().catch((err) => {
      if (err && err.errors) {
        this.setState({
          error: err.errors._error
        });
      }
    });
  }

  render () {
    let { isMobile } = this.props;

    return (
      <Modal className="overlay-container" contentLabel="Promo Modal Plcc" overlayClassName="react-overlay overlay-center overlay-promo-plcc pre-approved-modal-container overlay-border-decoration" isOpen >
        {/* <ModalHeaderDisplayContainer onCloseClick={this.handleDeclinePlccPromo} /> */}
        {isMobile ? this.renderMobile() : this.renderDesktop()}
      </Modal>
    );
  }

  renderMobile () {
    let {error} = this.state;
    return (
      <div className="promo-modal-container">

        <img src="/wcsstore/static/images/place-rewards-card.png" alt="my place rewards card img" className="img-promo-plcc" />

        <p className="text-congratulations">Congratulations!<br /> You’ve been pre-approved<sup>1</sup></p>

        <img src="/wcsstore/static/images/save-discount-mobile.png" alt="save discount" className="img-save-discount" />

        <p className="title-promo">When you open and use a <b>my place rewards credit card</b></p>

        {error && <ErrorMessage error={error} />}

        <button type="button" onClick={this.handleAcceptPlccPromo} className="button-primary button-apply">Yes I'm interested</button>
        <button className="button-thanks" onClick={this.handleDeclinePlccPromo}>No thanks</button>

        <p className="text-info"><strong>You can choose to stop receiving “prescreened” offers of credit from this and
          other companies by calling toll-free 1-888-567-8688. See <u>PRESCREEN & OPT-OUT NOTICE</u> in the Terms and Conditions link below for more information about prescreened offers.
        </strong></p>

        <div className="links-container">
          <sup>*§**†</sup><a href="/us/place-card?ecid=mprcc_txt_learn_glft_100916" target="_blank">Details</a>
        </div>

        <p className="text-terms"><sup>1</sup>Subject to final credit approval. The My Place Rewards Credit Card is issued by Comenity Capital Bank.
          <a href="https://comenity.net/childrensplace/common/Legal/schumerbox.xhtml" target="_blank">Click here</a> for the Terms and Conditions for important rate, fee,
          other cost information and prescreen and opt-out notice.
        </p>
      </div>
    );
  }

  renderDesktop () {
    let {error} = this.state;
    return (
      <div className="promo-modal-container">

        <img src="/wcsstore/static/images/place-rewards-card.png" alt="my place rewards card img" className="img-promo-plcc" />

        <p className="text-congratulations">Congratulations! You’ve been pre-approved<sup>1</sup> for a <br /><strong>MY PLACE REWARDS CREDIT CARD.</strong></p>

        <img src="/wcsstore/static/images/save-discount-desktop.png" alt="save discount" className="img-save-discount" />

        <p className="title-promo">When you open and use a <b>my place rewards credit card</b></p>

        {error && <ErrorMessage error={error} />}

        <button type="button" onClick={this.handleAcceptPlccPromo} className="button-primary button-apply">Yes I'm interested</button>
        <button type="button" className="button-thanks" onClick={this.handleDeclinePlccPromo}>No thanks</button>

        <p className="text-info"><strong>You can choose to stop receiving “prescreened” offers of credit from this and
          other companies by calling toll-free 1-888-567-8688. See <u>PRESCREEN & OPT-OUT NOTICE</u> in the Terms and Conditions link below for more information about prescreened offers.
        </strong></p>

        <img src="/wcsstore/static/images/information-points.png" alt="information points" className="img-info-points" />
        <img src="/wcsstore/static/images/bigger-better-benefits.png" alt="rewards info" className="img-rewards-info" />

        <ul className="list-benefits">
          <li><strong>Double points</strong> on every credit card purchase<sup>*</sup></li>
          <li><strong>30% off</strong> <span>your first credit card purchase</span><sup>§</sup></li>
          <li><strong>25% off</strong> for you kid's birthdays!<sup>**</sup></li>
          <li><strong>20% off</strong> when you get your card<sup>§</sup></li>
          <li><strong>Free standard shipping</strong> every day<sup>†</sup></li>
        </ul>

        <div className="links-container">
          <sup>*§**†</sup><a href="/us/place-card?ecid=mprcc_txt_learn_glft_100916" target="_blank">Details</a>
          <HyperLink destination={PAGES.helpCenter} pathSuffix="#creditcard" className="contact-us-link" target="_blank">Faq</HyperLink>
          <HyperLink destination={PAGES.helpCenter} pathSuffix="#fullTermsli" target="_blank">Reward terms</HyperLink>
        </div>

        <p className="text-terms"><sup>1</sup>Subject to final credit approval. The My Place Rewards Credit Card is issued by Comenity Capital Bank.
          <a href="https://comenity.net/childrensplace/common/Legal/schumerbox.xhtml" target="_blank">Click here</a> for the Terms and Conditions for important rate, fee,
          other cost information and prescreen and opt-out notice.
        </p>
      </div>
    );
  }
}
