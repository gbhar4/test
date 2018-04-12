/**
* @module ShippingReviewSectionContainer
* @author Agustin H. Andina Silva <asilva@minutentag.com>
*/
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {ShippingReviewSection} from './ShippingReviewSection.jsx';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView.js';

const mapStateToProps = function (state) {
  return {
    isGiftOptionsEnabled: checkoutStoreView.isGiftOptionsEnabled(state),
    shippingAddress: checkoutStoreView.getShippingDestinationValues(state),
    shippingMethod: checkoutStoreView.getSelectedShippingMethodDetails(state),
    giftWrappingDisplayName: checkoutStoreView.getSelectedGiftWrapDetails(state).displayName || 'N/A'
  };
};

let ShippingReviewSectionContainer = connectPlusStoreOperators(mapStateToProps)(ShippingReviewSection);
ShippingReviewSectionContainer.defaultValidation = ShippingReviewSection.defaultValidation;
export {ShippingReviewSectionContainer};
