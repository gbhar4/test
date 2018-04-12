/** @module MyAccountRewardsEarned
 * @summary Component with any reward earned and its date of accreditation.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';

class MyAccountRewardsEarned extends React.Component {
  static propTypes = {
    rewardEarned: PropTypes.shape({
      /* Flag for the id of reward */
      rewardId: PropTypes.number.isRequired,

      /* Flag for the value of reward */
      rewardValue: PropTypes.number.isRequired,

      /* Flag for the accreditation's date of reward */
      rewardAccreditationDate: PropTypes.string.isRequired
    })
  }

  render () {
    let {rewardId, rewardValue, rewardAccreditationDate} = this.props;

    return (
      <section key={rewardId} className="reward-earned-container">
        <strong className="reward-earned-title">Congratulation! You've earned a ${rewardValue} reward!</strong>
        <p className="reward-accreditation-message">Reward will be credited to your account on {rewardAccreditationDate}</p>
        <a className="button-view-all-rewards" aria-label="View all rewards">View all rewards</a>
      </section>
    );
  }
}

export {MyAccountRewardsEarned};
