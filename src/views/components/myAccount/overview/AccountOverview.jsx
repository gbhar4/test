/**
 * @module AccountOverview
 * Shows the different views for the user to manage it's AccountOverview in My Account.
 *
 * @author Damian <drossi@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';
import {RewardsOverviewContainer} from './RewardsOverviewContainer';
import {DefaultsOverviewContainer} from './DefaultsOverviewContainer';
import {MyAccountNavigationContainer} from 'views/components/myAccount/menu/MyAccountNavigationContainer.js';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';
import {Route} from 'views/components/common/routing/Route.jsx';
import {LastShipToHomeOrderStatusContainer} from 'views/components/account/myAccountDrawer/LastShipToHomeOrderStatusContainer.js';
import {BopisLastOrderStatusContainer} from 'views/components/account/myAccountDrawer/BopisLastOrderStatusContainer.js';

if (DESKTOP) { // eslint-disable-line
  require('./_d.account-overview-section.scss');
} else {
  require('./_m.account-overview-section.scss');
}

class AccountOverview extends React.Component {
  static propTypes = {
    /** flags if we're rendering for mobile */
    isMobile: PropTypes.bool.isRequired
  }

  render () {
    let {isMobile, className, isCanada} = this.props;
    let rewardsContainerClass = cssClassName('my-account-overview-section ', className);
    return (
      <section className={rewardsContainerClass}>
        <div className="order-status-notification-container">
          <LastShipToHomeOrderStatusContainer />
          {!isCanada && <BopisLastOrderStatusContainer />}
        </div>

        <RewardsOverviewContainer />
        {!isMobile && [
          <DefaultsOverviewContainer key="default-overview" />,
          <ContentSlot key="account-overview-bottom" name="My account - Rewards" contentSlotName="account_overview_bottom_banner" className="my-place-rewards-banner" />
        ]}

        {isMobile && <Route component={MyAccountNavigationContainer} />}
      </section>
    );
  }
}

export {AccountOverview};
