/**
 * @module RegisteredRewardsPromo
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * Shows a promotional area for rewards programs to registered users.
 *
 * Note:
 * .registered-rewards-promo-container -> Registered user with NO PLCC Card
 * .registered-mpr-credit-card -> Registered user WITH PLCC Card saved on My Account
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';

require('./_d.registered-rewards-promo.scss');

export class RegisteredRewardsPromo extends React.Component {

  static propTypes = {
    // /** Flags if to use condensed version for mini-bag use. */
    // isCondense: PropTypes.bool.isRequired,

    /**
     * Total points calculated as per the current order total, equivalent to the points that could be earned
     * if the user was registered.
     */
    pointsInYourBag: PropTypes.number.isRequired,

    // /** Number of points the user needs to accumulate to get the next reward. */
    // pointsToNextReward: PropTypes.number.isRequired,

    /** Whether the user already has a PLCC (My Place Rewards Credit Card). */
    userHasPlcc: PropTypes.bool.isRequired
  }

  constructor (props, context) {
    super(props, context);

    this.handleClick = () => window.modalsProvider.showModal('wicPromo');
  }

  render () {
    let {pointsInYourBag, userHasPlcc} = this.props;

    return (
      <div className={cssClassName(
            {'registered-rewards-promo-container ': !userHasPlcc},
            {'registered-mpr-credit-card ': userHasPlcc},
            'summary-message ', 'summary-message-rewards')}>

        <div className="registered-rewards-promo">
          {!userHasPlcc
            ? [
              <p key="0" className="summary-message-title">You'll earn <strong>{pointsInYourBag}</strong> points on this purchase!</p>,
              <img key="1" className="figure-stars-espot" src="/wcsstore/static/images/spot-stars-drawer-guest.png" alt="" />,
              <h3 key="2" className="get-double-points-title">
                Earn double points
                <span className="get-double-points-subtitle">with the My Place Rewards Credit Card</span>
              </h3>,
              <button type="button" key="3" onClick={this.handleClick} className="button-apply-now" aria-label="Apply now for the My Place Rewards Credit Card">Apply Now</button>, /* REVIEW: abuse of modalsProvider? */
              <button type="button" key="4" onClick={this.handleClick} className="button-learn-more" aria-label="Learn more about the My Place Rewards Credit Card">Learn More</button>]

            : [
              <p key="0" className="summary-message-title">You'll earn <strong>{pointsInYourBag}</strong> points on this purchase with your<br />My Place Rewards Credit Card</p>,
              <img key="1" className="figure-stars-espot" src="/wcsstore/static/images/spot-stars-drawer-guest.png" />,
              <aside key="2" className="message-earn-double-points">100 points = $5 My Place Reward</aside>]
          }
        </div>
      </div>
    );
  }

}
