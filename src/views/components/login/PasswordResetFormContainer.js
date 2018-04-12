import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {PasswordResetForm} from './PasswordResetForm.jsx';
import {getUserFormOperator} from 'reduxStore/storeOperators/formOperators/userFormOperator';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    onSubmit: storeOperators.userFormOperator.submitResetPassword
  };
}

let PasswordResetFormContainer = connectPlusStoreOperators({
  userFormOperator: getUserFormOperator
}, mapStateToProps)(PasswordResetForm);

export {PasswordResetFormContainer};
