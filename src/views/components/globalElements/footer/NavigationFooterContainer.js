/**
 * @module NavigationFooterContainer
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * Exports the container component for the NavigationFooter component,
 * connecting state to it's props.
 */

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {NavigationFooter} from './NavigationFooter.jsx';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView';
import {getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';
import {getUserFormOperator} from 'reduxStore/storeOperators/formOperators/userFormOperator.js';

const mapStateToProps = function (state, ownProps, storeOperators) {
  return {
    footerNavigation: generalStoreView.getFooterNavigationTree(state),
    isMobile: routingInfoStoreView.getIsMobile(state),
    globalSignalsOperator: storeOperators.globalSignalsOperator,
    onSubmitLogout: storeOperators.userFormOperator.submitLogout
  };
};

let NavigationFooterContainer = connectPlusStoreOperators({
  globalSignalsOperator: getGlobalSignalsOperator,
  userFormOperator: getUserFormOperator
},
mapStateToProps)(NavigationFooter);

export {NavigationFooterContainer};
