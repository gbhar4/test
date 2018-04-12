/** @module DesktopAccountDrawers
 * @summary a presentational component rendering the global headers drawers modal.
 *
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {LoginLink} from './LoginLink.jsx';
import {CreateAccountLink} from './CreateAccountLink.jsx';
import {HelloLinkContainer} from './HelloLinkContainer';
import {MiniCartLinkContainer} from './MiniCartLinkContainer';
import {MyPlaceRewardsLinkContainer} from './MyPlaceRewardsLinkContainer';
import {WishListLink} from './WishListLink.jsx';
import {WishlistRedirectLink} from './WishlistRedirectLink.jsx';
import {DesktopDrawerCreateAccount} from 'views/components/account/createAccount/DesktopDrawerCreateAccount.jsx';
import {DesktopDrawerLoginContainer} from 'views/components/login/DesktopDrawerLoginContainer';
import {MyAccountDrawerContainer} from 'views/components/account/myAccountDrawer/MyAccountDrawerContainer';
import {WishlistLoginDrawer} from 'views/components/login/WishlistLoginDrawer.jsx';
import {MiniBagDrawerContainer} from 'views/components/shoppingCart/MiniBagDrawerContainer';
import {TabedDrawers} from 'views/components/common/TabedDrawers.jsx';
import {DRAWER_IDS, LOGIN_FORM_TYPES} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';

export class DesktopAccountDrawers extends React.Component {

  static propTypes = {
    /** the id of the currently open tab */
    activeTabId: PropTypes.oneOf([
      DRAWER_IDS.CREATE_ACCOUNT,
      DRAWER_IDS.LOGIN,
      DRAWER_IDS.WISHLIST_LOGIN,
      DRAWER_IDS.MINI_CART,
      DRAWER_IDS.MY_ACCOUNT,
      DRAWER_IDS.EMPTY
    ]).isRequired,

    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool.isRequired,

    /** Flags indicates whether the user is a remembered guest */
    isRemembered: PropTypes.bool.isRequired,

    // FIXME: get needed methods as props, not the full operator
    globalSignalsOperator: PropTypes.object.isRequired,

    /** whether or not rewards are enabled **/
    isRewardsEnabled: PropTypes.bool.isRequired,

    /** This is used to know where to redirect the user on wishlist login CA vs US size **/
    onWishlistSuccessfulLogin: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);

    this.createTabs(props);

    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
  }

  // componentWillReceiveProps (nextProps) {
  //   if (this.props.isGuest !== nextProps.isGuest || this.props.isRemembered !== nextProps.isRemembered) {
  //     this.createTabs(nextProps);
  //   }
  // }

  handleCloseClick () {
    this.props.globalSignalsOperator.closeDrawers();
  }

  handleLinkClick (event, tabId) {
    this.props.globalSignalsOperator.openSelectedDrawer(tabId);
  }

  render () {
    let {activeTabId, isMobile, activeFormName} = this.props;
    let tabs = this.getTabs();

    return (
      <TabedDrawers isMobile={isMobile} tabs={tabs} activeTabId={activeTabId} onLinkClick={this.handleLinkClick} activeFormName={activeFormName}
        className="overlay-container" contentLabel="Header Drawers Modal" overlayClassName="react-overlay overlay-right" isOpen={!!activeTabId}
        shouldCloseOnOverlayClick onRequestClose={this.handleCloseClick} onCloseClick={this.handleCloseClick} />
    );
  }

  // --------------- private methods --------------- //

  createTabs (props) {
    let {globalSignalsOperator, onWishlistSuccessfulLogin} = this.props;
    let changeForm = globalSignalsOperator.openSelectedLoginDrawerForm;
    let changeDrawer = globalSignalsOperator.openSelectedDrawer;
    this.TABS = {
      createAccountTab: {
        id: DRAWER_IDS.CREATE_ACCOUNT,
        title: 'Create Account',
        LinkComponent: CreateAccountLink,
        ContentComponent: DesktopDrawerCreateAccount,
        contentProps: {
          onForgotPasswordClick: () => changeForm(LOGIN_FORM_TYPES.REQUEST_PASSWORD_RESET)
        }
      },
      loginTab: {
        id: DRAWER_IDS.LOGIN,
        title: 'Login',
        LinkComponent: LoginLink,
        ContentComponent: DesktopDrawerLoginContainer,
        contentProps: {
          isRemembered: false,
          changeDrawer: changeDrawer,
          changeForm: changeForm
        }
      },
      rememberedLoginTab: {
        id: DRAWER_IDS.LOGIN,
        title: 'Login',
        LinkComponent: HelloLinkContainer,
        ContentComponent: DesktopDrawerLoginContainer,
        contentProps: {
          isRemembered: true,
          changeForm: changeForm,
          changeDrawer: changeDrawer
        }
      },
      wishlistLoginTab: {
        id: DRAWER_IDS.WISHLIST_LOGIN,
        title: 'Wishlist',
        LinkComponent: WishListLink,
        ContentComponent: WishlistLoginDrawer,
        linkProps: {isGuest: true},
        contentProps: {
          changeForm: changeForm,
          changeDrawer: changeDrawer,
          onForgotPasswordClick: () => changeForm(LOGIN_FORM_TYPES.REQUEST_PASSWORD_RESET),
          onWishlistSuccessfulLogin: onWishlistSuccessfulLogin
        }
      },
      rememberedwishlistLoginTab: {
        id: DRAWER_IDS.WISHLIST_LOGIN,
        title: 'Wishlist',
        LinkComponent: WishListLink,
        ContentComponent: WishlistLoginDrawer,
        linkProps: {isGuest: true},
        contentProps: {
          isRemembered: true,
          changeForm: changeForm,
          changeDrawer: changeDrawer,
          onForgotPasswordClick: () => changeForm(LOGIN_FORM_TYPES.REQUEST_PASSWORD_RESET),
          onWishlistSuccessfulLogin: onWishlistSuccessfulLogin
        }
      },
      wishlistRedirectTab: {
        id: '651aa22d-d2ce',
        LinkComponent: WishlistRedirectLink,
        linkProps: {
          isGuest: false
        }
      },
      miniCartTab: {
        id: DRAWER_IDS.MINI_CART,
        title: 'Cart',
        LinkComponent: MiniCartLinkContainer,
        ContentComponent: MiniBagDrawerContainer,
        contentProps: {
          isGuest: true,
          changeDrawer: changeDrawer,
          changeForm: changeForm
        }
      },
      miniCartGuestTab: {
        id: DRAWER_IDS.MINI_CART,
        title: 'Cart',
        LinkComponent: MiniCartLinkContainer,
        ContentComponent: MiniBagDrawerContainer,
        contentProps: {
          isGuest: false,
          changeDrawer: changeDrawer,
          changeForm: changeForm
        }
      },
      myAccountTab: {
        id: DRAWER_IDS.MY_ACCOUNT,
        title: 'My Account',
        LinkComponent: HelloLinkContainer,
        ContentComponent: MyAccountDrawerContainer
      },
      myPlaceRewardsReditrectTab: {
        id: 'd0f72fb0cffc',
        LinkComponent: MyPlaceRewardsLinkContainer
      }
    };
  }

  getTabs () {
    let TABS = this.TABS;
    if (this.props.isGuest && this.props.isRemembered) {
      return [TABS.rememberedLoginTab, TABS.rememberedwishlistLoginTab, TABS.miniCartGuestTab];
    } else if (this.props.isGuest) {
      if (this.props.isRewardsEnabled) {
        return [TABS.createAccountTab, TABS.loginTab, TABS.myPlaceRewardsReditrectTab, TABS.wishlistLoginTab, TABS.miniCartGuestTab];
      } else {
        return [TABS.createAccountTab, TABS.loginTab, TABS.wishlistLoginTab, TABS.miniCartGuestTab];
      }
    } else {
      return [TABS.myAccountTab, TABS.wishlistRedirectTab, TABS.miniCartTab];
    }
  }

  // --------------- end of private methods --------------- //

}
