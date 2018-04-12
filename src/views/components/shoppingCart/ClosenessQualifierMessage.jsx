/**
 * @module ClosenessQualifierMessage
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * Shows a message to the user to let know that the current cart status is close
 * to earning, or will earn, a reward.
 *
 * "id":"displayName" *
 * Style (ClassName) Elements description/enumeration
 *  .closeness-quialifier-notification
 *
 * Uses
 *  <Notification />
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {Notification} from 'views/components/common/Notification.jsx';

export class ClosenessQualifierMessage extends React.Component {
  static propTypes = {
    /**
     * Total amount of the order, equivalent to the points that could be earned
     * if the user was registered.
     */
    orderTotal: PropTypes.number.isRequired,

    /** Number of points the user needs to accumulate to get the next reward. */
    pointsToNextReward: PropTypes.number.isRequired,

    /**
     * Rewards that will (registered user) or would (guest user) be earned with
     * the current orderTotal.
     */
    nextRewardAmount: PropTypes.number.isRequired,

    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool.isRequired
  }

  render () {
    let {orderTotal, pointsToNextReward, nextRewardAmount, isGuest} =
      this.props;
    let message;

    if (orderTotal >= pointsToNextReward) {
      if (isGuest) {
        message = `You could earn a $${nextRewardAmount} reward after this purchase!`;
      } else {
        message = `You'll earn a $${nextRewardAmount} reward after this purchase!`;
      }
    } else {
      let pointsToNextRewardAfterOrder = pointsToNextReward - orderTotal;
      message = `Your order is only $${pointsToNextRewardAfterOrder} away from earning a $${nextRewardAmount} reward!`;
    }

    return (
      <Notification className="closeness-quialifier-notification">
        <p className="notification-inline">
          {message} {isGuest && <a className="closeness-link-create-account" href="#">Create Account</a>}
        </p>
      </Notification>
    );
  }
}
