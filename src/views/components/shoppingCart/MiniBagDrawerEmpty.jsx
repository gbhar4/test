/** @module MiniBagDrawerEmpty
 * Lays out the shopping cart components when such cart is empty, to be shown inside a desktop drawer.
 *
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * @author Ben
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {DrawerFooterContainer} from 'views/components/globalElements/header/DrawerFooterContainer';
import {MyBagHeaderContainer} from './MyBagHeaderContainer.js';
import {LedgerContainer} from 'views/components/orderSummary/LedgerContainer.js';
import {RegisteredRewardsPromoContainer} from 'views/components/rewards/RegisteredRewardsPromoContainer.js';
import {LOGIN_FORM_TYPES} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator.js';
import {DRAWER_IDS} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';
import cssClassName from 'util/viewUtil/cssClassName';

export class MiniBagDrawerEmpty extends React.Component {
  static propTypes = {
    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool.isRequired,

    /** Flags indicates whether the user is a remembered guest */
    isRemembered: PropTypes.bool.isRequired,

    /**
     * A callback to change the displayed form in this drawer.
     * Accepts a single prop which is the ID of the form (see LOGIN_FORM_TYPES)
     */
    changeForm: PropTypes.func.isRequired,
    /**
     * A callback to change the displayed form.
     * Accepts a single prop which is the ID of the drawer (see DRAWER_IDS)
     */
    changeDrawer: PropTypes.func.isRequired,

    /** whether or not rewards are enabled */
    isRewardsEnabled: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props);

    this.handleCreateAccountClick = () => this.props.changeDrawer(DRAWER_IDS.CREATE_ACCOUNT);
    this.handleBackToLoginClick = () => this.props.changeForm(LOGIN_FORM_TYPES.LOGIN);
    this.handleBackToShoppingClick = () => this.props.changeDrawer(DRAWER_IDS.EMPTY);
  }

  render () {
    let {isGuest, isRemembered, isRewardsEnabled} = this.props;
    let containerClassName = cssClassName(
      {'empty-guest ': isGuest},
      'empty ',
      {'empty-bag-with-promo ': (!isGuest && isRewardsEnabled)}
    );

    return (
      <div className="overlay-my-bag">
        <MyBagHeaderContainer isCondense />

        <div className={containerClassName}>
          <h1>Your shopping bag is empty.</h1>

          <button type="button" className="continue-shopping" onClick={this.handleBackToShoppingClick}>Continue Shopping</button>
          {isGuest && <div className="empty-bag-with-login">
            <button type="button" className="button-primary login-button" onClick={this.handleBackToLoginClick}>Log in</button>
            {!isRemembered && <DrawerFooterContainer />}
            <ContentSlot contentSlotName="drawer_empty_bag" className="slot-drawer-bag" />
          </div>}
          {!isGuest && <DrawerFooterContainer isHideCreateAccountButton />}
        </div>

        <div className="container-buttom-mybag">
          <LedgerContainer isCondense />
        </div>

        {!isGuest && isRewardsEnabled && <RegisteredRewardsPromoContainer isCondense />}
      </div>
    );
  }

}
