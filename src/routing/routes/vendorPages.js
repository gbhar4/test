/** @module
  * @author Oliver
 */
import {vendorRoutingStoreView} from 'reduxStore/storeViews/routing/vendorRoutingStoreView';

export const VENDOR_PAGES = {

  internationalOrdersHistory: {
    pathCreateMethod: vendorRoutingStoreView.getInternationalOrdersHistoryURL
  },
  getDirectionsGoogleMap: {
    pathCreateMethod: vendorRoutingStoreView.getDirectionsGoogleMapURL
  }

};
