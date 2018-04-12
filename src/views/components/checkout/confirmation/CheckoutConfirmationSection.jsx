/**
* @module CheckoutConfirmationSection
* @author Agustin H. Andina Silva <asilva@minutentag.com>
* Order confirmation page
*/

import React from 'react';
import {PropTypes} from 'prop-types';
import {ConfirmationThanksTitleDisplay} from './ConfirmationThanksTitleDisplay.jsx';
import {ConfirmationOrderNumberDisplay} from './ConfirmationOrderNumberDisplay.jsx';

import {OrderConfirmationLedgerContainer} from 'views/components/orderSummary/OrderConfirmationLedgerContainer.js';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';

import {ProductRecommendationsListContainer} from 'views/components/recommendations/ProductRecommendationsListContainer.js';

import {ConfirmationCreateAccountFormContainer} from './ConfirmationCreateAccountFormContainer.js';
// import {RewardsSummaryDisplay} from './RewardsSummaryDisplay.jsx';
// import {AirMilesSummaryDisplay} from './AirMilesSummaryDisplay.jsx';
import {PlaceCashSpotContainer} from 'views/components/checkout/PlaceCashSpotContainer.js';
import {ConfirmationOrderNumbersByFulfillmentList} from './ConfirmationOrderNumbersByFulfillmentList.jsx';
import cssClassName from 'util/viewUtil/cssClassName';

if (DESKTOP) { // eslint-disable-line
  require('./_d.checkout-confirmation.scss');
} else {
  require('./_m.checkout-confirmation.scss');
}

class CheckoutConfirmationSection extends React.Component {
  static propTypes = {
    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool,

    /** indicates rewards summary enabled */
    isRewardsEnabled: PropTypes.bool,

    /** indicates order payment is processing */
    isOrderPending: PropTypes.bool,

    /** email address of the user that placed the order */
    emailAddress: PropTypes.string.isRequired,

    /** shipped order only details */
    orderDetails: PropTypes.shape({
      date: PropTypes.instanceOf(Date).isRequired,
      orderNumber: PropTypes.string.isRequired,
      trackingLink: PropTypes.string.isRequired
    }).isRequired,

    banner: PropTypes.shape({
      contentSlotName: PropTypes.string.isRequired
    }).isRequired,

    /** earned rewards points with this order */
    estimatedRewards: PropTypes.number,
    pointsToNextReward: PropTypes.number,

    /** Espot details for rewards banner */
    rewardsBanner: PropTypes.shape({
      contentSlotName: PropTypes.string.isRequired
    }).isRequired,

    /** Canada Air Miles details -- It is not necessary */
    isAirmilesEnabled: PropTypes.bool.isRequired,
    airmiles: PropTypes.shape({
      accountNumber: PropTypes.string.isRequired,
      promoId: PropTypes.string.isRequired
    }),

    /** Bopis order details */
    orderNumbersByFullfillmentCenter: PropTypes.shape({
      holdDate: ConfirmationOrderNumbersByFulfillmentList.propTypes.holdDate,
      fullfillmentCenterMap: ConfirmationOrderNumbersByFulfillmentList.propTypes.fullfillmentCenterMap
    })
  }

  render () {
    let {isGuest, isMobile, isOrderPending, emailAddress, banner, orderNumbersByFullfillmentCenter
    /*, pointsToNextReward, estimatedRewards, rewardsBanner, isRewardsEnabled */} = this.props;
    let {date, orderNumber, trackingLink} = this.props.orderDetails || {};
    let containerClassName = cssClassName('confirmation-section ', !isMobile && 'viewport-container');

    let isShowShippingMessage = !!orderNumber;
    let isShowBopisMessage = orderNumbersByFullfillmentCenter && !orderNumbersByFullfillmentCenter.fullfillmentCenterMap.find((center) => !!center.shippingFullname);
    let isShowMixedMessage = orderNumbersByFullfillmentCenter && orderNumbersByFullfillmentCenter.fullfillmentCenterMap.find((center) => !!center.shippingFullname) && orderNumbersByFullfillmentCenter.fullfillmentCenterMap.find((center) => !center.shippingFullname);

    return (
      <div className={containerClassName}>
        <section className="checkout-content">
          <section className="confirmation-thanks">
            <ConfirmationThanksTitleDisplay emailAddress={emailAddress} isOrderPending={isOrderPending}
              isShowShippingMessage={isShowShippingMessage}
              isShowBopisMessage={isShowBopisMessage}
              isShowMixedMessage={isShowMixedMessage} />

            {orderNumber && <ConfirmationOrderNumberDisplay orderNumber={orderNumber} orderLink={trackingLink} orderDate={date} isGuest={isGuest} guestUserEmail={emailAddress} />}
            {orderNumbersByFullfillmentCenter && <ConfirmationOrderNumbersByFulfillmentList {...orderNumbersByFullfillmentCenter} isGuest={isGuest} />}
          </section>

          {!isMobile && <PlaceCashSpotContainer isConfirmation />}

          {/* NOTE: commented out as per requirement of DT-19520 */}
          {/* !isGuest && isRewardsEnabled && <RewardsSummaryDisplay estimatedRewards={estimatedRewards} pointsToNextReward={pointsToNextReward} banner={rewardsBanner} /> */}
        </section>

        <div className="checkout-order-summary">
          <OrderConfirmationLedgerContainer isCondense={false} isShowUndefinedTax isShowShipping />
        </div>

        {isMobile && <PlaceCashSpotContainer isConfirmation />}
        {isGuest && <ConfirmationCreateAccountFormContainer emailAddress={emailAddress} />}

        <ProductRecommendationsListContainer />

        {banner && <ContentSlot {...banner} className="confirmation-banner" />}
      </div>
    );
  }
}

export {CheckoutConfirmationSection};
