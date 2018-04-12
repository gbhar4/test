/** @module WishlistLoginDrawer
 * Component which shows the LoginForm, but with modified copy related to
 * wishlist. link/tab in desktop.
 *
 * Any props passed to this component, except for title, subTitle, onSubmitSuccess,
 * isShowRemember, isShowForgot, and isShowResetPassword (which are all hard-coded by this component)
 * will be passed along to the rendered <code>LoginFormContainer</code> element.
 *
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * @author Ben
 */

import React from 'react';
import {LoginFormContainer} from './LoginFormContainer.js';
import {DrawerFooterContainer} from 'views/components/globalElements/header/DrawerFooterContainer';

export class WishlistLoginDrawer extends React.Component {

  render () {
    let {onWishlistSuccessfulLogin, isRemembered} = this.props;

    return (
      <div>
        <LoginFormContainer {...this.props} title={<span>Love it. Save it. Share it!</span>}
          subtitle="See something you love? Log in to build and share your Favorites list."
          onSubmitSuccess={onWishlistSuccessfulLogin}
          contentSlotName="drawer_wishlist_login"
          isRemembered={isRemembered} isEmailAddressDisabled={isRemembered}
          isShowRememberedLogOut={isRemembered} isShowForgot={!isRemembered}
          isShowRemember />

        {!isRemembered && <DrawerFooterContainer />}
      </div>
    );
  }

}
