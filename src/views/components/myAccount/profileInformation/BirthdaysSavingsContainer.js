/** @module BirthdaysSavingsContainer
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {BirthdaysSavings} from './BirthdaysSavings.jsx';
import {userStoreView} from 'reduxStore/storeViews/userStoreView.js';
import {getAccountFormOperator} from 'reduxStore/storeOperators/formOperators/accountFormOperator.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView.js';
import {getGeneralOperator} from 'reduxStore/storeOperators/generalOperator.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    childrenBirthdays: userStoreView.getChildren(state),
    onDeleteChildBirthday: storeOperators.accountFormOperator.submitDeleteChild,
    successMessage: generalStoreView.getFlashSuccessMessage(state),
    onClearSuccessMessage: storeOperators.generalOperator.clearFlashMessage
  };
}

let BirthdaysSavingsContainer = connectPlusStoreOperators({
  accountFormOperator: getAccountFormOperator,
  generalOperator: getGeneralOperator
}, mapStateToProps)(BirthdaysSavings);

export {BirthdaysSavingsContainer};
