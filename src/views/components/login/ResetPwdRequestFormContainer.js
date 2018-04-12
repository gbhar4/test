import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {ResetPwdRequestForm} from './ResetPwdRequestForm.jsx';
import {getUserFormOperator} from 'reduxStore/storeOperators/formOperators/userFormOperator';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';

// #if !STATIC2
function mapStateToProps (state, ownProps, storeOperators) {
  return {
    onSubmit: ownProps.onSubmit || storeOperators.userFormOperator.submitForgotPasswordEmailRequest,
    initialValues: {
      // FIXME: the initial values for the wrapped redux form
      // Should we try both the email of the user (if remembered) and the value entered in a
      // partially filled login form we may have come from? (look at stories)
      emailAddress: userStoreView.getUserEmail(state)
    }
  };
}

let ResetPwdRequestFormContainer = connectPlusStoreOperators(
  {userFormOperator: getUserFormOperator}, mapStateToProps)(ResetPwdRequestForm);
// #endif

//
//
//
// #if STATIC2
// --------------For Static Testing only------------------
import {formSubmitStub} from 'util/testUtil/formSubmitStub';
function mapStaticToProps () {
  return {
    initialValues: { // the initial values for the wrapped redux form
      emailAddress: window.store && window.store.user ? window.store && window.store.user.email : null
    },
    resetServerSuccess: window.store && window.store.user ? window.store && window.store.user.resetServerSuccess : null,
    onSubmit: formSubmitStub
  };
}
let ResetPwdRequestFormContainer =     // eslint-disable-line no-redeclare
  connectPlusStoreOperators(mapStaticToProps)(ResetPwdRequestForm);
// #endif

export {ResetPwdRequestFormContainer};
