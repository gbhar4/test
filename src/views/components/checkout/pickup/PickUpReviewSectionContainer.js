/**
 * @module PickUpReviewSectionContainer
 * @author Agustin H. Andina Silva <asilva@minutentag.com>
 * Exports the container component for the PickUpReviewSection component,
 * connecting state to it's props.
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {PickUpReviewSection} from './PickUpReviewSection.jsx';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView';

function mapStateToProps (state) {
  return {
    pickUpContactPerson: checkoutStoreView.getPickupValues(state)
  };
}

let PickUpReviewSectionContainer = connectPlusStoreOperators(mapStateToProps)(PickUpReviewSection);
PickUpReviewSectionContainer.defaultValidation = PickUpReviewSection.defaultValidation;
export {PickUpReviewSectionContainer};
