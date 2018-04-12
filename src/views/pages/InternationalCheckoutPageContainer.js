/** @module CheckoutWizardContainer
 *
 * @author Ben
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView';
import {InternationalCheckoutPage} from './InternationalCheckoutPage.jsx';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    apiUrl: checkoutStoreView.getInternationalCheckoutApiUrl(state),
    communicationUrl: checkoutStoreView.getInternationalCheckoutCommUrl(state),
    iframeUrl: checkoutStoreView.getInternationalCheckoutUrl(state),
    isLoading: generalStoreView.getIsLoading(state)
  };
}

let InternationalCheckoutPageContainer = connectPlusStoreOperators(mapStateToProps)(InternationalCheckoutPage);
export {InternationalCheckoutPageContainer};
