/**
 * @module MiniBagDrawerNonEmpty
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * Lays out the shopping cart components when such cart has one or more items,
 * to be shown inside a desktop drawer.
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {MyBagHeaderContainer} from './MyBagHeaderContainer.js';
import {CartItemsListContainer} from './cartItems/CartItemsListContainer.js';
import {LedgerContainer} from 'views/components/orderSummary/LedgerContainer.js';
import {GuestRewardsPromoContainer} from 'views/components/rewards/GuestRewardsPromoContainer.js';
import {RegisteredRewardsPromoContainer} from 'views/components/rewards/RegisteredRewardsPromoContainer.js';
import {AirmilesPromoContainer} from 'views/components/rewards/airmiles/AirmilesPromoContainer.js';
import {ConfirmationModalContainer} from 'views/components/modal/ConfirmationModalContainer';
import {PaypalButtonContainer} from 'views/components/orderSummary/PaypalButtonContainer.js';
import {CONFIRM_MODAL_IDS} from 'reduxStore/storeOperators/cartOperator.js';
import cssClassName from 'util/viewUtil/cssClassName';

class MiniBagDrawerNonEmpty extends React.Component {
  static propTypes = {
    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool.isRequired,

    /** Flags indicates whether the user is a remembered guest */
    isRemembered: PropTypes.bool.isRequired,

    onCheckoutClick: PropTypes.func.isRequired,

    /** whether or not rewards are enabled */
    isRewardsEnabled: PropTypes.bool,

    /** Whether airmiles form is enabled or not **/
    isAirMilesEnabled: PropTypes.bool,

    /** Flag to know if drawer is showing some notification that needs to change the product list's height */
    isShowingNotification: PropTypes.bool,

    /* Flag to know if user has plcc saved on their account */
    userHasPlcc: PropTypes.bool
  }

  render () {
    let {isGuest, isRemembered, isRewardsEnabled, isAirMilesEnabled, isShowingUnavailableOrOssNotification, isShowingUpdatedNotification, userHasPlcc, isPayPalEnabled} = this.props;
    let isGuestRewardsPromo = isGuest && isRewardsEnabled && !isRemembered;
    let isRegisteredRewardsPromo = (!isGuest || isRemembered) && isRewardsEnabled;

    let cartItemsListClassName = cssClassName({
      'unavailable-or-oss-notification ': isShowingUnavailableOrOssNotification,
      'updated-or-moved-notification ': isShowingUpdatedNotification,
      'cart-item-list-with-register-promo ': isRegisteredRewardsPromo,
      'cart-item-list-without-plcc-card ': !userHasPlcc,
      'cart-item-list-with-guest-promo ': isGuestRewardsPromo
    });

    return (
      <div className="overlay-my-bag">
        <MyBagHeaderContainer isCondense />
        {isGuestRewardsPromo && <GuestRewardsPromoContainer isCondense />}
        {isRegisteredRewardsPromo && <RegisteredRewardsPromoContainer isCondense />}
        {isAirMilesEnabled && <AirmilesPromoContainer />}
        <CartItemsListContainer className={cartItemsListClassName} isCondense />

        <div className="container-buttom-mybag">
          <LedgerContainer isCondense />

          <div className="button-space">
            {isPayPalEnabled &&
             <PaypalButtonContainer className="button-secondary button-pay-with-paypal" isSkipPaymentEnabled />}
            <button onClick={this.props.onCheckoutClick} className="button-primary button-checkout">Checkout</button>
          </div>
        </div>

        <ConfirmationModalContainer contentLabel="Unsaved Cart Changes Confirmation Modal" modalId={CONFIRM_MODAL_IDS.EDITING}
          title="" promptClassName="message-cart-alert" confirmButtonText="Continue to Checkout" cancelButtonText="Back to bag"
          prompt="You have unsaved changes in your bag. Still want to continue?"
        />
      </div>
    );
  }
}

export {MiniBagDrawerNonEmpty};
