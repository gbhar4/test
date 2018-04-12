import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {CheckoutSummarySidebar} from './CheckoutSummarySidebar.jsx';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {couponsAndPromosStoreView} from 'reduxStore/storeViews/couponsAndPromosStoreView';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView.js';

function mapStateToProps (state) {
  return {
    isGuest: userStoreView.isGuest(state),
    isRemembered: userStoreView.isRemembered(state),
    isMobile: routingInfoStoreView.getIsMobile(state),
    quantityCouponsApplied: couponsAndPromosStoreView.getAppliedCouponsAndPromos(state).length,
    totalOrderSummary: cartStoreView.getSummary(state).orderBalanceTotal,
    hasAvailableCoupons: couponsAndPromosStoreView.getAvailableCouponsAndPromos(state).length > 0,
    isRewardsEnabled: sitesAndCountriesStoreView.isRewardsEnabled(state),
    isCouponFormEnabled: checkoutStoreView.isCouponFormEnabled(state),
    isAirMilesEnabled: sitesAndCountriesStoreView.isAirMilesEnabled(state)
  };
}

let CheckoutSummarySidebarContainer = connectPlusStoreOperators(
  mapStateToProps
)(CheckoutSummarySidebar);

export {CheckoutSummarySidebarContainer};
