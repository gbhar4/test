/**
 * @module ApprovedPlcc
 * @summary when the user complete the form to apply to the credit card if it is approved instantly appears this content
 *
 * @author Oliver Ramirez
 * @author Damian <drossi@minutentag.com>
 * @Note commented text (line 155 in july 17th, should be replacing it's followed uncommented content when confirmed by pasquale on ticket DT-24708
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {CardWithSmile} from 'views/components/plcc/CardWithSmile.jsx';
import {Notification} from 'views/components/common/Notification.jsx';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {PAGES} from 'routing/routes/pages';
import {isClient} from 'routing/routingHelper';
import cssClassName from 'util/viewUtil/cssClassName';

if (DESKTOP) { // eslint-disable-line
  require('./_d.approved-card.scss');
} else {
  require('./_m.approved-card.scss');
}

export class ApprovedPlcc extends React.Component {
  static propTypes = {
    /** Flag to know if content should be into a modal */
    isModal: PropTypes.bool.isRequired,
    /** isInstantCredit: When is rtps */
    isInstantCredit: PropTypes.bool,
    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool.isRequired,
    /** Flags indicates whether the user is a remembered guest */
    isRemembered: PropTypes.bool.isRequired,
    /** User's first name */
    firstName: PropTypes.string.isRequired,
    /** If coupon code of discount is available come as string */
    couponCode: PropTypes.string,
    /** Flag available wheter user have items in bag */
    isShowCheckoutButton: PropTypes.bool.isRequired,
    /** Flag indicates when user can buy more */
    isShowContinueShoppingLink: PropTypes.bool.isRequired,
    /** Indicates how much saving amount */
    savingAmount: PropTypes.number.isRequired,
    /** Indicates number of card */
    cardNumber: PropTypes.string,
    /** If come Indicates the credit card limit */
    creditLimit: PropTypes.number,
    /** */
    globalSignalsOperator: PropTypes.object.isRequired,
    /** Function when the user click in the button checkout */
    onCheckoutClick: PropTypes.func.isRequired
  }

  constructor (props, context) {
    super(props, context);

    this.state = {
      isCopiedToClipboard: false,
      isHideCopyLink: false
    };

    this.attachPromoCodeRef = this.attachPromoCodeRef.bind(this);
    this.handleCopyPromoCode = this.handleCopyPromoCode.bind(this);

    this.handleCloseNotification = this.handleCloseNotification.bind(this);

    this.handleCreateAccount = this.handleCreateAccount.bind(this);
    this.handleLoginDrawer = this.handleLoginDrawer.bind(this);
    this.capitalize = this.capitalize.bind(this);
  }

  capitalize (stringValue) {
    return stringValue.charAt(0).toUpperCase() + stringValue.slice(1).toLowerCase();
  }

  componentWillMount () {
    // REVIEW / FIXME: I know we have a routing component for this,
    // but this page does not require a new route
    if (isClient() && !this.props.isModal) {
      window.scrollTo(0, 0);
    }

    // DT-29499: security reasons
    let userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if ((/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)) {
      this.setState({ isHideCopyLink: true });
    }
  }

  attachPromoCodeRef (ref) {
    this.promoCodeRef = ref;
  }

  handleCopyPromoCode () {
    this.promoCodeRef.disabled = false;
    this.promoCodeRef.select();

    try {
      document.execCommand('copy');
      this.setState({
        isCopiedToClipboard: true
      });
    } catch (err) {
      console.log('Oops, unable to copy');
    }

    this.promoCodeRef.disabled = true;
  }

  handleCloseNotification () {
    this.setState({
      isCopiedToClipboard: false
    });
  }

  handleCreateAccount () {
    this.props.globalSignalsOperator.openCreateAccountDrawer();
  }

  handleLoginDrawer () {
    this.props.globalSignalsOperator.openLoginDrawer();
  }

  render () {
    let {isShowContinueShoppingLink, isModal, isGuest, isShowCheckoutButton, firstName,
        couponCode, savingAmount, creditLimit, isInstantCredit} = this.props;
    let {isCopiedToClipboard, isHideCopyLink} = this.state;
    let containerClassName = cssClassName('approved-plcc-container ', { 'approved-non-instant': !isInstantCredit && isCopiedToClipboard });

    let option = '';
    var content = '';

    !isInstantCredit
      ? (!isGuest
        ? option = 'RTPS Registered'
        : option = 'RTPS Guest')
      : (!isGuest
        ? option = 'WIC Registered'
        : option = 'WIC Guest');

    switch (option) {
      case 'RTPS Registered':
        content = <p className="text-approved">
          <strong>Your shiny new MY PLACE REWARDS CREDIT CARD is on its way…</strong><br />
          It will arrive in 7 to 10 business days. But there’s no need to wait for double points* and free standard shipping<sup>†</sup>.
          on every purchase, every day because we’ve already saved your card (and your 30% off coupon<sup>§</sup>) to your My Place Rewards account.
          Your new card will automatically be selected as the payment method for this purchase.
        </p>;
        break;
      case 'RTPS Guest':
        content = <p className="text-approved">
          <strong>Your shiny new MY PLACE REWARDS CREDIT CARD is on its way…</strong><br />
          It will arrive in 7 to 10 business days. But there’s no need to wait for double points* and free standard shipping<sup>†</sup>.
          For this purchase, your new card will automatically be selected as the payment method, and you’ll be able to apply your 30% welcome offer<sup>§</sup>.
          Please note, if you don’t checkout today, you’ll need to wait until you receive your card to use the welcome offer.
          If you’re shopping in stores, have an associate look up your credit card.<br /><br />

          A My Place Rewards account will be created for you. Be on the lookout for an email to reset your password.
        </p>;
        break;
      case 'WIC Registered':
        content = <p className="text-approved">
          <strong>Your shiny new MY PLACE REWARDS CREDIT CARD is on its way... </strong><br />
          It will arrive in 7 to 10 business days. But there&apos;s no need to wait for double points* and free standard shipping<sup>†</sup> on every purchase,
          every day because we&apos;ve already saved your card (and your 30% off coupon<sup>§</sup>) to your My Place Rewards account.<br /><br />

          Start earning double points now when you check out, or shop in stores and have an associate look up your account.
        </p>;
        break;
      case 'WIC Guest':
        content = <p className="text-approved">
          <strong>Your shiny new MY PLACE REWARDS CREDIT CARD is on its way… </strong><br />
          It will arrive in 7 to 10 business days. But there&apos;s no need to wait for double points* and free standard shipping.<sup>†</sup> <button onClick={this.handleCreateAccount}>Create an account</button> now or <button onClick={this.handleLoginDrawer}>log in</button> to get these benefits and use your 30% welcome offer!<sup>§</sup><br /><br />

          {!isCopiedToClipboard
            ? <span>If you're shopping in stores while waiting for your card, have an associate look up your credit card.</span>
            : <span>To use your 30% off welcome coupon<sup>§</sup>, shop online with your new card number, or shop in stores and have an associate look up your account.</span>}
        </p>;
        break;
      default:
        content = null;
    }

    return (
      <div className={containerClassName}>
        {isCopiedToClipboard && <Notification className="notification">
          <span>30% off coupon has been copied to your clipboard!
            {!isModal && <button className="button-close" onClick={this.handleCloseNotification}></button>}
          </span>
        </Notification>}

        <CardWithSmile />
        <h3 className="title-approved">Congratulations, {this.capitalize(firstName)}! <br />
          You’re approved for the <strong>MY PLACE REWARDS CREDIT CARD.</strong>
        </h3>

        {creditLimit && <strong className="credit-limit">YOUR CREDIT LIMIT: ${creditLimit}</strong>}

        {/** Message of approved RTPS or WIC */}
        {content}

        {/* isContainsCardNumber && <div className="copied-message-container">
          <h3 className="copied-title">Your card number</h3>
          <span className="copied-number">{cardNumber}</span>
          <p className="copied-message">
            <strong>Print a copy of this page for your records, or write your card number down.
              Please note, once you close this window, you will not have access to this page.
            </strong>
          </p>
        </div> */}

        {couponCode && <div className="welcome-offer-container">
          <img src="/wcsstore/static/images/welcome-offer.png" alt="img offer" className="img-offer" />
          <div className="approved-coupon-value-container">
            <span className="offer-title"><strong>Your welcome offer</strong></span>
            <input type="text" disabled className="offer-code" ref={this.attachPromoCodeRef} value={couponCode} />
            {!isHideCopyLink && <button className="button-offer" onClick={this.handleCopyPromoCode}>Copy to Clipboard</button>}
            {isGuest
              ? <p className="message-offer-large">P.S. You&apos;ll also receive this coupon via email.<br />
                  Once this window is closed, you will not have access to this page. Please copy your coupon code.
                </p>
              : <p className="message-offer">P.S. You&apos;ll also receive this coupon via email.</p>}
          </div>
        </div>}

        {(savingAmount > 0) && <p className="message-bag">You could save <strong>${savingAmount.toFixed(2)}</strong> on your current order!</p>}

        {isShowCheckoutButton && (!isModal
          ? <HyperLink destination={PAGES.cart} className="button-primary button-checkout" forceRefresh>Checkout</HyperLink>
          : <button onClick={this.props.onCheckoutClick} className="button-primary button-checkout">Checkout</button>
        )}

        {isShowContinueShoppingLink && <HyperLink destination={PAGES.homePage} forceRefresh
          className={'button-primary button-continue-shopping' + (isShowCheckoutButton ? ' button-with-bag' : '')}>Continue Shopping</HyperLink>}

        <HyperLink destination={PAGES.webInstantCredit} className="details" target="_blank"><sup>*§**†</sup>DETAILS</HyperLink>
      </div>
    );
  }
}
