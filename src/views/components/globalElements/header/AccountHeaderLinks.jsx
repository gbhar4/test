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
import {MiniCartLinkContainer} from './MiniCartLinkContainer.js';
import {MyPlaceRewardsLinkContainer} from './MyPlaceRewardsLinkContainer.js';
import {WishListLink} from './WishListLink.jsx';
import {WishlistRedirectLink} from './WishlistRedirectLink.jsx';
import {HomeButton} from './HomeButton.jsx';
import {FindStoreLink} from './FindStoreLink.jsx';
import {DRAWER_IDS} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';
import {PAGES} from 'routing/routes/pages';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.account-header-links.scss');
  require('./_d.login.scss');
} else {
  require('./_m.account-menu-links.scss');
}

export class AccountHeaderLinks extends React.Component {

  static propTypes = {
    /** Flags if rendering for mobile devices */
    isMobile: PropTypes.bool.isRequired,

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
    if (this.props.isMobile) {
      return this.renderMobile();
    } else {
      return this.renderDesktop();
    }
  }

  // --------------- private methods --------------- //

  renderLoginOrHelloLinks (isGuest, isRemembered, isMobile) {
    if (isGuest && !isRemembered) {
      return (
        <div className="account-and-login">
          <CreateAccountLink id={DRAWER_IDS.CREATE_ACCOUNT} onClick={this.handleLinkClick} />
          <span>/</span>
          <LoginLink id={DRAWER_IDS.LOGIN} onClick={this.handleLinkClick} />
        </div>
      );
    } else {
      return (
        <div>
          <HelloLinkContainer id={isRemembered ? DRAWER_IDS.LOGIN : DRAWER_IDS.MY_ACCOUNT} onClick={this.handleLinkClick} />
          {isMobile && <HyperLink destination={PAGES.myAccount} className="view-account">My Account</HyperLink>}
        </div>);
    }
  }

  renderWishlistLink (isGuest) {
    return isGuest
      ? <WishListLink id={DRAWER_IDS.WISHLIST_LOGIN} isGuest onClick={this.handleLinkClick} />
      : <WishlistRedirectLink />;
  }

  renderMobile () {
    let {isGuest, isRewardsEnabled, isRemembered} = this.props;
    return (
      <div className="welcome-menu">
        <HomeButton menuActive />
        {this.renderLoginOrHelloLinks(isGuest, isRemembered, true)}
        {isGuest && !isRemembered && isRewardsEnabled && <MyPlaceRewardsLinkContainer isMobile />}
        <ContentSlot contentSlotName="global_header_banner_below_rewards" />
        {this.renderWishlistLink(isGuest)}
        <ContentSlot contentSlotName="global_header_banner_below_favorites" />
        <FindStoreLink />
        <ContentSlot contentSlotName="global_header_banner_below_find_in_store" />
      </div>
    );
  }

  renderDesktop () {
    let {isGuest, isRewardsEnabled, isRemembered} = this.props;
    return (
      <div className="welcome">
        {this.renderLoginOrHelloLinks(isGuest, isRemembered)}
        {isGuest && !isRemembered && isRewardsEnabled && <MyPlaceRewardsLinkContainer />}
        {this.renderWishlistLink(isGuest)}
        <MiniCartLinkContainer onClick={this.handleLinkClick} />
      </div>
    );
  }
  // --------------- end of private methods --------------- //
}
