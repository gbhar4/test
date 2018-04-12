/** @module WIC Promo Modal
 * @summary WIC Promo Modal
 * @link https://app.zeplin.io/project/58ebe5a5183be7620251b36e/screen/58ff48cca45bee86a853e5e4
 *
 * @author Agu
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Modal} from 'views/components/modal/Modal.jsx';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';
import {PLCCExistingAccountContainer} from 'views/components/plcc/PLCCExistingAccountContainer.js';
import {PAGES} from 'routing/routes/pages.js';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import cssClassName from 'util/viewUtil/cssClassName';

if (DESKTOP) { // eslint-disable-line
  require('./_d.promo-modal-plcc.scss');
} else {
  require('./_m.promo-modal-plcc.scss');
}

export class LandingPLCCModal extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,

    /* callback to accept the promo */
    onAcceptPromo: PropTypes.func.isRequired,

    /* indicates to show 'apply' button (kill switch) */
    isShowApplyButton: PropTypes.bool.isRequired,

    /* indicates the user already has a plcc stored on his account */
    isHasPlcc: PropTypes.bool.isRequired,

    /* callback to close the promo modal */
    onClose: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);

    this.state = { isPrescreenModalOpen: false };
    this.handleToggleExistingAccount = this.handleToggleExistingAccount.bind(this);
  }

  handleToggleExistingAccount () {
    this.setState({
      isExistingAccountModalOpen: !this.state.isExistingAccountModalOpen
    });
  }

  render () {
    let {isMobile} = this.props;
    let {isExistingAccountModalOpen} = this.state;
    let contentLabel = cssClassName(
      isExistingAccountModalOpen ? 'You ve already an account' : 'Promo Modal Plcc'
    );
    let overlayClassName = cssClassName('react-overlay ', 'overlay-center ', 'overlay-border-decoration ',
      isExistingAccountModalOpen ? ' overlay-form-plcc ' : 'overlay-promo-plcc'
    );

    return (
      <Modal onRequestClose={this.props.onClose} className="overlay-container" contentLabel={contentLabel} overlayClassName={overlayClassName} isOpen>
        <ModalHeaderDisplayContainer onCloseClick={this.props.onClose} />
        {!isExistingAccountModalOpen
          ? (isMobile
            ? this.renderMobile()
            : this.renderDesktop()
          ) : (
            <PLCCExistingAccountContainer onClose={this.handleToggleExistingAccount} isModal isInstantCredit isShowContinueShoppingLink />
          )
        }
      </Modal>
    );
  }

  renderMobile () {
    let {isShowApplyButton, isHasPlcc} = this.props;

    return (
      <div className="promo-modal-container">

        <img src="/wcsstore/static/images/place-rewards-card.png" alt="my place rewards card img" className="img-promo-plcc" />

        <img src="/wcsstore/static/images/save-discount-mobile.png" alt="save discount" className="img-save-discount" />

        <p className="title-promo">When you open and use a <b>my place rewards credit card</b></p>

        {isShowApplyButton && (
          isHasPlcc
            ? <button onClick={this.handleToggleExistingAccount} className="button-primary button-apply">Apply or Accept Offer</button>
            : <button type="button" onClick={this.props.onAcceptPromo} className="button-primary button-apply">Apply or Accept Offer</button>
          )
        }

        <a className="learn-more" href="/us/place-card?ecid=mprcc_txt_learn_glft_100916" target="_blank">Learn More</a>

        <img src="/wcsstore/static/images/bigger-better-benefits.png" alt="rewards info" className="img-rewards-info" />

        <ul className="list-benefits">
          <li><strong>Double points</strong> on every credit card purchase*</li>
          <li><strong>30% off</strong> <span>your first credit card purchase</span></li>
          <li><strong>25% off</strong> for your kids' birthdays!**</li>
          <li><strong>20% off</strong> when you get your card</li>
          <li><strong>Free standard shipping</strong> every day</li>
        </ul>

        <div className="links-container">
          <sup>*§**†</sup><a href="/us/place-card?ecid=mprcc_txt_learn_glft_100916" target="_blank">Details</a>
          <HyperLink destination={PAGES.helpCenter} pathSuffix="#creditcard" className="contact-us-link">Faq</HyperLink>
          <HyperLink destination={PAGES.helpCenter} pathSuffix="#fullTermsli" target="_blank">Reward terms</HyperLink>
        </div>
      </div>
    );
  }

  renderDesktop () {
    let {isShowApplyButton, isHasPlcc} = this.props;

    return (
      <div className="promo-modal-container">

        <img src="/wcsstore/static/images/place-rewards-card.png" alt="my place rewards card img" className="img-promo-plcc" />

        <img src="/wcsstore/static/images/save-discount-desktop.png" alt="save discount" className="img-save-discount" />

        <p className="title-promo">When you open and use a <b>my place rewards credit card</b></p>

        {isShowApplyButton && (
          isHasPlcc
            ? <button onClick={this.handleToggleExistingAccount} className="button-primary button-apply">Apply or Accept Offer</button>
            : <button type="button" onClick={this.props.onAcceptPromo} className="button-primary button-apply">Apply or Accept Offer</button>
          )
        }

        <a className="learn-more" href="/us/place-card?ecid=mprcc_txt_learn_glft_100916" target="_blank">Learn More</a>

        <img src="/wcsstore/static/images/information-points.png" alt="information points" className="img-info-points" />
        <img src="/wcsstore/static/images/bigger-better-benefits.png" alt="rewards info" className="img-rewards-info" />

        <ul className="list-benefits">
          <li><strong>Double points</strong> on every credit card purchase*</li>
          <li><strong>30% off</strong> <span>your first credit card purchase</span></li>
          <li><strong>25% off</strong> for your kids' birthdays!**</li>
          <li><strong>20% off</strong> when you get your card</li>
          <li><strong>Free standard shipping</strong> every day</li>
        </ul>

        <div className="links-container">
          <sup>*§**†</sup><a href="/us/place-card?ecid=mprcc_txt_learn_glft_100916" target="_blank">Details</a>
          <HyperLink destination={PAGES.helpCenter} pathSuffix="#creditcard" className="contact-us-link">Faq</HyperLink>
          <HyperLink destination={PAGES.helpCenter} pathSuffix="#fullTermsli" target="_blank">Reward terms</HyperLink>
        </div>
      </div>
    );
  }
}
