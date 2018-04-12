/** @module MyAccountHeader
 * @summary Header of My Account, container of welcome message, rewards status and rewards earned.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {MyAccountHelloMessageContainer} from 'views/components/myAccount/header/welcome/MyAccountHelloMessageContainer.js';
import {MyAccountRewards} from 'views/components/myAccount/header/rewards/MyAccountRewards.jsx';
import cssClassName from 'util/viewUtil/cssClassName';

class MyAccountHeader extends React.Component {
  static propTypes = {
    /* Flag to indicates if is Mobile or Desktop version */
    isMobile: PropTypes.bool.isRequired,

    /* Number of points of user */
    currentPoints: PropTypes.number.isRequired,

    /* Number of pending rewards of user */
    pendingRewards: PropTypes.number.isRequired,
  }

  render () {
    let {currentPoints, pendingRewards, isMobile} = this.props;
    let headerContainerClass = cssClassName('my-account-header ', {'viewport-container': !isMobile});

    return (
      <div className={headerContainerClass}>
        <MyAccountHelloMessageContainer />
        <MyAccountRewards isMobile={isMobile} currentPoints={currentPoints} pendingRewards={pendingRewards} />
      </div>
    );
  }
}

export {MyAccountHeader};
