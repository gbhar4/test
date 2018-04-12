/** @module OffersAndCouponsContainer
 *
 * @author Damian <drossi@minutentag.com>
 * @author Miguel <malvarez@minutentag.com>
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {OffersAndCoupons} from './OffersAndCoupons.jsx';
import {couponsAndPromosStoreView} from 'reduxStore/storeViews/couponsAndPromosStoreView';
import {getCouponsAndPromosFormOperator} from 'reduxStore/storeOperators/formOperators/couponsAndPromosFormOperators.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    offersAndCoupons: couponsAndPromosStoreView.getPlaceCashAndPublicCoupons(state),
    onApplyCouponToBag: storeOperators.couponsAndPromosFormOperator.submitCode,
    onRemove: storeOperators.couponsAndPromosFormOperator.submitRemoveCode
  };
}

let OffersAndCouponsContainer = connectPlusStoreOperators(
  {couponsAndPromosFormOperator: getCouponsAndPromosFormOperator},
  mapStateToProps)(OffersAndCoupons);

export {OffersAndCouponsContainer};
