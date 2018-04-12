/** @module MyAccountRewards
 * @summary Section container of rewards status and earned.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {MyAccountRewardsStatus} from 'views/components/myAccount/header/rewards/MyAccountRewardsStatus.jsx';
// import {MyAccountRewardsEarned} from 'views/components/myAccount/header/rewards/MyAccountRewardsEarned.jsx';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.my-account-rewards.scss');
} else {
  require('./_m.my-account-rewards.scss');
}

class MyAccountRewards extends React.Component {
  static propTypes = {
    /* Flag to indicates if is Mobile or Desktop version */
    isMobile: PropTypes.bool.isRequired,

    currentPoints: PropTypes.number.isRequired,
    pendingRewards: PropTypes.number.isRequired
  }

  render () {
    let {currentPoints, pendingRewards, isMobile} = this.props;

    return (
      <div className="my-account-rewards-section">
        <section className="reward-earned-container account-header-reward-espot">
          <figure className="image-container">
            <ContentSlot contentSlotName="account_header_rewards_banner" />
          </figure>
        </section>

        <MyAccountRewardsStatus isMobile={isMobile} currentPoints={currentPoints} pendingRewards={pendingRewards} />
      </div>
    );
  }
}

export {MyAccountRewards};
