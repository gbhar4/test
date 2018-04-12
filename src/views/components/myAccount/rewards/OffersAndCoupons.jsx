/**
 * @module OffersAndCoupons
 * Shows the rewards earned by the user for the current and next months.
 *
 * @author Damian <drossi@minutentag.com>
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {HeaderContainer} from './HeaderContainer.js';
import {CouponsList} from './CouponsList.jsx';
import {CouponModal} from './CouponModal.jsx';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';

if (DESKTOP) { // eslint-disable-line
  require('./menu/offersAndCoupons/_d.offers-and-coupons-section.scss');
} else {
  require('./menu/offersAndCoupons/_m.offers-and-coupons-section.scss');
}

class OffersAndCoupons extends React.Component {
  static propTypes = {
    /** array of coupons available to use during the ongoing month */
    offersAndCoupons: CouponsList.propTypes.coupons,

    /**
     * callback to handle request to add a coupon to the bag. It should
     * accept a single parameter that is the coupon id.
     */
    onApplyCouponToBag: PropTypes.func.isRequired,

    onRemove: PropTypes.func.isRequired,

    /** Whether to render for mobile. */
    isMobile: PropTypes.bool
  }

  state = {
    viewingDetailsCoupon: null
  }

  constructor (props) {
    super(props);
    this.handleViewCouponDetails = this.handleViewCouponDetails.bind(this);
    this.handleCloseViewModal = this.handleCloseViewModal.bind(this);
  }

  handleViewCouponDetails (coupon) {
    this.setState({viewingDetailsCoupon: coupon});
  }

  handleCloseViewModal (coupon) {
    this.setState({viewingDetailsCoupon: null});
  }

  render () {
    let {offersAndCoupons, onApplyCouponToBag, onRemove, isMobile, isCanada, hasLoyaltyCoupons} = this.props;
    let {viewingDetailsCoupon} = this.state;

    // Point the "View all" link to different rewards sections depending on whether
    // the user has loyalty coupons, doesn't have or we're in Canada site.
    let viewAllRewardsDestination = MY_ACCOUNT_SECTIONS.myRewards;
    if (isCanada) {
      viewAllRewardsDestination = MY_ACCOUNT_SECTIONS.offersAndCoupons;
    } else if (!hasLoyaltyCoupons) {
      viewAllRewardsDestination = MY_ACCOUNT_SECTIONS.myRewards.subSections.offersAndCoupons;
    }

    return (
      <div className="offers-and-coupons-section">
        <HeaderContainer />

        {offersAndCoupons.length > 0
          ? <CouponsList coupons={offersAndCoupons} onViewCouponDetails={this.handleViewCouponDetails}
            onApplyCouponToBag={onApplyCouponToBag} onRemove={onRemove} isMobile={isMobile} viewAllRewardsDestination={viewAllRewardsDestination} />
          : <p className="welcome-message-text">You don't have any offers at this time.</p>
        }

        {/*
        <div className="rewards-information-container">
          <h3 className="rewards-information-title">The Childrens Place Coupons</h3>
          <div className="rewards-text-container">
            <p className="rewards-information-text">
              Looking for The Children's Place coupons? Stop scouring the web for The Children's Place coupon codes and printable coupons and get the GUARANTEED best offers directly from us, right here on the official The Children's Place Coupons page.
            </p>

            <p className="rewards-information-text">
              When using a coupon, just remember to make sure to enter The Children's Place coupon code during checkout to apply it to your order. Other savings, like free shipping with The Children's Place, will be applied automatically to your order.
              The Children's Place printable coupons will need to be printed off at home before you take them into the store.
              Please make sure to check the terms and conditions for The Children's Place coupon you are using to make sure that your order meets the requirements for the coupon and that the coupon is still valid.
            </p>

            <p className="rewards-information-text">
              Looking for Black Friday deals? Stay on top of America's biggest shopping day by coming straight to the PLACE where you'll find the very best promos on The Children's Place kids clothing with exclusive Black Friday deals! Alternatively, if you're looking for savings for the year's best online shopping extravaganza, we have another page just for Cyber Monday deals.
            </p>
          </div>
        </div>
        */}

        <CouponModal isMobile={isMobile} coupon={viewingDetailsCoupon}
          isOpen={viewingDetailsCoupon !== null} onClose={this.handleCloseViewModal} />
      </div>
    );
  }
}

export {OffersAndCoupons};
