/**
 * @module Coupon
 * Shows a coupon in a list for the rewards section in My Account.
 *
 * @author Miguel <malvarez@minutentag.com>
 * @author Damian <drossi@minutentag.com>
 */

import React from 'react';
import {Icon} from 'views/components/myAccount/rewards/Icon.jsx';
import {COUPON_STATUS, COUPON_REDEMPTION_TYPE} from 'reduxStore/storeReducersAndActions/couponsAndPromos/couponsAndPromos';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName.js';
import Barcode from 'react-barcode';

class Coupon extends React.Component {
  static propTypes = {
    /** coupon to show */
    coupon: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      expirationDate: PropTypes.string.isRequired,
      redemptionType: PropTypes.string.isRequired,
      applyAlert: PropTypes.string,
      isApplicable: PropTypes.bool,
      applyError: PropTypes.string
    }).isRequired,
    /**
     * callback to handle request to view the details of a coupon. It should
     * accept a single parameter that is the coupon id.
     */
    onViewCouponDetails: PropTypes.func.isRequired,
    /**
     * callback to handle request to add a coupon to the bag. It should
     * accept a single parameter that is the coupon id.
     */
    onApplyCouponToBag: PropTypes.func.isRequired,

    /** indicates the button to apply the coupon is disabled
     * (in case other coupon is being applied)
     */
    isDisabled: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props);

    this.handleViewCouponDetails = this.handleViewCouponDetails.bind(this);
    this.handleApplyCouponToBag = this.handleApplyCouponToBag.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  handleViewCouponDetails () {
    return this.props.onViewCouponDetails(this.props.coupon);
  }

  handleApplyCouponToBag () {
    return this.props.onApplyCouponToBag({couponCode: this.props.coupon.id});
  }

  handleRemove (event) {
    this.props.onRemove({couponCode: this.props.coupon.id});
  }

  render () {
    let {isDisabled, coupon, isMobile} = this.props;

    let isApplyButtonDisabled = isDisabled || !coupon.isStarted;
    let isPlaceCash = coupon.redemptionType === COUPON_REDEMPTION_TYPE.PLACECASH;
    let applyButtonText = (!coupon.isStarted && isPlaceCash) ? 'See redeem dates' : 'Apply to bag';
    let handleApplyOnClick = !isDisabled ? this.handleApplyCouponToBag : null;

    let couponClassName = cssClassName('uncondense-coupon-content ', {
      'coupon-ineligible ': coupon.status === COUPON_STATUS.APPLYING || isDisabled
    }, {
      'web-code-disabled': coupon.promotionType === COUPON_REDEMPTION_TYPE.LOYALTY
    });

    return (
      <li className="uncondense-coupon">
        <div className={couponClassName}>
          <Icon
            title={coupon.title}
            src={coupon.imageUrl} />

          <span className="uncondense-expire-information">
            {isPlaceCash
              ? `Valid ${coupon.effectiveDate} - ${coupon.expirationDate}`
              : `Use by ${coupon.expirationDate}`}
          </span>

          {isMobile &&
            <div className="coupon-barcode">
              <Barcode value={coupon.id} />
            </div>
          }

          {(coupon.status === COUPON_STATUS.APPLIED && !coupon.isApplicable) && <p className="coupon-inline-notification" style={{padding: 0, fontSize: 10}}>This coupon is no longer applicable</p>}

          <button className="uncondense-view-and-print-button" onClick={this.handleViewCouponDetails}>View {!isMobile && <span>&amp; Print</span>}</button>
          {coupon.applyAlert && <p class="notification-inline">{coupon.applyAlert}</p>}

          {!coupon.applyAlert &&
            (coupon.status === COUPON_STATUS.APPLIED)
              ? <button type="button" onClick={this.handleRemove} className="uncondense-applied-coupons-button">Remove</button>
              : <button className="uncondense-apply-coupons-button" onClick={handleApplyOnClick} disabled={isApplyButtonDisabled}>{applyButtonText}</button>
          }
        </div>
      </li>
    );
  }
}

export {Coupon};
