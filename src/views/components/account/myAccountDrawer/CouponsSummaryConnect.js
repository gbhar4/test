/** @module CouponsSummaryConnect
 *
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * @author Ben
 * @author Florencia Acosta <facosta@minutentag.com>
 * NOTE: This connector was created to reuse the container, both for checkout and my account section.
 */

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {couponsAndPromosStoreView} from 'reduxStore/storeViews/couponsAndPromosStoreView';
import {getCouponsAndPromosFormOperator} from 'reduxStore/storeOperators/formOperators/couponsAndPromosFormOperators.js';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';

function mapStateToProps (state, ownProps, storeOperators) {
  // let availableCoupons = couponsAndPromosStoreView.getAvailableCouponsAndPromos(state);
  let availableCoupons = couponsAndPromosStoreView.getAvailableAndStartedCouponsAndPromos(state);

  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    coupons: availableCoupons,
    couponsApplied: couponsAndPromosStoreView.getAppliedCouponsAndPromos(state),
    onApplyCoupon: storeOperators.couponsAndPromosFormOperator.submitCode,
    onRemoveCode: storeOperators.couponsAndPromosFormOperator.submitRemoveCode,
    isPromosLoaded: couponsAndPromosStoreView.isPromosLoaded(state),
    isRewardsEnabled: sitesAndCountriesStoreView.getCurrentCountry(state) !== 'CA'
  };
}

let CouponsSummaryConnect = connectPlusStoreOperators(
  {couponsAndPromosFormOperator: getCouponsAndPromosFormOperator}
  , mapStateToProps
);

export {CouponsSummaryConnect};
