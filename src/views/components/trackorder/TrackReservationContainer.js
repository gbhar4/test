/**
 * @author Agu
 */
import {TrackOrder} from './TrackOrder.jsx';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {globalSignalsStoreView} from 'reduxStore/storeViews/globalSignalsStoreView';
import {getGlobalComponentsFormOperator} from 'reduxStore/storeOperators/formOperators/globalComponentsFormOperator';
import {getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';

let validateMethod = createValidateMethod(getStandardConfig([{'emailAddress': 'emailAddressNoAsync'}, {orderNumber: 'reservationOrderId'}]));

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    form: 'TrackReservationForm',  // a unique identifier for this form
    ...validateMethod,
    isOpen: globalSignalsStoreView.getIsTrackReservationVisible(state),
    isMobile: routingInfoStoreView.getIsMobile(state),
    isGuest: userStoreView.isGuest(state),
    onSubmit: storeOperators.globalComponentsFormOperator.submitReservationForTracking,
    openTrackOrderModal: storeOperators.globalSignalsOperator.openTrackReservationModal,
    closeTrackOrderModal: storeOperators.globalSignalsOperator.closeTrackReservationModal,
    openLoginModal: storeOperators.globalSignalsOperator.openLoginForTrackOrder
  };
}

let TrackReservationContainer = connectPlusStoreOperators(
  {
    globalComponentsFormOperator: getGlobalComponentsFormOperator,
    globalSignalsOperator: getGlobalSignalsOperator
  },
  mapStateToProps
)(TrackOrder);

export {TrackReservationContainer};
