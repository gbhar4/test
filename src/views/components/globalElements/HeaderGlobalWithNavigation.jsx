/**
 * @module HeaderGlobalWithNavigation
 * @author Agu
 * Global header for desktop, including global navigation
 */

import React from 'react';
import {GlobalNavigationBarContainer} from './header/GlobalNavigationBarContainer.js';
import {InputWithTypeAheadContainer} from './header/InputWithTypeAheadContainer.js';
import {HomeButton} from './header/HomeButton.jsx';
import {HeaderGlobalTopBarContainer} from './HeaderGlobalTopBarContainer.js';
import {HeaderGlobalBannerDesktop} from './header/HeaderGlobalBannerDesktop.jsx';
import {FIXED_HEADER_DATA_ATTRIBUTE} from 'util/viewUtil/scrollingAndFocusing';
import {AddedToBagNotificationContainer} from './header/AddedToBagNotificationContainer.js';
import cssClassName from 'util/viewUtil/cssClassName';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.header-global.scss');
  require('./_d.overlay.scss');

  // #if LEGACY
  require('./_d.legacy-header-global.scss');
  // #endif
}

export class HeaderGlobalWithNavigation extends React.Component {
  render () {
    let {stickyClassName} = this.props;

    let contentClassName = cssClassName(
      'content-global-navigation ', stickyClassName
    );

    return (
      <header className="header-global" {...FIXED_HEADER_DATA_ATTRIBUTE} >
        <HeaderGlobalBannerDesktop />

        {stickyClassName && <div className="header-ghost-element"></div>}

        <div ref={this.props.onStoreStickyRef} className={contentClassName}>
          <HeaderGlobalTopBarContainer />

          <div className="container-global-navigation viewport-container">
            <HomeButton />
            <div className="navigation-container">
              <GlobalNavigationBarContainer />
              <InputWithTypeAheadContainer />
            </div>
            <AddedToBagNotificationContainer />
          </div>
        </div>

        <ContentSlot contentSlotName="global_sub_nav_banner" className="global-sub-nav-banner" />
      </header>
    );
  }

}
