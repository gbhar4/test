/** @module ProfileInformationContainer
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {ProfileInformation} from './ProfileInformation.jsx';
import {storesStoreView} from 'reduxStore/storeViews/storesStoreView';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';
import {rewardsStoreView} from 'reduxStore/storeViews/rewardsStoreView.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';

function mapStateToProps (state) {
  let isCountryUs = sitesAndCountriesStoreView.isRewardsEnabled(state);
  return {
    personalInformation: userStoreView.getUserContactInfo(state),
    airMilesAccount: userStoreView.getAirmilesDetails(state).accountNumber,
    rewardsAccountNumber: isCountryUs ? rewardsStoreView.getRewardsAccountNumber(state) : null,
    defaultStore: storesStoreView.getDefaultStore(state),
    onEditDefaultStore: () => window.location.assign('/shop/AjaxStoreLocatorDisplayView?catalogId=10551&langId=-1&storeId=10151'),
    childrenBirthdays: userStoreView.getChildren(state),
    isCanada: sitesAndCountriesStoreView.getIsCanada(state),
    isMobile: routingInfoStoreView.getIsMobile(state)
  };
}

let ProfileInformationContainer = connectPlusStoreOperators(mapStateToProps)(ProfileInformation);

export {ProfileInformationContainer};
