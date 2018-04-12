/** @module AddedToBagNotification
 * Shows the confirmation after adding a product to the bag in the header.
 * The component will close automatically if it's not hovered for 3 seconds.
 *
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {PAGES} from 'routing/routes/pages.js';
import {CartItemDisplay} from 'views/components/product/CartItemDisplay.jsx';
import cssClassName from 'util/viewUtil/cssClassName';
import {Modal} from 'views/components/modal/Modal.jsx';
import {ConfirmationModalContainer} from 'views/components/modal/ConfirmationModalContainer';
import {CONFIRM_MODAL_IDS} from 'reduxStore/storeOperators/cartOperator.js';
import {PaypalButtonContainer} from 'views/components/orderSummary/PaypalButtonContainer.js';

if (DESKTOP) { // eslint-disable-line
  require('./_d.added-to-bag-notification.scss');
} else {
  require('./_m.added-to-bag-notification.scss');
}

export class AddedToBagNotification extends React.Component {

  static propTypes = {
    /** Flags if we should render for mobile */
    isMobile: PropTypes.bool.isRequired,
    /** Cart item information */
    cartItem: CartItemDisplay.propTypes.cartItem,
    /** Flags if we should display */
    isVisible: PropTypes.bool,
    /** This is used to display the correct currency symbol */
    currencySymbol: PropTypes.string.isRequired,
    /** Function to call to close the notification */
    onClose: PropTypes.func.isRequired,
    /** Function to call to redirect to checkout (not a link because might need to login) */
    onRedirectToCheckout: PropTypes.func.isRequired,
    /** Customer initiated the PayPal Payment */
    initPayPalPayment: PropTypes.bool
  }

  constructor (props) {
    super(props);
    this.timeout = null;
    this.startCloseTimer = this.startCloseTimer.bind(this);
    this.cancelCloseTimer = this.cancelCloseTimer.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.closeNotification = this.closeNotification.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.isVisible && nextProps.isVisible && !nextProps.initPayPalPayment) {
      // If the user never hovers this notification, it should automatically
      // close in 3 secs.
      this.startCloseTimer(3);
    }
    if (this.props.isVisible && !nextProps.isVisible || nextProps.initPayPalPayment) {
      this.cancelCloseTimer();
    }
  }

  componentWillUnmount () {
    this.cancelCloseTimer();
  }

  handleMouseLeave () {
    // If the user hovers this notification and the moves the pointer away, it
    // should automatically close in 1 sec.
    this.startCloseTimer(1);
  }

  startCloseTimer (timeoutSeconds) {
    this.cancelCloseTimer();

    this.timeout = setTimeout(() => {
      this.props.onClose();
      this.props.setInitPayPalPayment(false);
    }, timeoutSeconds * 1000);
  }

  cancelCloseTimer () {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  closeNotification (e) {
    e.stopPropagation();
    this.props.onClose();
    this.props.setInitPayPalPayment(false);
  }

  proceedToCheckoutNotification () {
    return (
      <ConfirmationModalContainer contentLabel="Unavailable or Out-of-Stock Cart Items Confirmation Modal" modalId={CONFIRM_MODAL_IDS.OOS_OR_UNAVAILABLE}
      title="" promptClassName="message-cart-alert" confirmButtonText="Continue to Checkout" cancelButtonText="Back to bag"
      prompt="Some of the item(s) in your bag are either sold out or need updating. Continuing with checkout will remove them from your bag."
    />
    );
  }

  notificationContent () {
    let {cartItem, isMobile, currencySymbol, onRedirectToCheckout, isPayPalEnabled} = this.props;
    let contentClassName = cssClassName('add-to-bag-confirmation-content ');

    return (
      <div className={cssClassName('added-to-bag-container ', {'added-to-bag-desktop ': !isMobile})}>
      <div className={cssClassName('added-to-bag-container ', {'added-to-bag-desktop ': !isMobile})} onClick={this.closeNotification}></div>
        <div className={cssClassName({'add-to-bag-confirmation': !isMobile})} onMouseEnter={this.cancelCloseTimer} onMouseLeave={this.handleMouseLeave}>
          <div className={contentClassName}>
            <h2 className="title-checkout-modal">Added to bag</h2>
            <CartItemDisplay cartItem={cartItem} currencySymbol={currencySymbol} isPriceVisible={false} isMobile={isMobile} />
            <div className="button-container">
              <HyperLink destination={PAGES.cart} className="button-view-bag">View Bag</HyperLink>
              <div className={cssClassName({'payment-buttons ': true, 'mobile-payment-buttons': (isMobile && isPayPalEnabled)})}>
                {(isPayPalEnabled) && <PaypalButtonContainer isSkipPaymentEnabled isAddToBagModal text={<img src="/wcsstore/static/images/paypal-button-logo-100x26.png" alt="PayPal" />} className={cssClassName({'paypal-button-mobile': isMobile, 'paypal-button-desktop': !isMobile})}/>}
                <button type="button" onClick={onRedirectToCheckout} className="button-checkout">Checkout</button>
              </div>
              <button type="button" className="button-close" onClick={this.closeNotification}>Close</button>
              {!isMobile && <button className="continue-shopping" onClick={this.closeNotification}>Continue Shopping</button>}
            </div>
          </div>
          {this.proceedToCheckoutNotification()}
        </div>
      </div>
    );
  }

  renderMobile () {
    return (
      <Modal className="overlay-container overlay-add-to-bag-confirmation-content" overlayClassName="react-overlay overlay-add-to-bag-confirmation-container" contentLabel="Add to Bag modal" isOpen>
        {this.notificationContent()}
      </Modal>
    );
  }

  renderDesktop () {
    return (
      <Modal className="overlay-container-desktop overlay-add-to-bag-confirmation-desktop" overlayClassName="react-overlay overlay-add-to-bag-container-desktop" contentLabel="Add to Bag modal" isOpen>
        {this.notificationContent()}
      </Modal>
    );
  }

  render () {
    let {isMobile, isVisible} = this.props;
    if (!isVisible) {
      return this.proceedToCheckoutNotification();
    }

    return (
      isMobile ? this.renderMobile() : this.renderDesktop()
    );
  }
}
