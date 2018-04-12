/** @module CommunicationPreferencesContainer
 *
 * @author Agu
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {CommunicationPreferences} from 'views/components/myAccount/communicationPreferences/CommunicationPreferences.jsx';
import {vendorRoutingStoreView} from 'reduxStore/storeViews/routing/vendorRoutingStoreView.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    iframeUrl: vendorRoutingStoreView.getCommunicationPreferencesURL(state)
  };
}

let CommunicationPreferencesContainer = connectPlusStoreOperators(mapStateToProps)(CommunicationPreferences);

export {CommunicationPreferencesContainer};
