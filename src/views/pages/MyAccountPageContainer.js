import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {MyAccountPage} from './MyAccountPage.jsx';
import {getGeneralOperator} from 'reduxStore/storeOperators/generalOperator.js';
import {getAccountOperator} from 'reduxStore/storeOperators/accountOperator.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    onEvalFlashMessageExpiration: storeOperators.general.evalFlashMessageExpiration,
    onProfileInfoTabMount: storeOperators.accountOperator.loadProfileInfoTabData,
    onReservationsTabMount: storeOperators.accountOperator.loadReversationTabData,
    onUSARewardsTabMount: storeOperators.accountOperator.loadUSARewardsTabData,
    onOrdersInfoTabMount: storeOperators.accountOperator.loadOrdersTabData
  };
}

let MyAccountPageContainer = connectPlusStoreOperators({
  general: getGeneralOperator,
  accountOperator: getAccountOperator
}, mapStateToProps)(MyAccountPage);

export {MyAccountPageContainer};
