/** @module CreditCardExisting
 * @summary If the account has plcc card this content will appear
 *
 * @author Oliver Ramirez
 */

import React from 'react';
import {PropTypes} from 'prop-types';

import {CardWithSmile} from 'views/components/plcc/CardWithSmile.jsx';
import {Notification} from 'views/components/common/Notification.jsx';

import {PAGES} from 'routing/routes/pages';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {isClient} from 'routing/routingHelper';
import cssClassName from 'util/viewUtil/cssClassName';

if (DESKTOP) { // eslint-disable-line
  require('./_d.card-existing.scss');
} else {
  require('./_m.card-existing.scss');
}

export class CreditCardExisting extends React.Component {
  static propTypes = {
    /** Flag to know if content should be into a modal */
    isModal: PropTypes.bool.isRequired,

    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool.isRequired,

    isShowCheckoutButton: PropTypes.bool.isRequired,

    isShowContinueShoppingLink: PropTypes.bool.isRequired,

    /** may come the number of plcc card */
    cardNumber: PropTypes.string,

    /** Flag indicates whether guest user is remembered */
    isRemembered: PropTypes.bool.isRequired,

    /* callback to save the existing card to the user's account */
    onSavePlccToAccount: PropTypes.func.isRequired,

    /** Flag indicates whether a plcc card is already linked to the account */
    cardAlreadySaved: PropTypes.bool.isRequired
  }

  constructor (props, context) {
    super(props, context);

    this.state = {
      addedToAccount: props.addedToAccount
    };

    this.handleCloseNotification = this.handleCloseNotification.bind(this);
    this.handleSaveToAccountClick = this.handleSaveToAccountClick.bind(this);
  }

  componentWillMount () {
    // REVIEW / FIXME: I know we have a routing component for this,
    // but this page does not require a new route
    if (isClient() && !this.props.isModal) {
      window.scrollTo(0, 0);
    }
  }

  // REVIEW: move flag to uiFlag in the store?
  handleSaveToAccountClick () {
    this.props.onSavePlccToAccount().then(() => {
      this.setState({
        addedToAccount: true,
        error: false
      });

      setTimeout(() => this.setState({ addedToAccount: false }), 3000);
    }).catch((err) => {
      if (err) {
        this.setState({
          addedToAccount: false,
          error: err.errors._error
        });
      }
    });
  }

  handleCloseNotification () {
    this.setState({
      addedToAccount: false,
      error: false
    });
  }

  render () {
    let {isGuest, isShowCheckoutButton, isShowContinueShoppingLink, isModal, cardNumber, isRemembered, cardAlreadySaved, isShowViewAccountLink} = this.props;
    let {addedToAccount, error} = this.state;
    let containerClassName = cssClassName(
      'card-existing-container ',
      {'modal-plcc ': isModal}
    );

    let continueShoppingLinkClassName = cssClassName(
      'button-primary ',
      'button-continue-shopping ',
      {'button-with-bag ': isShowCheckoutButton}
    );

    return (<div className={containerClassName}>
      {addedToAccount && <Notification className="notification-added-card">
        <span>My Place Rewards Credit Card ending in {cardNumber.substr(-4)} has been added to your account.
          {isShowViewAccountLink && <HyperLink destination={PAGES.myAccount} forceRefresh className="view-account">View Account</HyperLink>}
          <button className="button-close" onClick={this.handleCloseNotification}></button>
        </span>
      </Notification>}

      <div className="card-existing-content">
        {error && <ErrorMessage error={error} />}

        <CardWithSmile />
        <h3 className="first-text">Looks like you already have an account!</h3>

        {((isGuest && !isRemembered) || (!isGuest && cardAlreadySaved)) ? <p className="text-card-existing">
          <strong>Our records indicate you already have a MY PLACE REWARDS CREDIT CARD.</strong><br />
          If you have lost your card, please call our care center at 1-866-254-9967 or (TDD/TTY 1-888-819-1918) to replace it.<br /><br />
          We've gone ahead and prefilled the payment section of your order with your information.
        </p>
        : <p className="text-card-existing">
          <strong>Our records indicate you already have a MY PLACE REWARDS CREDIT CARD.</strong><br />
          If you have lost your card, please call our care center at 1-866-254-9967 or (TDD/TTY 1-888-819-1918) to replace it.
          We've gone ahead and prefilled the payment section of your order with your information.

          <br /><br /> For future purchases, <button className="button-add-credit-card" onClick={this.handleSaveToAccountClick}>click here</button> to add your <br /> MY PLACE REWARDS CREDIT CARD to your account.
        </p>}

        {isShowCheckoutButton && (!isModal
          ? <HyperLink destination={PAGES.cart} className="button-primary button-checkout" forceRefresh>Continue to Checkout</HyperLink>
          : <button onClick={this.props.onCheckoutClick} className="button-primary button-checkout">Continue to Checkout</button>
        )}

        {isShowContinueShoppingLink && <HyperLink destination={PAGES.homePage} className={continueShoppingLinkClassName} forceRefresh>Continue Shopping</HyperLink>}
      </div>
    </div>);
  }
}
