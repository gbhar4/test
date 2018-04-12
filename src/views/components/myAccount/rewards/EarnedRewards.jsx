/**
 * @module EarnedRewards
 * Shows the rewards earned by the user for the current and next months.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {HeaderContainer} from './HeaderContainer.js';
import {CouponsList} from './CouponsList.jsx';
import {FooterLinks} from './FooterLinks.jsx';
import {CouponModal} from './CouponModal.jsx';
import {SuccessMessage} from 'views/components/common/SuccessMessage.jsx';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';

if (DESKTOP) { // eslint-disable-line
  require('./menu/rewards/_d.rewards-overview-section.scss');
} else {
  require('./menu/rewards/_m.rewards-overview-section.scss');
}

class EarnedRewards extends React.Component {
  static propTypes = {
    /** Whether to render for mobile. */
    isMobile: PropTypes.bool,
    /** array of coupons available to use during the ongoing month */
    currentMonthCoupons: CouponsList.propTypes.coupons,
    /** Number of points the user needs to accumulate to get the next reward. */
    pointsToNextReward: PropTypes.number.isRequired,
    /**
     * Rewards that will be earned when the pointsToNextReward are accumulated
     * by the user.
     */
    nextRewardAmount: PropTypes.number.isRequired,
    /**
     * callback to handle request to add a coupon to the bag. It should
     * accept a single parameter that is the coupon id.
     */
    onApplyCouponToBag: PropTypes.func.isRequired,

    /** message to show because of successfull operations */
    successMessage: PropTypes.string,

    /** message to show for some errors that can only be managed by help desk */
    errorMessage: PropTypes.string,

    /** callback to clear the success message */
    onClearFlashMessage: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);
    this.state = {viewingDetailsCoupon: null};
    this.handleViewCouponDetails = this.handleViewCouponDetails.bind(this);
    this.handleCloseViewModal = this.handleCloseViewModal.bind(this);
    this.handlePrint = this.handlePrint.bind(this);
    this.clearFlashMessage = this.clearFlashMessage.bind(this);
  }

  clearFlashMessage () {
    this.props.onClearFlashMessage();
  }

  handleViewCouponDetails (coupon) {
    this.clearFlashMessage();
    this.setState({viewingDetailsCoupon: coupon});
  }

  handleCloseViewModal (coupon) {
    this.clearFlashMessage();
    this.setState({viewingDetailsCoupon: null});
  }

  handlePrint (coupon) {
    window.print();
  }

  render () {
    let {isMobile, currentMonthCoupons, onApplyCouponToBag, onRemove,
      successMessage, errorMessage, isCanada, hasLoyaltyCoupons} = this.props;
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
      <div className="earned-rewards">
        <HeaderContainer />
        {successMessage && <SuccessMessage message={successMessage} />}
        {errorMessage && <ErrorMessage error={errorMessage} />}

        {currentMonthCoupons && currentMonthCoupons.length
          ? <div className="month-rewards-container">
            <h2 className="month-rewards-title">This month's Rewards</h2>
            <p className="month-rewards-message">You can redeem your rewards online at checkout. To redeem in-store show the coupon on your mobile device, or click “view” and print a copy.</p>

            <CouponsList coupons={currentMonthCoupons} onViewCouponDetails={this.handleViewCouponDetails}
              onApplyCouponToBag={onApplyCouponToBag} isMobile={isMobile} viewAllRewardsDestination={viewAllRewardsDestination} onRemove={onRemove} />
          </div>
          : <h3 className="no-rewards-message">You have no Rewards to use at this time. Start shopping now to begin earning points.</h3>
        }

        <CouponModal isMobile={isMobile} coupon={viewingDetailsCoupon} isOpen={viewingDetailsCoupon !== null} onClose={this.handleCloseViewModal} />

        <FooterLinks />
      </div>
    );
  }
}

export {EarnedRewards};
