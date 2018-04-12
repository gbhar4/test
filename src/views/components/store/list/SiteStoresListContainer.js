/** @module SiteStoresListContainer
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 * @author Miguel <malvarez@minutentag.com>
 */

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {SiteStoresList} from './SiteStoresList.jsx';
import {storesStoreView} from 'reduxStore/storeViews/storesStoreView.js';
import {routingConstants} from 'routing/routingConstants.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';

function mapStateToProps (state) {
  return {
    usStoresByState: storesStoreView.getStoresSummary(state, routingConstants.siteIds.us),
    caStoresByState: storesStoreView.getStoresSummary(state, routingConstants.siteIds.ca),
    isMobile: routingInfoStoreView.getIsMobile(state),
    isCanada: sitesAndCountriesStoreView.getIsCanada(state)
  };
}

let SiteStoresListContainer = connectPlusStoreOperators(mapStateToProps)(SiteStoresList);

export {SiteStoresListContainer};
