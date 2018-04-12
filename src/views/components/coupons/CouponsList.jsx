/** @module CouponsList
 * @summary renders a list of coupons.
 * Optionally, limits the number of coupons to show, and presents the user with a button
 * allowing to toggle between viewing all coupons or just the first few.
 *
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * @author Agu
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {Coupon} from './Coupon.jsx';
import {BASIC_COUPON_PROP_TYPES} from 'views/components/common/propTypes/couponsPropTypes';
import {ShowMoreButton} from 'views/components/common/ShowMoreButton.jsx';
import {COUPON_STATUS} from 'reduxStore/storeReducersAndActions/couponsAndPromos/couponsAndPromos';

export class CouponsList extends React.Component {
  static propTypes = {
    /** Wheter is mobile. */
    isMobile: PropTypes.bool,

    /** Flag to know if 'Apply to Order' button should be shown as 'Apply' */
    isShortApplyTo: PropTypes.bool,

    /** Title to show above the list. */
    title: PropTypes.string.isRequired,

    /** Maximum number of coupons to show when showMore is false */
    shrinkedSize: PropTypes.number.isRequired,

    /**
     * When this prop is true, show all the coupons and a "Show less" button;
     * else, show only shrinkedSize coupons and a "Show more" button (if needed).
     */
    initiallyExpanded: PropTypes.bool,

    /** Whether to show the list even if the coupons array is empty. */
    showWhenEmptyCoupons: PropTypes.bool,

    /** Whether to show the expiration date or not. */
    isShowExpirationDate: PropTypes.bool,

    /**
     * List of coupons to show. If isShrinkable is true and showMore is false,
     * only the first shrinkedSize coupons will be visible.
     */
    coupons: PropTypes.arrayOf(PropTypes.shape(BASIC_COUPON_PROP_TYPES)).isRequired,

    /** callback to apply a coupon to the current order. Accepts a single parameter that is the coupon id */
    onApply: PropTypes.func.isRequired,

    /** callback to remove a coupon from the current order. Accepts a single parameter that is the coupon id */
    onRemove: PropTypes.func.isRequired,

    /**
    * Indicates whether a coupon transaction is in progress.
    * In that case we need to disable action on other coupons
    */
    isApplyingOrRemovingCoupon: PropTypes.bool
  }

  static defaultProps = {
    showWhenEmptyCoupons: false
  }

  constructor (props) {
    super(props);

    this.state = {isExpanded: false};
    this.onShowMoreOrLessClick = (isExpanded) => this.setState({isExpanded: isExpanded});
  }

  render () {
    let {isApplyingOrRemovingCoupon, coupons, title, shrinkedSize, initiallyExpanded, showWhenEmptyCoupons, isShowExpirationDate, isMobile, isShortApplyTo} = this.props;

    if (coupons.length === 0 && !showWhenEmptyCoupons) return null;

    let visibleCoupons = ShowMoreButton.getVisibleSlice(coupons, shrinkedSize, this.state.isExpanded);
    let isApplyingCoupon = !!coupons.find((coupon) => coupon.status === COUPON_STATUS.APPLYING || coupon.status === COUPON_STATUS.REMOVING);

    return (
      <div className="coupon-list-container">
        <h3>{title}</h3>
        {visibleCoupons.length > 0 &&
          <ul className="list-coupons">
          {visibleCoupons.map((coupon, index) => (
            <Coupon isMobile={isMobile} isShortApplyTo={isShortApplyTo} key={coupon.id} {...coupon} onApply={this.props.onApply}
              onRemove={this.props.onRemove} isShowExpirationDate={isShowExpirationDate}
              isDisabled={isApplyingOrRemovingCoupon || isApplyingCoupon} />
          ))}
          </ul>
        }
        <ShowMoreButton className="button-view-all" ref={this.captureShowMoreButtonRef} onClick={this.onShowMoreOrLessClick}
          listLength={coupons.length} shrinkedSize={shrinkedSize} initiallyExpanded={initiallyExpanded} buttonAccessibleLabel="coupons" />
      </div>
    );
  }
}
