/**
 * @module DesktopAccountHeaderLinks
 * Renders account related header link components for Desktop. Each of these
 * components decide whether, or how, to render themselves, depending on the
 * user being registered or anonymous.
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
import {DRAWER_IDS} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';

if (DESKTOP) { // eslint-disable-line no-undef
  require('./_d.account-header-links.scss');
  require('./_d.login.scss');
}

export class DesktopAccountHeaderLinks extends React.Component {

  static propTypes = {
    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool.isRequired,

    /** Flags indicates whether the user is a remembered guest */
    isRemembered: PropTypes.bool.isRequired,

    /** flags if rewards link is enabled or not **/
    isRewardsEnabled: PropTypes.bool.isRequired,

    /** a callback for opening a selected drawer given its id (as per DRAWER_IDS) */
    openSelectedDrawer: PropTypes.func.isRequired,

    /* Id referred to the currently open drawer */
    activeDrawer: PropTypes.string
  }

  constructor (props) {
    super(props);
    this.handleLinkClick = this.handleLinkClick.bind(this);
  }

  handleLinkClick (event, linkId) {
    this.props.openSelectedDrawer(linkId);
  }

  render () {
    let {activeDrawer, isRewardsEnabled, isGuest, isRemembered} = this.props;

    return (
      <div className="welcome">
        {isGuest && !isRemembered
          ? <div className="account-and-login">
            <CreateAccountLink id={DRAWER_IDS.CREATE_ACCOUNT} onClick={this.handleLinkClick} isActive={DRAWER_IDS.CREATE_ACCOUNT === activeDrawer} />
            <LoginLink id={DRAWER_IDS.LOGIN} onClick={this.handleLinkClick} isActive={DRAWER_IDS.LOGIN === activeDrawer} />
          </div>
          : <HelloLinkContainer id={isGuest && isRemembered ? DRAWER_IDS.LOGIN : DRAWER_IDS.MY_ACCOUNT}
            isActive={(isGuest && isRemembered) ? (DRAWER_IDS.LOGIN === activeDrawer) : (DRAWER_IDS.MY_ACCOUNT === activeDrawer)}
            onClick={this.handleLinkClick} />
        }
        {isRewardsEnabled && <MyPlaceRewardsLinkContainer />}
        {isGuest
          ? <WishListLink id={DRAWER_IDS.WISHLIST_LOGIN} isGuest onClick={this.handleLinkClick} isActive={DRAWER_IDS.WISHLIST_LOGIN === activeDrawer} />
          : <WishlistRedirectLink />
        }
        <MiniCartLinkContainer onClick={this.handleLinkClick} isActive={DRAWER_IDS.MINI_CART === activeDrawer} />
      </div>
    );
  }
}
