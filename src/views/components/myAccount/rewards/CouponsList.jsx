/**
 * @module CouponsList
 * Shows list of coupons for the rewards section in My Account.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Coupon} from './Coupon.jsx';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {getSetErrorInStateMethod} from 'reduxStore/storeOperators/operatorHelper';
import {SuccessMessage} from 'views/components/common/SuccessMessage.jsx';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import cssClassName from 'util/viewUtil/cssClassName';
import {COUPON_STATUS} from 'reduxStore/storeReducersAndActions/couponsAndPromos/couponsAndPromos';

class CouponsList extends React.Component {
  static propTypes = {
    /** list of coupons to show */
    coupons: PropTypes.arrayOf(Coupon.propTypes.coupon).isRequired,
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

    onRemove: PropTypes.func.isRequired,

    /* defines if shows or not the 'show all' button**/
    isShowViewAllButton: PropTypes.bool,

    /** element which carries information to help construct the hyperlink to the CTA view all rewards */
    viewAllRewardsDestination: PropTypes.object.isRequired,

    /*  if shows "Show all" button, recieves link text */
    couponSectionSublink: PropTypes.string,

    /* defines if is mobile version **/
    isMobile: PropTypes.bool,

    /**
    * Indicates whether a coupon transaction is in progress.
    * In that case we need to disable action on other coupons
    */
    isApplyingOrRemovingCoupon: PropTypes.bool
  }

  state = {
    error: null,
    success: null
  }

  constructor (props) {
    super(props);

    this.state = {
      activeCoupon: 0
    };

    this.handleApplyCouponToBag = this.handleApplyCouponToBag.bind(this);
    this.setError = getSetErrorInStateMethod(this);

    this.captureContainerRef = this.captureContainerRef.bind(this);
    this.scrollToPreviousCoupon = this.scrollToPreviousCoupon.bind(this);
    this.scrollToNextCoupon = this.scrollToNextCoupon.bind(this);
    this.scrollToTargetCoupon = this.scrollToTargetCoupon.bind(this);
    this.scrollListSnap = this.scrollListSnap.bind(this);
  }

  componentWillUnmount () {
    this.containerRef && this.containerRef.removeEventListener('scroll', this.scrollListSnap, true);
  }

  handleApplyCouponToBag (coupon) {
    this.props.onApplyCouponToBag(coupon)
      .then(() => {
        this.setError();
        this.setState({
          activeCoupon: 0,
          success: 'Coupon successfully applied to your cart.'
        });

        // FIXME: coupon changes from array to array on service so we loose track
        // of the element the user was looking at. Decision was to force scroll to the first element
        // after applying a coupon. Eventually backend will merge those 4 arrays for coupons
        // and we won't need to force scroll anymore
        this.containerRef.scrollLeft = 0;
      }).catch((err) => this.setError(err));
  }

  captureContainerRef (ref) {
    this.containerRef = ref;
    ref && ref.addEventListener('scroll', this.scrollListSnap, true);
  }

  scrollListSnap () {
    if (this.scrollListSnapTimeout) {
      clearTimeout(this.scrollListSnapTimeout);
    }

    // scroll triggers on every pixel, we need some cooldown to identify when the scroll stopped
    this.scrollListSnapTimeout = setTimeout(() => {
      let scrollLeft = this.containerRef.scrollLeft;
      let elementWidth = this.containerRef.offsetWidth;
      let activeCoupon = Math.round(scrollLeft / elementWidth);

      if (this.state.activeCoupon !== activeCoupon) {
        this.setState({
          activeCoupon: activeCoupon
        });
      }

      this.containerRef.scrollLeft = activeCoupon * elementWidth;
    }, 100);
  }

  // FIXME: create a new component for carousels that will do the active verification and set properly instad of calculating using the dom
  scrollToPreviousCoupon () {
    let length = this.props.coupons.length + (this.props.isShowViewAllButton ? 1 : 0);
    let activeCoupon = (this.state.activeCoupon - 1 + length) % length;

    this.containerRef.scrollLeft = activeCoupon * this.containerRef.offsetWidth;

    this.setState({
      activeCoupon: activeCoupon
    });
  }

  scrollToNextCoupon () {
    let length = this.props.coupons.length + (this.props.isShowViewAllButton ? 1 : 0);
    let activeCoupon = (this.state.activeCoupon + 1) % length;
    this.containerRef.scrollLeft = activeCoupon * this.containerRef.offsetWidth;

    this.setState({
      activeCoupon: activeCoupon
    });
  }

  scrollToTargetCoupon (event) {
    let activeCoupon = parseInt(event.target.attributes['data-index'].value);
    this.containerRef.scrollLeft = activeCoupon * this.containerRef.offsetWidth;

    this.setState({
      activeCoupon: activeCoupon
    });
  }

  render () {
    let {isApplyingOrRemovingCoupon, coupons, onViewCouponDetails, isShowViewAllButton, viewAllRewardsDestination, couponSectionSublink, isMobile} = this.props;
    let {activeCoupon} = this.state;
    let isCupons = coupons.length !== 0;

    let isApplyingCoupon = !!coupons.find((coupon) => coupon.status === COUPON_STATUS.APPLYING || coupon.status === COUPON_STATUS.REMOVING);

    return (
      <div className="uncondense-coupons-container">
        {this.state.error && <ErrorMessage error={this.state.error} />}
        {this.state.success && <SuccessMessage message={this.state.success} />}

        {(isMobile && isCupons) && <button className="button-prev" onClick={this.scrollToPreviousCoupon}>prev</button>}
        {(isMobile && isCupons) && <button className="button-next" onClick={this.scrollToNextCoupon}>next</button>}

        <ul ref={this.captureContainerRef} className="uncondense-list-coupons">
          {coupons.map((coupon) =>
            <Coupon key={coupon.id} coupon={coupon} onViewCouponDetails={onViewCouponDetails}
              onApplyCouponToBag={this.handleApplyCouponToBag} onRemove={this.props.onRemove} isMobile={isMobile}
              isDisabled={isApplyingOrRemovingCoupon || isApplyingCoupon} />
          )}
          {isShowViewAllButton && <li className="uncondense-coupon">
            <HyperLink key="1" destination={viewAllRewardsDestination} className="link-view-all-rewards">{couponSectionSublink}</HyperLink>
          </li>
          }
        </ul>

        {isMobile && <div className="coupon-dots">
          {coupons.map((coupon, index) => {
            let paginationDotClass = cssClassName('button-pagination-dot ', {'active': index === activeCoupon});
            return (<button key={index} className={paginationDotClass} data-index={index} onClick={this.scrollToTargetCoupon}>&bull;</button>);
          })}

          {isShowViewAllButton && <button className={cssClassName('button-pagination-dot ', {'active': coupons.length === activeCoupon})} data-index={coupons.length} onClick={this.scrollToTargetCoupon}>&bull;</button>}
        </div>}
      </div>
    );
  }
}

export {CouponsList};
