/**
 * @module CheckoutOrderSummaryContainer
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * Exports the container component for the CheckoutOrderSummary component, connecting
 * state to it's props.
 */
 
import {isSubmitting} from 'redux-form';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {CheckoutOrderSummary} from './CheckoutOrderSummary.jsx';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView';

const mapStateToProps = function (state) {
  return {
    isPayPalEnabled: false, // FIXME: storeview missin'
    showSubmitOrderButton: checkoutStoreView.getIsReviewStage(state),
    disableNext: isSubmitting('checkoutReview')(state)
  };
};

let CheckoutOrderSummaryContainer = connectPlusStoreOperators(mapStateToProps)(CheckoutOrderSummary);
export {CheckoutOrderSummaryContainer};
