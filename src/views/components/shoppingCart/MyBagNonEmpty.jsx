/**
 * @module MyBagNonEmpty
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * Lays out the shopping cart components when such cart has any items inside.
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {MyBagHeaderContainer} from './MyBagHeaderContainer.js';
import {CartItemsListContainer} from './cartItems/CartItemsListContainer.js';
import {CartSummaryContainer} from './CartSummaryContainer.js';
import {CartCouponsContainer} from 'views/components/coupons/CartCouponsContainer.js';
import {GuestRewardsPromoContainer} from 'views/components/rewards/GuestRewardsPromoContainer.js';
import {RegisteredRewardsPromoContainer} from 'views/components/rewards/RegisteredRewardsPromoContainer.js';
import {ConfirmationModalContainer} from 'views/components/modal/ConfirmationModalContainer';
import {AirmilesPromoContainer} from 'views/components/rewards/airmiles/AirmilesPromoContainer.js';
import {PlaceCashSpotContainer} from 'views/components/checkout/PlaceCashSpotContainer.js';
import cssClassName from 'util/viewUtil/cssClassName.js';
import {CONFIRM_MODAL_IDS} from 'reduxStore/storeOperators/cartOperator.js';
import {ProductRecommendationsListContainer} from 'views/components/recommendations/ProductRecommendationsListContainer.js';

if (DESKTOP) { // eslint-disable-line
  require('./_d.cart-alert-modal.scss');
} else {
  require('./_m.cart-alert-modal.scss');
}

export class MyBagNonEmpty extends React.Component {
  static propTypes = {
    /** Whether we are rendering for mobile. */
    isMobile: PropTypes.bool.isRequired,

    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool.isRequired,

    /** Flags indicates whether the user is a remembered guest */
    isRemembered: PropTypes.bool.isRequired,

    /** Whether rewards espots are enabled or not **/
    isRewardsEnabled: PropTypes.bool.isRequired,

    /** Whether airmiles form is enabled or not **/
    isAirMilesEnabled: PropTypes.bool
  }

  render () {
    let {isMobile, isRemembered, isRewardsEnabled, isAirMilesEnabled, isGuest} = this.props;

    let globalMyBagContainerCssClasses = cssClassName('container-global-my-bag', {' viewport-container': !isMobile});
    let globalMyBagCssClasses = cssClassName('global-my-bag');

    return (
      <section className="my-bag">
        <MyBagHeaderContainer isCondense={false} isMobile={isMobile} />
        <div className={globalMyBagContainerCssClasses}>
          <div className={globalMyBagCssClasses}>
            <CartItemsListContainer isCondense={false} />
            <div className="checkout-summary">
              <CartSummaryContainer isTotalEstimated />
              <PlaceCashSpotContainer />
              {isGuest && isRewardsEnabled && !isRemembered && <GuestRewardsPromoContainer isCondense={false} />}
              {(!isGuest || isRemembered) && isRewardsEnabled && <RegisteredRewardsPromoContainer isCondense={false} />}
              {isAirMilesEnabled && <AirmilesPromoContainer />}
              <CartCouponsContainer isMobile={isMobile} maxAvailableToShow={3} />
            </div>
          </div>
        </div>

        <ConfirmationModalContainer contentLabel="Unsaved Cart Changes Confirmation Modal" modalId={CONFIRM_MODAL_IDS.EDITING}
          title="" promptClassName="message-cart-alert" confirmButtonText="Continue to Checkout" cancelButtonText="Back to bag"
          prompt="You have unsaved changes in your bag. Still want to continue?"
        />

        <ProductRecommendationsListContainer />
      </section>
    );
  }
}
