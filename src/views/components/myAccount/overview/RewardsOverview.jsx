/**
 * @module RewardsOverview
 * Shows the list of coupons overview for the user, including a list of them and
 * CTA to go to view them all.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 * @author Miguel <malvarez@minutentag.com>
 * @author DaMIaN <drossi@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {CouponsList} from 'views/components/myAccount/rewards/CouponsList.jsx';
import {Coupon} from 'views/components/myAccount/rewards/Coupon.jsx';
import {CouponModal} from 'views/components/myAccount/rewards/CouponModal.jsx';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.my-account-coupons.scss');
} else {
  require('./_m.my-account-coupons.scss');
}

class RewardsOverview extends React.Component {
  static propTypes = {
    /** Whether to render for mobile. */
    isMobile: PropTypes.bool,

    isRewardsEnabled: PropTypes.bool.isRequired,
    /** list of coupons to show */
    coupons: PropTypes.arrayOf(Coupon.propTypes.coupon).isRequired,
    /**
     * callback to handle request to add a coupon to the bag. It should
     * accept a single parameter that is the coupon id.
     */
    onApplyCouponToBag: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    /** flags if the user has earned loyalty coupons for the current month */
    hasLoyaltyCoupons: PropTypes.bool.isRequired,
    /** flags if we are in Canada site */
    isCanada: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props);
    this.state = {viewingDetailsCoupon: null};
    this.handleViewCouponDetails = this.handleViewCouponDetails.bind(this);
    this.handleCloseViewModal = this.handleCloseViewModal.bind(this);
    this.handlePrint = this.handlePrint.bind(this);
  }

  handleViewCouponDetails (coupon) {
    this.setState({viewingDetailsCoupon: coupon});
  }

  handleCloseViewModal (coupon) {
    this.setState({viewingDetailsCoupon: null});
  }

  handlePrint (coupon) {
    window.print();
  }

  render () {
    let {isMobile, isRewardsEnabled, coupons, onApplyCouponToBag, onRemove, hasLoyaltyCoupons, isCanada} = this.props;
    let couponSectionTitle = isRewardsEnabled ? 'My Rewards & Offers' : 'My Offers & Coupons';
    let couponSectionSublink = isRewardsEnabled ? 'View all Rewards' : 'View all Offers & Coupons';
    let slicedCoupons = coupons.slice(0, 3);
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
      <div className="uncondense-coupon-summary-container">
        <h2 className="uncondense-coupon-summary-title">{isMobile ? 'Account Overview' : couponSectionTitle}</h2>

        {coupons.length > 0
          ? <div>
            <CouponsList key="0" coupons={slicedCoupons} onViewCouponDetails={this.handleViewCouponDetails}
              onApplyCouponToBag={onApplyCouponToBag} onRemove={onRemove} isShowViewAllButton={isMobile} viewAllRewardsDestination={viewAllRewardsDestination} couponSectionSublink={couponSectionSublink} isMobile={isMobile} />
            {!isMobile && <HyperLink key="1" destination={viewAllRewardsDestination} className="link-view-all-rewards">{couponSectionSublink}</HyperLink>}
          </div>
          : !isMobile
            ? <p className="uncondense-empty-coupons-summary">None yet. Start spending to earn rewards!</p>
            : <div className="welcome-message-inline-section">
              <h1 className="welcome-message-title">Welcome to the Children's Place!</h1>
              <p className="welcome-message-text">Hurry! Start spending now to earn tons of rewards!</p>
            </div>
        }

        <CouponModal isMobile={isMobile} coupon={viewingDetailsCoupon} isOpen={viewingDetailsCoupon !== null} onClose={this.handleCloseViewModal} onPrint={this.handlePrint} />
      </div>
    );
  }
}

export {RewardsOverview};
