/**
 * @module Plcc Landing Container
 * @author Agu
 */

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {LandingPLCC} from './LandingPLCC.jsx';
import {userStoreView} from 'reduxStore/storeViews/userStoreView.js';
import {getVendorFormOperator} from 'reduxStore/storeOperators/formOperators/vendorFormOperator.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isHasPlcc: userStoreView.getUserIsPlcc(state),
    isShowApplyButton: generalStoreView.getIsWicFormEnabled(state),
    isPrescreenEnabled: generalStoreView.getIsPrescreenFormEnabled(state),
    onPrescreenSubmit: storeOperators.vendorFormOperator.submitPrescreenCode,
    isMobile: routingInfoStoreView.getIsMobile(state)
  };
}

let LandingPLCCContainer = connectPlusStoreOperators({
  vendorFormOperator: getVendorFormOperator
}, mapStateToProps)(LandingPLCC);

export {LandingPLCCContainer};
