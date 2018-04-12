/**
 * @module CouponsSummary
 * @author Miguel Alvarez Igarzábal
 * Shows the list of coupons available and applied to the current order.
 *
 * Style (className) Elements description/enumeration:
 *  .available-rewards
 *
 * Uses:
 *  <CouponsList />
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {CouponsList} from 'views/components/coupons/CouponsList.jsx';
import cssClassName from 'util/viewUtil/cssClassName';
import {Spinner} from 'views/components/common/Spinner.jsx';
import {BASIC_COUPON_PROP_TYPES} from 'views/components/common/propTypes/couponsPropTypes';
import {COUPON_STATUS} from 'reduxStore/storeReducersAndActions/couponsAndPromos/couponsAndPromos';

if (DESKTOP) { // eslint-disable-line
  require('views/components/coupons/_d.available-rewards.scss');
  require('views/components/coupons/_d.available-rewards-overlay.scss');
} else {
  require('views/components/coupons/_m.available-rewards.scss');
}

class CouponsSummary extends React.Component {
  static propTypes = {
    /** Wheter is mobile. */
    isMobile: PropTypes.bool,

    /** flag if the promotion & coupon list is/was loaded */
    isPromosLoaded: PropTypes.bool.isRequired,

    /**
     * Coupons available or applied to the current order to show (there may be
     * more coupons, but can only be seen by pressing the "View All" link, which
     * navigates to My Account page).
     */
    coupons: PropTypes.arrayOf(PropTypes.shape(BASIC_COUPON_PROP_TYPES)).isRequired,

    /** indicates whether rewards are enabled or not (for copy updates) */
    isRewardsEnabled: PropTypes.bool.isRequired

    // /** Flags if to show the "view all" link to the MPR section of My Account */
    // showViewAllLink: PropTypes.bool
  }

  constructor (props) {
    super(props);

    this.handleApplyCoupon = this.handleApplyCoupon.bind(this);
    this.handleRemoveCoupon = this.handleRemoveCoupon.bind(this);
  }

  handleApplyCoupon (couponCode) {
    this.props.onApplyCoupon({couponCode});
  }

  handleRemoveCoupon (couponCode) {
    this.props.onRemoveCode({couponCode});
  }

  render () {
    let {coupons, couponsApplied, isMobile, shrinkedSize, isPromosLoaded, isRewardsEnabled} = this.props;
    let title = isRewardsEnabled ? `My Rewards and Offers (${coupons.length})` : `Offers and coupons (${coupons.length})`;
    let couponClassName = cssClassName('available-rewards ', {
      'no-couponn': coupons.length === 0
    });

    let isApplyingOrRemovingCoupon = !!couponsApplied.find((coupon) => coupon.status === COUPON_STATUS.REMOVING) ||
      !!coupons.find((coupon) => coupon.status === COUPON_STATUS.APPLYING);

    return (
      !isPromosLoaded
      ? <Spinner />
      : <div className={couponClassName}>
        {couponsApplied.length > 0 && <CouponsList title="Coupons Applied" coupons={couponsApplied} showWhenEmptyCoupons isMobile={isMobile} onApply={this.handleApplyCoupon} onRemove={this.handleRemoveCoupon} shrinkedSize={shrinkedSize} isApplyingOrRemovingCoupon={isApplyingOrRemovingCoupon} />}
        {coupons.length > 0 && <CouponsList title={title} coupons={coupons} showWhenEmptyCoupons isMobile={isMobile} onApply={this.handleApplyCoupon} onRemove={this.handleRemoveCoupon} shrinkedSize={shrinkedSize} isShowExpirationDate isApplyingOrRemovingCoupon={isApplyingOrRemovingCoupon} />}
      </div>
    );
  }
}

export {CouponsSummary};
