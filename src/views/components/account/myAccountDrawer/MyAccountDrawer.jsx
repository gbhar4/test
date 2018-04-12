/** @module MyAccountDrawer
 * Shows preview details of My Account from the header.
 *
 * @author Oliver Ramirez
 * @author Miguel Alvarez Igarzábal
 * @author Ben
*/
import React from 'react';
import {PropTypes} from 'prop-types';
import {RewardsStatusContainer} from 'views/components/account/rewardsStatus/RewardsStatusContainer.js';
import {CouponsSummaryContainer} from './CouponsSummaryContainer.js';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';
import {LogoutLinkContainer} from 'views/components/login/LogoutLinkContainer.js';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {PAGES} from 'routing/routes/pages';
import {LastShipToHomeOrderStatusContainer} from 'views/components/account/myAccountDrawer/LastShipToHomeOrderStatusContainer.js';
import {BopisLastOrderStatusContainer} from 'views/components/account/myAccountDrawer/BopisLastOrderStatusContainer.js';
import {Switch} from 'views/components/common/routing/Switch.jsx';
import {Route} from 'views/components/common/routing/Route.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.my-account-drawer.scss');
} else {
  require('./_m.my-account-drawer.scss');
}

export class MyAccountDrawer extends React.Component {

  static propTypes = {
    /* user's first name, only for mobile drawer */
    firstName: PropTypes.string,
    /** callback for calling after a successfull logout */
    onSuccessfulLogout: PropTypes.func,
    /** whether or not rewards are enabled */
    isRewardsEnabled: PropTypes.bool.isRequired,
    /** callback for closing the drawer */
    onCloseClick: PropTypes.func.isRequired,
    /** flag to know if is mobile version */
    isMobile: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.renderViewAccountButtonInAccountPage = this.renderViewAccountButtonInAccountPage.bind(this);
  }

  handleCloseClick () {
    this.props.onCloseClick();
  }

  renderViewAccountButtonInAccountPage () {
    return <button className="view" onClick={this.handleCloseClick}>View My Account</button>;
  }

  render () {
    let {isMobile, firstName, isRewardsEnabled, onSuccessfulLogout, isCanada} = this.props;

    return (
      <div className="my-account-content-overlay">
        {isMobile && <h1 className="hello-message">Hi, {firstName}!</h1>}
        <div className="my-account-options">
          <Switch>
            <Route path={PAGES.myAccount.pathPattern} render={this.renderViewAccountButtonInAccountPage} />
            <Route component={HyperLink} componentProps={{destination: PAGES.myAccount, className: 'view', children: 'View My Account'}} />
          </Switch>
          <LogoutLinkContainer onSuccessfulLogout={onSuccessfulLogout} />
        </div>
        <div className="order-status-notification-container">
          <LastShipToHomeOrderStatusContainer isDrawer />
          {!isCanada && <BopisLastOrderStatusContainer isDrawer />}
        </div>
        {isRewardsEnabled && <RewardsStatusContainer />}
        <CouponsSummaryContainer shrinkedSize={3} />
        {isRewardsEnabled && <ContentSlot contentSlotName="minicart_myaccount_overview_banner" className="menu-my-account-banner" />}
      </div>
    );
  }

}
