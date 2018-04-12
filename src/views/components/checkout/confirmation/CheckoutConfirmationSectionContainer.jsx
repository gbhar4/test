/**
* @module CheckoutConfirmationSectionContainer
* @author Agustin H. Andina Silva <asilva@minutentag.com>
*/
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {CheckoutConfirmationSection} from './CheckoutConfirmationSection.jsx';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {confirmationStoreView} from 'reduxStore/storeViews/confirmationStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';

const mapStateToProps = function (state, ownProps, storeOperators) {
  let isMobile = routingInfoStoreView.getIsMobile(state);
  let isGuest = userStoreView.isGuest(state);
  let emailAddress = confirmationStoreView.getOrderEmailAddress(state);
  let orderConfirmation = confirmationStoreView.getOrderConfirmation(state);
  let fullfilmentCentersMap = confirmationStoreView.getFullfilmentCentersMap(state);
  let holdDate = confirmationStoreView.getHoldDate(state);

  return {
    isGuest: isGuest,
    isMobile: isMobile,
    isOrderPending: orderConfirmation.isOrderPending,
    emailAddress: emailAddress,
    orderDetails: !fullfilmentCentersMap ? orderConfirmation.orderDetails : null,

    isRewardsEnabled: sitesAndCountriesStoreView.isRewardsEnabled(state),
    estimatedRewards: orderConfirmation.summary.estimatedRewards || 0,
    pointsToNextReward: orderConfirmation.summary.pointsToNextReward || 0,

    rewardsBanner: {
      contentSlotName: 'checkout_confirmation_MPR_promo'
    },

    banner: {
      contentSlotName: 'checkout_confirmation_banner'
    },

    isAirmilesEnabled: sitesAndCountriesStoreView.isAirMilesEnabled(state),
    airmiles: orderConfirmation.airmiles,

    orderNumbersByFullfillmentCenter: fullfilmentCentersMap ? {
      holdDate: holdDate,
      fullfillmentCenterMap: fullfilmentCentersMap
    } : null
  };
};

const CheckoutConfirmationSectionContainer = connectPlusStoreOperators(mapStateToProps)(CheckoutConfirmationSection);
export {CheckoutConfirmationSectionContainer};
