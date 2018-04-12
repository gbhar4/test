/** @module PointsClaimFormContainer
 *
 * @author Damian <drossi@minutentag.com>
 * @author Miguel <malvarez@minutentag.com>
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {PointsClaimForm} from './PointsClaimForm.jsx';
import {rewardsStoreView} from 'reduxStore/storeViews/rewardsStoreView.js';
import {userStoreView} from 'reduxStore/storeViews/userStoreView.js';
import {
  getAccountFormOperator,
  POINTS_TRANSACTIONS_TYPES
} from 'reduxStore/storeOperators/formOperators/accountFormOperator.js';
import {getRoutingOperator} from 'reduxStore/storeOperators/routingOperator.js';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';

let transactionTypesMap = [
  {id: POINTS_TRANSACTIONS_TYPES.IN_STORE, displayName: 'In Store'},
  {id: POINTS_TRANSACTIONS_TYPES.ONLINE, displayName: 'Online'}
];

function mapStateToProps (state, ownProps, storeOperators) {
  // FIXME: we shouldn't create functions in mapStateToProps, but there currently
  // is no other way to grab to store in containers and pass it to the factory
  // method of operators.
  const redirectToPointsHistory =
    () => storeOperators.routing.pushLocation(MY_ACCOUNT_SECTIONS.myRewards.subSections.pointsHistory);

  return {
    user: userStoreView.getUserContactInfo(state),
    accountNumber: rewardsStoreView.getRewardsAccountNumber(state),
    onCancelClick: storeOperators.routing.goBack,
    onSubmit: storeOperators.accountForm.submitPointsClaim,
    onSubmitSuccess: redirectToPointsHistory,
    transactionTypesMap,
    initialValues: {
      transactionType: POINTS_TRANSACTIONS_TYPES.IN_STORE
    }
  };
}

let PointsClaimFormContainer = connectPlusStoreOperators({
  accountForm: getAccountFormOperator,
  routing: getRoutingOperator
}, mapStateToProps)(PointsClaimForm);

export {PointsClaimFormContainer};
