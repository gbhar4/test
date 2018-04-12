/** @module LogoutLinkContainer
 * @author Ben
 */
import {LogoutLink} from './LogoutLink.jsx';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {getUserFormOperator} from 'reduxStore/storeOperators/formOperators/userFormOperator';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    firstName: userStoreView.getUserContactInfo(state).firstName,
    onLogoutSubmit: storeOperators.userFormOperator.submitLogout
  };
}

let LogoutLinkContainer = connectPlusStoreOperators(
  {userFormOperator: getUserFormOperator}, mapStateToProps
)(LogoutLink);

export {LogoutLinkContainer};
