/** @module ShippingMethodFormSectionContainer
 *
 * @author Agustin H. Andina Silva <asilva@minutentag.com>
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {ShippingMethodFormSection} from './ShippingMethodFormSection.jsx';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView.js';
import {getCheckoutFormOperator} from 'reduxStore/storeOperators/formOperators/checkoutFormOperator.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    optionsMap: checkoutStoreView.getShippingMethods(state),
    onChange: storeOperators.checkoutFormOperator.submitShippingMethod
  };
}

let ShippingMethodFormSectionContainer = connectPlusStoreOperators({
  checkoutFormOperator: getCheckoutFormOperator
}, mapStateToProps)(ShippingMethodFormSection);
ShippingMethodFormSectionContainer.defaultValidation = ShippingMethodFormSection.defaultValidation;
export {ShippingMethodFormSectionContainer};
