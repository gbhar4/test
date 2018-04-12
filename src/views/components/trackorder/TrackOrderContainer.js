/**
 * @author Ben
 */
import {TrackOrder} from './TrackOrder.jsx';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {globalSignalsStoreView} from 'reduxStore/storeViews/globalSignalsStoreView';
import {getGlobalComponentsFormOperator} from 'reduxStore/storeOperators/formOperators/globalComponentsFormOperator';
import {getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isOpen: globalSignalsStoreView.getIsTrackOrderVisible(state),
    isMobile: routingInfoStoreView.getIsMobile(state),
    isGuest: userStoreView.isGuest(state),
    onSubmit: storeOperators.globalComponentsFormOperator.submitOrderForTracking,

    openTrackOrderModal: storeOperators.globalSignalsOperator.openTrackOrderModal,
    closeTrackOrderModal: storeOperators.globalSignalsOperator.closeTrackOrderModal,
    openLoginModal: storeOperators.globalSignalsOperator.openLoginForTrackOrder
  };
}

let TrackOrderContainer = connectPlusStoreOperators(
  {
    globalComponentsFormOperator: getGlobalComponentsFormOperator,
    globalSignalsOperator: getGlobalSignalsOperator
  },
  mapStateToProps
)(TrackOrder);

export {TrackOrderContainer};
