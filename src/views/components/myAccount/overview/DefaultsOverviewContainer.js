/** @module DefaultsOverviewContainer
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {DefaultsOverview} from './DefaultsOverview.jsx';
import {storesStoreView} from 'reduxStore/storeViews/storesStoreView.js';
import {addressesStoreView} from 'reduxStore/storeViews/addressesStoreView.js';
import {paymentCardsStoreView} from 'reduxStore/storeViews/paymentCardsStoreView.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';

function mapStateToProps (state) {
  return {
    defaultPaymentMethod: paymentCardsStoreView.getDefaultPaymentMethod(state),
    defaultShippingAddress: addressesStoreView.getDefaultAddress(state),
    defaultStore: storesStoreView.getDefaultStore(state),
    isMobile: routingInfoStoreView.getIsMobile(state),
    isCanada: sitesAndCountriesStoreView.getIsCanada(state)
  };
}

let DefaultsOverviewContainer = connectPlusStoreOperators(mapStateToProps)(DefaultsOverview);

export {DefaultsOverviewContainer};
