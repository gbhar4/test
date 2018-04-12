/** @module NextMonthRewards
 * @summary Rewards availables to next months (pending state) from My Account Section / My Rewards.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 * @author Miguel <malvarez@minutentag>
 */

import React from 'react';
import {PropTypes} from 'prop-types';

if (DESKTOP) { // eslint-disable-line
  require('./menu/rewards/_d.rewards-overview-section.scss');
} else {
  require('./menu/rewards/_m.rewards-overview-section.scss');
}

class NextMonthRewards extends React.Component {
  static propTypes = {
    /** Number of points the user needs to accumulate to get the next reward. */
    pointsToNextReward: PropTypes.number.isRequired,
    /**
     * Rewards that will be earned when the pointsToNextReward are accumulated
     * by the user.
     */
    nextRewardAmount: PropTypes.number.isRequired
  }

  render () {
    let {pointsToNextReward, nextRewardAmount} = this.props;

    return (
      <div className="month-rewards-container next-month-rewards">
        <h2 className="month-rewards-title">Next month’s Rewards</h2>
        <p className="month-rewards-message">
          You are only
          <strong className="rewards-points"> {pointsToNextReward} points </strong>
          to the next ${nextRewardAmount} reward, continue shopping to earn reward coupons!
        </p>

        <div className="uncondense-coupon uncondense-coupon-ineligible">
          <div className="uncondense-coupon-content">
            <figure className="uncondense-image-coupon">
              <img src="/wcsstore/static/images/rewards-icon.png" alt="money" />
            </figure>

            <div className="uncondense-information-coupon">
              <span className="uncondense-expire-information">Will be available 4/29/17</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export {NextMonthRewards};
