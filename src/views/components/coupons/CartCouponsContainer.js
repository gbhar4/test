/**
 * @module CartCouponsContainer
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * Exports the container component for the CartCoupons component,
 * connecting state to it's props.
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {CartCoupons} from './CartCoupons.jsx';
import {couponsAndPromosStoreView} from 'reduxStore/storeViews/couponsAndPromosStoreView';
import {getCouponsAndPromosFormOperator} from 'reduxStore/storeOperators/formOperators/couponsAndPromosFormOperators.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    appliedCoupons: couponsAndPromosStoreView.getAppliedCouponsAndPromos(state),
    // availableCoupons: couponsAndPromosStoreView.getAvailableCouponsAndPromos(state),
    availableCoupons: couponsAndPromosStoreView.getAvailableAndStartedCouponsAndPromos(state),
    onApplyCoupon: storeOperators.couponsAndPromosFormOperator.submitCode,
    onRemoveCode: storeOperators.couponsAndPromosFormOperator.submitRemoveCode
  };
}

let CartCouponsContainer = connectPlusStoreOperators(
  {couponsAndPromosFormOperator: getCouponsAndPromosFormOperator}, mapStateToProps)(CartCoupons);

export {CartCouponsContainer};
