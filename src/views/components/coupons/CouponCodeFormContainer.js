/**
 * @module CouponCodeFormContainer
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * @author Agu
 * Exports the container component for the CouponCodeForm component,
 * connecting state to it's props.
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {CouponCodeForm} from './CouponCodeForm.jsx';
import {getCouponsAndPromosFormOperator} from 'reduxStore/storeOperators/formOperators/couponsAndPromosFormOperators.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    onSubmit: storeOperators.couponsAndPromosFormOperator.submitCode
  };
}

const CouponCodeFormContainer = connectPlusStoreOperators(
  {couponsAndPromosFormOperator: getCouponsAndPromosFormOperator}, mapStateToProps)(CouponCodeForm);

export {CouponCodeFormContainer};
