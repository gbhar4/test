/** @module LandingPLCC
 * @summary LandingPLCC
 *
 * @author Oliver Ramirez
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Modal} from 'views/components/modal/Modal.jsx';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';
import {RewardsBenefitsSummary} from 'views/components/plcc/landing/rewardsBenefitsSummary.jsx';
import {PAGES} from 'routing/routes/pages';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {PLCC_SECTIONS} from 'routing/routes/plccRoutes.js';
import {PLCCExistingAccountContainer} from 'views/components/plcc/PLCCExistingAccountContainer.js';
import cssClassName from 'util/viewUtil/cssClassName';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.landing-plcc.scss');
} else {
  require('./_m.landing-plcc.scss');
}

export class LandingPLCC extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,

    /* flags if the user already has plcc on their account */
    isHasPlcc: PropTypes.bool.isRequired,

    /* flag to enable web instant credit  form */
    isShowApplyButton: PropTypes.bool.isRequired,

    /* flag to enable prescreen code form */
    isPrescreenEnabled: PropTypes.bool.isRequired,

    /* oparator for submititng prescreen code */
    onPrescreenSubmit: PropTypes.func.isRequired
  }

  constructor (props, context) {
    super(props, context);

    this.state = {
      isPrescreenModalOpen: false
    };

    this.handleToggleExistingAccount = this.handleToggleExistingAccount.bind(this);
  }

  handleToggleExistingAccount () {
    this.setState({
      isExistingAccountModalOpen: !this.state.isExistingAccountModalOpen
    });
  }

  render () {
    let {isHasPlcc, isShowApplyButton, isPrescreenEnabled, isMobile} = this.props;
    let {isExistingAccountModalOpen} /* ,isPrescreenModalOpen */ = this.state;

    let applyTodayClassName = cssClassName(
      'button-apply ',
      {'button-primary ': isMobile, 'button-quaternary ': !isMobile}
    );

    return (
      <div className="landing-plcc-container">
        {/* NOTE: DT-31042 Enhancement */}
        <ContentSlot contentSlotName="place_rewards_main_image" className="landing-plcc-content-slot" />

        {/* FIXME: there's a bug in HyperLink, without the key, it does not update the href when receiving new props */}
        {isShowApplyButton
          ? (isHasPlcc
            ? <button onClick={this.handleToggleExistingAccount} className={applyTodayClassName}>Apply or Accept Offer</button>
            : <HyperLink key={PLCC_SECTIONS.application.id} destination={PLCC_SECTIONS.application} className={applyTodayClassName}>Apply or Accept Offer</HyperLink>)
          : null
        }
        <a href="https://d.comenity.net/childrensplace/?ecid=manageacct" target="_blank" className="button-manage">Manage credit account</a>

        { /* NOTE: DT-27573 */ }
        {isShowApplyButton && isPrescreenEnabled && <p className="message"><span>PRE-SCREEN CODE?</span> If you’ve received a pre-screen code, click ‘APPLY OR ACCEPT OFFER’ and provide it in the designated field.</p>}

        {isMobile && <img src="/wcsstore/static/images/bigger-better-benefits.png" alt="rewards info" className="img-rewards-info" />}

        <div>
          {!isMobile && <img src="/wcsstore/static/images/my-place-rewards-cc.png" className="img-place-cc" />}

          <img src="/wcsstore/static/images/information-points.png" alt="information points" className="img-info-points" />
        </div>

        {!isMobile && <img src="/wcsstore/static/images/bigger-better-benefits.png" alt="rewards info" className="img-rewards-info" />}

        <RewardsBenefitsSummary />

        <span className="separator"></span>

        {isShowApplyButton
          ? (isHasPlcc
            ? <button onClick={this.handleToggleExistingAccount} className={applyTodayClassName}>Apply or Accept Offer</button>
            : <HyperLink key={PLCC_SECTIONS.application.id + '-bottom'} destination={PLCC_SECTIONS.application} className={applyTodayClassName}>Apply or Accept Offer</HyperLink>)
          : null
        }

        <a href="https://d.comenity.net/childrensplace/?ecid=manageacct" target="_blank" className="button-manage">Manage credit account</a>

        <div className="container-links">
          <HyperLink destination={PAGES.helpCenter} pathSuffix="#creditcard" className="link-footer">FAQ</HyperLink>
          <HyperLink destination={PAGES.helpCenter} pathSuffix="#fullTermsli" className="link-footer">Reward terms</HyperLink>
        </div>

        <p className="rewards-terms">
          <sup>*</sup>Must have a valid email address on file or be registered online at childrensplace.com/rewards in order to receive and redeem points for reward certificates.
          For eligible purchases at The Children’s Place store in the U.S. and Puerto Rico and at childrensplace.com, My Place Rewards members earn 1 point per US dollar spent,
          rounded to the nearest dollar, and My Place Rewards Credit Cardholders earn 2 points per US dollar spent, rounded to the nearest dollar. My Place Rewards members receive a $5 reward certificate for every 100 points.
          The My Place Rewards Program is provided by The Children's Place, Inc. and its terms may change at any time. For full Rewards Terms and Conditions, please visit childrensplace.com/rewards.
          <br /><br />

          <sup>**</sup>Must register kids&#8217; birthday(s) and have a valid U.S. email address online at childrensplace.com/rewards in order to receive birthday coupon(s).
          May only register up to 4 kids&#8217; birthday(s). Additional terms and conditions apply.
          <br /><br />

          <sup>§</sup> For both 30% off first purchase and 20% off when you get your card: Subject to credit approval. Valid for one-time use in U.S. and Puerto Rico only.
          Not valid in Canada or online when shipping to Canada. Not valid toward purchase of gift cards, previously purchased merchandise,
          or licensed and third-party branded products online. Cannot be redeemed in a closing store or in conjunction with any online site-wide percentage-off event.
          Cannot be combined with any other offer except My Place Rewards certificate. Discount applied after other applicable discounts,
          and before taxes and shipping fees. Returns and exchanges are subject to discount taken at time of redemption. Will not be replaced if lost, stolen or corrupted.
          Internet distribution strictly prohibited. Offer may be cancelled or modified at any time. Void where prohibited. My Place Rewards Credit Card Accounts are issued by Comenity Capital Bank.
          <br /><br />

          <sup>†</sup> Valid on standard shipping in the contiguous U.S. when using your credit card. Free shipping will automatically be applied to all orders; no web code needed.
          Offer is good for free standard shipping or priority shipping if shipping to a street address or a P.O. Box address in the contiguous U.S or a PO Box (but not a street address) in the following areas:
          U.S. Territories, Military addresses/APOs, AK, HI, PR and some rural areas. Not valid on any express or rush shipping service. Not valid on orders shipped to an address in Canada, or on previously purchased merchandise.
          Shipping delivery refers to orders being shipped to a street address in the contiguous U.S. and does not include AK, HI, PR, U.S. Territories, military addresses, PO boxes, and some rural areas.
        </p>

        <div className="rewards-terms">
          <h3>The Children's Place Credit Card | Apply For A My Place Rewards Card</h3>
          <p>
            Experience shopping in a whole new way with The Children’s Place Credit Card. Named the My Place Rewards Credit Card, it can help cardholders save every day! You may enjoy special bonuses like 30% off your first My Place Rewards Credit Card purchase, 25% off Birthday Savings and Free Standard Shipping with your initial My Place Rewards Credit Card purchase. My Place Rewards Credit Card delivers automatic My Place Rewards membership, monthly exclusive credit card offers, as well as convenient payment options in stores and online for simple account management. Our online tools and customer support service make managing your account quick and easy.
          </p>
        </div>

        {isExistingAccountModalOpen &&
          <Modal className="overlay-container" overlayClassName="react-overlay overlay-center overlay-form-plcc overlay-border-decoration" contentLabel=" " isOpen>
            <ModalHeaderDisplayContainer onCloseClick={this.handleToggleExistingAccount} />
            <PLCCExistingAccountContainer onClose={this.handleToggleExistingAccount} isModal isShowContinueShoppingLink isInstantCredit />
          </Modal>}
      </div>
    );
  }
}
