/**
 * @author Ben
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';

const mapStateToProps = function (state) {
  return {
    isMobile: routingInfoStoreView.getIsMobile(state)
  };
};
let isMobileConnect = connectPlusStoreOperators(mapStateToProps, {});   // the empty object supresses passing dowwn the 'dispatch' prop

export {isMobileConnect};
