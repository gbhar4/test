/** @module GiftWrappingFormSectionContainer
 *
 * @author Agustin H. Andina Silva <asilva@minutentag.com>
 * @author Ben
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {GiftWrappingFormSection} from './GiftWrappingFormSection.jsx';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView';

function mapStateToProps (state) {
  return {
    optionsMap: checkoutStoreView.getGiftWrapOptions(state)
  };
}

let GiftWrappingFormSectionContainer = connectPlusStoreOperators(mapStateToProps)(GiftWrappingFormSection);
GiftWrappingFormSectionContainer.defaultValidation = GiftWrappingFormSection.defaultValidation;
export {GiftWrappingFormSectionContainer};
