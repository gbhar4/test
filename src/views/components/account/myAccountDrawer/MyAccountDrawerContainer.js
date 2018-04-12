/** @module MyAccountDrawerContainer
 * @author Ben
 */
import {MyAccountDrawer} from './MyAccountDrawer.jsx';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {getUserFormOperator} from 'reduxStore/storeOperators/formOperators/userFormOperator';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';
import {getGeneralOperator} from 'reduxStore/storeOperators/generalOperator';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';

// myaccount new routing // FIXME: Mike change it to the new routing.

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isRewardsEnabled: sitesAndCountriesStoreView.isRewardsEnabled(state),
    onCloseClick: storeOperators.generalOperator.closeDrawersAndGoToAccountOverview,
    isMobile: routingInfoStoreView.getIsMobile(state),
    firstName: userStoreView.getUserContactInfo(state).firstName
  };
}

let MyAccountDrawerContainer = connectPlusStoreOperators({
  userFormOperator: getUserFormOperator,
  generalOperator: getGeneralOperator
}, mapStateToProps)(MyAccountDrawer);

export {MyAccountDrawerContainer};
