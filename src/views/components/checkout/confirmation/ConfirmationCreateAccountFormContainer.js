import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {ConfirmationCreateAccountForm} from './ConfirmationCreateAccountForm.jsx';
import {getUserFormOperator} from 'reduxStore/storeOperators/formOperators/userFormOperator';
import {confirmationStoreView} from 'reduxStore/storeViews/confirmationStoreView.js';

function mapStateToProps (state, ownProps, storeOperators) {
  let userInformation = confirmationStoreView.getInitialCreateAccountValues(state);
  return {
    isPromptForUserDetails: !userInformation || !userInformation.firstName,
    emailAddress: userInformation.emailAddress || ownProps.emailAddress,
    onSubmit: (formValues) => {
      return storeOperators.userFormOperator.submitRegister({
        ...userInformation,
        ...formValues
      }, {
        redirect: false
      });
    },
    initialValues: {
      ...userInformation
    }
  };
}

let ConfirmationCreateAccountFormContainer = connectPlusStoreOperators({
  userFormOperator: getUserFormOperator
}, mapStateToProps)(ConfirmationCreateAccountForm);

export {ConfirmationCreateAccountFormContainer};
