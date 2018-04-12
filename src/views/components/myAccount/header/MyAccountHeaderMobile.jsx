/** @module MyAccountHeaderMobile
 * @summary Header of My Account for Mobile, container of rewards status.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {MyAccountRewardsStatus} from 'views/components/myAccount/header/rewards/MyAccountRewardsStatus.jsx';
import {MyAccountHelloMessageContainer} from 'views/components/myAccount/header/welcome/MyAccountHelloMessageContainer.js';
import cssClassName from 'util/viewUtil/cssClassName';

class MyAccountHeaderMobile extends React.Component {
  static propTypes = {
    /* Flag to indicates if is Mobile or Desktop version */
    isMobile: PropTypes.bool.isRequired,

    /* Number of points of user */
    currentPoints: PropTypes.number.isRequired,

    /* Number of pending rewards of user */
    pendingRewards: PropTypes.number.isRequired,

    /** If the country does not allow rewards. */
    isRewardsEnabled: PropTypes.bool.isRequired
  }

  render () {
    let {isRewardsEnabled, currentPoints, pendingRewards, pointsToNextReward, isMobile} = this.props;
    let headerContainerClass = cssClassName('my-account-header-mobile');

    return (
      <div className={headerContainerClass}>
        {isRewardsEnabled
          ? <MyAccountRewardsStatus currentPoints={currentPoints} pendingRewards={pendingRewards} isMobile={isMobile} pointsToNextReward={pointsToNextReward} />
          : <MyAccountHelloMessageContainer />
        }
      </div>
    );
  }
}

export {MyAccountHeaderMobile};
