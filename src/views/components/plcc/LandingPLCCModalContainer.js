/**
 * @module Plcc Landing Container
 * @author Agu
 */

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {LandingPLCCModal} from './LandingPLCCModal.jsx';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {getGeneralOperator} from 'reduxStore/storeOperators/generalOperator';
import {getPlccOperator} from 'reduxStore/storeOperators/plccOperator.js';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView.js';
import {userStoreView} from 'reduxStore/storeViews/userStoreView.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    onAcceptPromo: storeOperators.plccOperator.submitAcceptWicOffer,
    onClose: storeOperators.generalOperator.closeCustomModal,
    isShowApplyButton: generalStoreView.getIsWicFormEnabled(state),
    isHasPlcc: userStoreView.getUserIsPlcc(state)
  };
}

let LandingPLCCModalContainer = connectPlusStoreOperators({
  generalOperator: getGeneralOperator,
  plccOperator: getPlccOperator
}, mapStateToProps)(LandingPLCCModal);

export {LandingPLCCModalContainer};
