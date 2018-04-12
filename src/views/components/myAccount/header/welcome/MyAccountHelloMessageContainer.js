/** @module MyAccountHelloMessageContainer
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 */

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {MyAccountHelloMessage} from './MyAccountHelloMessage.jsx';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    isRewardsEnabled: sitesAndCountriesStoreView.isRewardsEnabled(state),
    firstName: userStoreView.getUserContactInfo(state).firstName
  };
}

let MyAccountHelloMessageContainer = connectPlusStoreOperators(mapStateToProps)(MyAccountHelloMessage);

export {MyAccountHelloMessageContainer};
