/** @module GiftWrappingFormSectionContainer
 *
 * @author Michael Citro
 */
import { connectPlusStoreOperators } from 'reduxStore/util/connectPlusStoreOperators';
import { StickyNotification } from '../../common/StickyNotification';
import { checkoutStoreView } from 'reduxStore/storeViews/checkoutStoreView';
import { getCheckoutOperator } from 'reduxStore/storeOperators/checkoutOperator.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    message: checkoutStoreView.getAlertMessage(state),
    handleCloseNotification: storeOperators.checkoutOperator.clearAlertMessage,
    isCloseEnabled: true,
    handleScroll: false // lets not make stick unless we have to.
  };
}

let CheckoutNotificationContainer = connectPlusStoreOperators({
  checkoutOperator: getCheckoutOperator
}, mapStateToProps)(StickyNotification);

export { CheckoutNotificationContainer };
