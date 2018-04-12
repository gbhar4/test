/** @module My place rewards credit card existing
 * @summary message of PLCC are existing
 *
 * @author Oliver Ramirez
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {CardWithSmile} from 'views/components/plcc/CardWithSmile.jsx';
import {PAGES} from 'routing/routes/pages';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {isClient} from 'routing/routingHelper';
import cssClassName from 'util/viewUtil/cssClassName';

if (DESKTOP) { // eslint-disable-line
  require('./_d.under-review-plcc.scss');
} else {
  require('./_m.under-review-plcc.scss');
}

export class UnderReviewPLCC extends React.Component {
  static propTypes = {
    isShowCheckoutButton: PropTypes.bool,
    isShowContinueShoppingLink: PropTypes.bool,
    isInstantCredit: PropTypes.bool
  }

  componentWillMount () {
    // REVIEW / FIXME: I know we have a routing component for this,
    // but this page does not require a new route
    if (isClient() && !this.props.isModal) {
      window.scrollTo(0, 0);
    }
  }

  render () {
    let {isModal, isMobile, isShowCheckoutButton, isShowContinueShoppingLink, isInstantCredit} = this.props;
    let continueShoppingButtonClass = cssClassName('button-primary ', 'button-continue-shopping ', {'button-with-bag ': isShowCheckoutButton});
    return (
      <div className="under-review-container">
        <CardWithSmile />
        <h3 className="title-under-review">Your information is under review and is being processed.</h3>
        {isInstantCredit
          ? <p className="message-under-review">
            Your <strong>MY PLACE REWARDS CREDIT CARD</strong> application needs further review.
            You will be notified by mail within 10 business days with your account's status.
          </p>
          : isMobile
            ? <p className="message-under-review">Your information is currently being processed. You will be notified by mail within 10 days with your account’s status.</p>
            : <p className="message-under-review">You will be notified by mail <br /> within 10 days with your account's status.</p>}

        {isShowCheckoutButton && (!isModal
          ? <HyperLink destination={PAGES.cart} forceRefresh className="button-primary button-checkout">Continue to checkout</HyperLink>
          : <button onClick={this.props.onCheckoutClick} className="button-primary button-checkout">Continue to checkout</button>
        )}

        {isShowContinueShoppingLink && <HyperLink destination={PAGES.homePage} forceRefresh
          className={continueShoppingButtonClass}>Continue Shopping</HyperLink>}
      </div>
    );
  }
}
