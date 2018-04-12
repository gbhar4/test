/** @module OrderSummary
 * @summary Intermediate component to show the order summary (ledger) plus the rewards esport (when available)
 * @author Agustin H Andina Silva <asilva@minutentag.com>
 * @author Florencia Acosta
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {CheckoutOrderSummaryContainer} from 'views/components/orderSummary/CheckoutOrderSummaryContainer';
import {Accordion} from 'views/components/accordion/Accordion.jsx';
import {CartCouponsContainer} from 'views/components/coupons/CartCouponsContainer.js';
import {GuestRewardsPromoContainer} from 'views/components/rewards/GuestRewardsPromoContainer.js';
import {RegisteredRewardsPromoContainer} from 'views/components/rewards/RegisteredRewardsPromoContainer.js';
import {AirmilesPromoContainer} from 'views/components/rewards/airmiles/AirmilesPromoContainer.js';

const MAX_AVAILABLE_COUPONS_TO_SHOW = 3;

export class CheckoutSummarySidebar extends React.Component {
  static propTypes = {
    isMobile: PropTypes.bool,

    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool.isRequired,

    /** Flags indicates whether the user is a remembered guest */
    isRemembered: PropTypes.bool.isRequired,

    totalOrderSummary: PropTypes.number.isRequired,
    quantityCouponsApplied: PropTypes.number,

    isRewardsEnabled: PropTypes.bool.isRequired,
    isCouponFormEnabled: PropTypes.bool.isRequired,

    /** Whether airmiles form is enabled or not **/
    isAirMilesEnabled: PropTypes.bool.isRequired,

    /** Whether or not the user has any coupons that can be applied **/
    hasAvailableCoupons: PropTypes.bool.isRequired
  }

  render () {
    if (this.props.isMobile) {
      return this.renderMobile();
    } else {
      return this.renderDesktop();
    }
  }

  renderMobile () {
    let {isCouponFormEnabled, totalOrderSummary, quantityCouponsApplied, hasAvailableCoupons} = this.props;
    return (
      <div className="checkout-summary">
        {isCouponFormEnabled &&
          <Accordion expanded={hasAvailableCoupons} title={'Coupons (' + quantityCouponsApplied + ' applied)'} className="coupon-accordion" isCollapseOnContentClick={false}>
            <CartCouponsContainer maxAvailableToShow={MAX_AVAILABLE_COUPONS_TO_SHOW} isMobile />
          </Accordion>}

        <Accordion title={'Order Summary ($' + totalOrderSummary.toFixed(2) + ')'} className="order-summary-accordion">
          <CheckoutOrderSummaryContainer isMobile onSubmit={this.props.onSubmit} />
        </Accordion>
      </div>
    );
  }

  renderDesktop () {
    let {isGuest, isRemembered, isRewardsEnabled, isCouponFormEnabled, isAirMilesEnabled} = this.props;
    return (
      <div className="checkout-summary">
        <div className="summary-and-message">
          <CheckoutOrderSummaryContainer onSubmit={this.props.onSubmit} />

          {isGuest && isRewardsEnabled && !isRemembered && <GuestRewardsPromoContainer isCondense={false} />}
          {(!isGuest || isRemembered) && isRewardsEnabled && <RegisteredRewardsPromoContainer isCondense={false} />}
          {isAirMilesEnabled && <AirmilesPromoContainer />}
        </div>
        {isCouponFormEnabled && <CartCouponsContainer maxAvailableToShow={MAX_AVAILABLE_COUPONS_TO_SHOW} />}
      </div>
    );
  }

}
