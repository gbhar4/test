/** @module AccountOverviewContainer
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 */

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {AccountOverview} from './AccountOverview.jsx';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    isCanada: sitesAndCountriesStoreView.getIsCanada(state)
  };
}

let AccountOverviewContainer = connectPlusStoreOperators(mapStateToProps)(AccountOverview);

export {AccountOverviewContainer};
