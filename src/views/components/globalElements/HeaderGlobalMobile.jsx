import React from 'react';
import {PropTypes} from 'prop-types';

import {AccountHeaderLinks} from './header/AccountHeaderLinks.jsx';
import {MobileHeaderFooterNavLinks} from './header/MobileHeaderFooterNavLinks.jsx';
import {HomeButton} from './header/HomeButton.jsx';
import {ButtonMenu} from './header/ButtonMenu.jsx';
import {MiniCartLinkContainer} from './header/MiniCartLinkContainer.js';
import {GlobalNavigationBarContainer} from './header/GlobalNavigationBarContainer.js';
import {TypeaheadLink} from './header/TypeaheadLink.jsx';
import {PAGES} from 'routing/routes/pages.js';
import {AddedToBagNotificationContainer} from './header/AddedToBagNotificationContainer.js';
import {DesktopAccountDrawersContainer} from 'views/components/globalElements/header/DesktopAccountDrawersContainer.js';
import {Modal} from 'views/components/modal/Modal.jsx';
import {isClient} from 'routing/routingHelper';
import cssClassName from 'util/viewUtil/cssClassName';
import {FIXED_HEADER_DATA_ATTRIBUTE} from 'util/viewUtil/scrollingAndFocusing';
import {DocumentSwipeListener} from 'views/components/common/DocumentSwipeListener.jsx';
import {Accordion} from 'views/components/accordion/Accordion.jsx';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';

if (!DESKTOP) { // eslint-disable-line
  require('./_m.header-global.scss');
  require('./_m.overlay.scss');
}

export class HeaderGlobalMobile extends React.Component {
  static propTypes = {
    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool.isRequired,

    /** whether or not rewards are enabled **/
    isRewardsEnabled: PropTypes.bool.isRequired,

    /** flags if the hamburger menu should be expanded */
    isHamburgerMenuOpen: PropTypes.bool.isRequired,

    /** callback to set the state of the hamburger menu */
    setHamburgerMenuOpenState: PropTypes.func.isRequired,

    goToPage: PropTypes.func.isRequired
  }

  constructor (props, context) {
    super(props, context);

    this.toggleHamburgerMenu = () => this.props.setHamburgerMenuOpenState(!this.props.isHamburgerMenuOpen);
    this.openHamburgerMenu = () => this.props.setHamburgerMenuOpenState(true);
    this.closeHamburgerMenu = () => this.props.setHamburgerMenuOpenState(false);
    this.handleMiniCartLinkClick = this.handleMiniCartLinkClick.bind(this);
  }

  handleMiniCartLinkClick () {
    this.props.goToPage(PAGES.cart);
  }

  render () {
    let {isRewardsEnabled, isGuest, isRemembered, openSelectedDrawer,
      stickyClassName, onStoreStickyRef, isHamburgerMenuOpen, newNavigationVariants: { variantA, variantB, variantC }} = this.props;

    let isNewNavigationActive = variantA || variantB;

    let containerClassName = cssClassName(
      'header-global ',
      {
        'new-mobile-nav-variant-a ': variantA && isHamburgerMenuOpen,
        'new-mobile-nav-variant-b ': variantB && isHamburgerMenuOpen,
        'new-mobile-nav-variant-c ': variantC && isHamburgerMenuOpen,
        [stickyClassName]: !!stickyClassName
      }
    );

    if (isClient()) {
      let body = document.documentElement;
      if (isHamburgerMenuOpen && !isNewNavigationActive) {
        body.className = cssClassName('menu-expanded');
      } else if (isHamburgerMenuOpen && isNewNavigationActive) {
        body.className = cssClassName('no-overflow');
      } else {
        body.className = '';
        // body.className = (body.className || '').split(' ').filter((item) => item !== 'menu-expanded').join(' ');
      }
    }

    return (<div>
      <ContentSlot contentSlotName="global_header_banner_above_header" className="header-global-banner" />
      {stickyClassName && <div className="header-ghost-element"></div>}
      <header className={containerClassName} ref={onStoreStickyRef} {...FIXED_HEADER_DATA_ATTRIBUTE}>

        <ButtonMenu
          isCloseButton={isNewNavigationActive && isHamburgerMenuOpen}
          onClick={this.toggleHamburgerMenu} />
        <HomeButton />
        <MiniCartLinkContainer onClick={this.handleMiniCartLinkClick} />
        <TypeaheadLink />

        <GlobalMobileNav {...{isRearrangedNav: variantC, isHamburgerMenuOpen, isNewNavigationActive, openSelectedDrawer, closeHamburgerMenu: this.closeHamburgerMenu, isGuest, isRemembered, isRewardsEnabled}}/>

        <DesktopAccountDrawersContainer />
        <AddedToBagNotificationContainer />

        {isClient() && !isNewNavigationActive && isHamburgerMenuOpen && <DocumentSwipeListener onSwipeLeft={this.closeHamburgerMenu} />}
      </header>

      <ContentSlot contentSlotName="global_sub_nav_banner" className="global-sub-nav-banner" />
    </div>);
  }
}

function GlobalMobileNav (props) {
  let { closeHamburgerMenu, isHamburgerMenuOpen, isNewNavigationActive,
    openSelectedDrawer, isGuest, isRemembered, isRewardsEnabled, isRearrangedNav } = props;

  if (!isHamburgerMenuOpen) {
    return null;
  }

  let modalClassName = cssClassName(
    'global-header-mobile-container menu-active ',
    {
      'rearranged-mobile-navigation ': isRearrangedNav
    }
  );

  return (
    isNewNavigationActive
      ? <div className="global-header-mobile-container new-global-header-mobile-container">
          <div className="global-navigation-container">
            <MobileHeaderFooterNavLinks isGuest={isGuest} isRemembered={isRemembered} isRewardsEnabled={isRewardsEnabled}
              openSelectedDrawer={openSelectedDrawer} />

            <Accordion expanded={true} title={'Categories'} className={`categories-accordion is-guest-${isGuest}`} isCollapseOnContentClick={false}>
              <GlobalNavigationBarContainer isMobile />
            </Accordion>

            <Accordion expanded={true} title={'My Account'} className="myaccount-accordion" isCollapseOnContentClick={false}>
              <MobileHeaderFooterNavLinks isGuest={isGuest} isRemembered={isRemembered} isRewardsEnabled={isRewardsEnabled}
                openSelectedDrawer={openSelectedDrawer} isFooterLinks />
            </Accordion>

          </div>
        </div>
      : <Modal isOpen contentLabel="Header" overlayClassName="global-header-mobile" className={modalClassName}>
          <div className="global-navigation-container">
            <AccountHeaderLinks isMobile isGuest={isGuest} isRemembered={isRemembered} isRewardsEnabled={isRewardsEnabled}
              openSelectedDrawer={openSelectedDrawer} />

            <GlobalNavigationBarContainer isMobile />

            {isRearrangedNav && <AccountHeaderLinks isMobile isGuest={isGuest} isRemembered={isRemembered} isRewardsEnabled={isRewardsEnabled}
              openSelectedDrawer={openSelectedDrawer} />}
          </div>
          <button className="close-menu" type="button" onClick={closeHamburgerMenu}>Close</button>
        </Modal>
  );
}
