/**
 * @module AccountHeaderLinks
 * Renders account related header link components for Desktop and mobile.
 *
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {CreateAccountLink} from './CreateAccountLink.jsx';
import {LoginLink} from './LoginLink.jsx';
import {HelloLinkContainer} from './HelloLinkContainer.js';
import {MyPlaceRewardsLinkContainer} from './MyPlaceRewardsLinkContainer.js';
import {WishListLink} from './WishListLink.jsx';
import {WishlistRedirectLink} from './WishlistRedirectLink.jsx';
import {HomeButton} from './HomeButton.jsx';
import {FindStoreLink} from './FindStoreLink.jsx';
import {DRAWER_IDS} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';
import {PAGES} from 'routing/routes/pages';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';
import {LogoutLinkContainer} from '../../login/LogoutLinkContainer';
import {TrackOrderContainer} from '../../trackorder/TrackOrderContainer';
export class MobileHeaderFooterNavLinks extends React.Component {

  static propTypes = {

    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool.isRequired,

    /** Flags indicates whether the user is a remembered guest */
    isRemembered: PropTypes.bool.isRequired,

    /** whether or not rewards are enabled */
    isRewardsEnabled: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props);
    this.handleLinkClick = this.handleLinkClick.bind(this);
  }

  handleLinkClick (event, linkId) {
    this.props.openSelectedDrawer(linkId);
  }

  render () {
    let { isGuest, isRemembered, isFooterLinks, isRewardsEnabled } = this.props;

    return !isFooterLinks
      ? <HeaderNavLinks {...{ isGuest, isRemembered, handleLinkClick: this.handleLinkClick }} />
      : <FooterNavLinks {...{ isGuest, isRemembered, isRewardsEnabled, handleLinkClick: this.handleLinkClick }}/>;
  }

}

function HeaderNavLinks (props) {
  let { isGuest, isRemembered, handleLinkClick } = props;

  return (
    <div>
      <HomeLogInOrOutLinks {...{ isGuest, isRemembered, handleLinkClick }} />
      {!isGuest && <HelloLinkContainer id={isRemembered ? DRAWER_IDS.LOGIN : DRAWER_IDS.MY_ACCOUNT} onClick={handleLinkClick} />}
    </div>
  );
}

function FooterNavLinks (props) {
  let { isGuest, isRewardsEnabled, handleLinkClick } = props;

  return (
    <div className="global-mobile-nav-bottom-action-container">
      {isRewardsEnabled && <MyPlaceRewardsLinkContainer isMobile />}
      <div className="content-slot-container">
        <ContentSlot contentSlotName="global_header_banner_below_rewards" />
      </div>
      {isGuest
        ? <WishListLink id={DRAWER_IDS.WISHLIST_LOGIN} isGuest onClick={handleLinkClick} />
        : <WishlistRedirectLink />}
      <FindStoreLink />
      <div className="content-slot-container">
        <ContentSlot contentSlotName="global_header_banner_below_find_in_store" />
      </div>
      <div className="track-order-container">
        <TrackOrderContainer title={'Track Order'} isMobile />
      </div>
    </div>
  );
}

function HomeLogInOrOutLinks (props) {
  let { isRemembered, isGuest, handleLinkClick } = props;
  let action1;
  let action2;

  if (isGuest && !isRemembered) {
    action1 = <LoginLink id={DRAWER_IDS.LOGIN} onClick={handleLinkClick} />;
    action2 = <CreateAccountLink id={DRAWER_IDS.CREATE_ACCOUNT} onClick={handleLinkClick} />;
  } else {
    action1 = <div className="view-account"><HyperLink destination={PAGES.myAccount}>My Account</HyperLink></div>;
    action2 = <LogoutLinkContainer isShowNamePrefix={isRemembered} />;
  }

  return (
    <div className="global-mobile-nav-top-action-container">
      <div className="global-mobile-nav-top-action">
        <HomeButton menuActive />
      </div>
      <div className="global-mobile-nav-top-action">
        {action1}
      </div>
      <div className="global-mobile-nav-top-action">
        {action2}
      </div>
    </div>
  );

}
