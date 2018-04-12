/**
 * @module CartCoupons
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * Parent component for coupon related components to show in the shopping cart
 * page.
 *
 * Style (ClassName) Elements description/enumeration
 *  -
 *
 * Uses
 *  -
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {CouponsList} from './CouponsList.jsx';
import {CouponCodeFormContainer} from './CouponCodeFormContainer.js';
import {COUPON_STATUS} from 'reduxStore/storeReducersAndActions/couponsAndPromos/couponsAndPromos';

class CartCoupons extends React.Component {
  static propTypes = {
    /** Whether we are rendering for mobile. */
    isMobile: PropTypes.bool,

    /** maximum number of available coupons to initially show */
    maxAvailableToShow: PropTypes.number.isRequired,

    /** List of coupons in 'available' status. */
    availableCoupons: CouponsList.propTypes.coupons,

    /** List of coupons in 'applied' or 'pending' status. */
    appliedCoupons: CouponsList.propTypes.coupons,

    /** callbacks to apply/remove coupons */
    onApplyCoupon: PropTypes.func.isRequired,
    onRemoveCode: PropTypes.func.isRequired
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
    let {availableCoupons, appliedCoupons, maxAvailableToShow, isMobile} = this.props;

    let isApplyingOrRemovingCoupon = !!appliedCoupons.find((coupon) => coupon.status === COUPON_STATUS.REMOVING) ||
      !!availableCoupons.find((coupon) => coupon.status === COUPON_STATUS.APPLYING);

    return (
      <div className="coupons-container">
        <CouponCodeFormContainer />
        <div className="available-rewards apply-coupons apply-rewards">
          <CouponsList isShortApplyTo={isMobile} title="APPLIED COUPONS" coupons={appliedCoupons}
            shrinkedSize={Number.MAX_VALUE} isMobile={isMobile}
            onApply={this.handleApplyCoupon} onRemove={this.handleRemoveCoupon}
            isApplyingOrRemovingCoupon={isApplyingOrRemovingCoupon} />
          <CouponsList isShortApplyTo={isMobile} title={'AVAILABLE REWARDS AND OFFERS (' + availableCoupons.length + ')'} coupons={availableCoupons}
            shrinkedSize={maxAvailableToShow} isMobile={isMobile}
            onApply={this.handleApplyCoupon} onRemove={this.handleRemoveCoupon} isShowExpirationDate
            isApplyingOrRemovingCoupon={isApplyingOrRemovingCoupon} />
        </div>
      </div>
    );
  }
}

export {CartCoupons};
