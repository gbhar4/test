/**
* @module RewardsSummaryDisplay
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* Airmiles details for order confirmation page
*/

import React from 'react';
import {PropTypes} from 'prop-types';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';
import {RewardsStatusCheckout} from 'views/components/account/rewardsStatus/RewardsStatusCheckout.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.rewards-summary-display.scss');
} else {
  require('./_m.rewards-summary-display.scss');
}

class RewardsSummaryDisplay extends React.Component {
  static propTypes = {
    estimatedRewards: PropTypes.number,
    pointsToNextReward: PropTypes.number,

    banner: PropTypes.shape({
      contentSlotName: PropTypes.string.isRequired
    })
  }

  render () {
    let {banner, estimatedRewards, pointsToNextReward} = this.props;

    return (<section className="points-container">
      {banner && <ContentSlot {...banner} className="confirmation-rewards-banner" />}

      <div className="points-earned">
        <span>Points Pending</span>
        <strong>{estimatedRewards}</strong>
      </div>

      <RewardsStatusCheckout estimatedRewards={estimatedRewards} pointsToNextReward={pointsToNextReward} />
      <p className="points-message">* excludes points pending for this order</p>
    </section>);
  }
}

export {RewardsSummaryDisplay};
