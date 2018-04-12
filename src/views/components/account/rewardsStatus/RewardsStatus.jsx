/**
 * @module RewardsStatus
 * @author Oliver Ramirez
 * @author Miguel Alvarez Igarzábal
 * Shows a resumed status of MPR points and rewards of the user.
 *
 * Style (className) Elements description/enumeration:
 *  .rewards-status
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 */
import React from 'react';
import {PropTypes} from 'prop-types';

if (DESKTOP) { // eslint-disable-line
  require('./_d.rewards-status.scss');
} else {
  require('./_m.rewards-status.scss');
}

export class RewardsStatus extends React.Component {
  static propTypes = {
    userRewardsPoints: PropTypes.number.isRequired,
    pointsToNextReward: PropTypes.number.isRequired,
    currentMonthRewards: PropTypes.number.isRequired,

    /* Flag that indicates if the section of My Account is drawer or not */
    isCondense: PropTypes.bool
  }

  render () {
    let { isCondense, isMobile, pointsToNextReward, currentMonthRewards, userRewardsPoints } = this.props;

    let currentPoints = 100 - pointsToNextReward; // is it still usefull?

    return (
      <div className="rewards-status">
        {!isMobile && <p className="title">POINTS TO YOUR NEXT $5 REWARD: <strong>{pointsToNextReward}</strong></p>}
        <div className="rewards-bar">
          <div className="progress-container">
            <div className="progressbar-rewards" style={{width: `${currentPoints}%`}}></div>
          </div>
          <div className="container-number-progressbar">
            <i className="number-progressbar">0</i>
            <i className="number-progressbar">25</i>
            <i className="number-progressbar">50</i>
            <i className="number-progressbar">75</i>
            <i className="number-progressbar">100</i>
          </div>
        </div>
        {isMobile && <p className="title">POINTS TO YOUR NEXT $5 REWARD: <strong>{pointsToNextReward}</strong></p>}

        {!isCondense && <div className="rewards-points">
          <p>CURRENT POINTS: <span>{userRewardsPoints}</span></p>
          <p>MY REWARDS: <span>${currentMonthRewards}</span></p>
        </div>}
      </div>

    );
  }
}
