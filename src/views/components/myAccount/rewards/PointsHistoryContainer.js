/** @module PointsHistoryContainer
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {PointsHistory} from './PointsHistory.jsx';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {getUserOperator} from 'reduxStore/storeOperators/userOperator';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView.js';
import {getGeneralOperator} from 'reduxStore/storeOperators/generalOperator.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    pointsTransactionsPages: userStoreView.getPointsHistoryPages(state),
    totalNumberOfPages: userStoreView.getPointsHistoryTotalPages(state),
    onGoToPage: storeOperators.userOperator.getPointsHistoryPage,
    isMobile: routingInfoStoreView.getIsMobile(state),
    successMessage: generalStoreView.getFlashSuccessMessage(state),
    errorMessage: generalStoreView.getFlashErrorMessage(state),
    onClearFlashMessage: storeOperators.generalOperator.clearFlashMessage
  };
}

let PointsHistoryContainer = connectPlusStoreOperators({
  userOperator: getUserOperator,
  generalOperator: getGeneralOperator
}, mapStateToProps)(PointsHistory);

export {PointsHistoryContainer};
