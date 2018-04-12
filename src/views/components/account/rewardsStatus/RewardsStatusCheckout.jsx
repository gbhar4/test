/**
 * @module RewardsStatus
 * @author Oliver Ramirez
 * Shows a points earned with the purchase
 *
 * Style (className) Elements description/enumeration:
 *  .rewards-bar
 */
import React from 'react';
import {PropTypes} from 'prop-types';

export class RewardsStatusCheckout extends React.Component {
  static propTypes = {
    /** ADD COMMENT */
    pointsToNextReward: PropTypes.number.isRequired
  }

  render () {
    let {pointsToNextReward} = this.props;
    return (
      <div className="rewards-bar">
        <p className="points-text">Points to your next $5 reward: {pointsToNextReward}</p>
        <div className="progress-container">
          <div className="progressbar-rewards" style={{width: `${100 - pointsToNextReward}%`}}></div>
        </div>
        <div className="container-number-progressbar">
          <i className="number-progressbar">0</i>
          <i className="number-progressbar">25</i>
          <i className="number-progressbar">50</i>
          <i className="number-progressbar">75</i>
          <i className="number-progressbar">100</i>
        </div>
      </div>
    );
  }
}
