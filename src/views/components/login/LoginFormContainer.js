import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {LoginForm} from './LoginForm.jsx';
import {getUserFormOperator} from 'reduxStore/storeOperators/formOperators/userFormOperator';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {plccStoreView} from 'reduxStore/storeViews/plccStoreView.js';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';

function mapStateToProps (state, ownProps, storeOperators) {
  // DT-21869: if PLCC data is avaialble, we need to use as initial values for this form
  // REVIEW: should we store PLCC response as user contact info (setContactInfo) even tho the user might be guest?
  let application = plccStoreView.getApplication(state) || {};

  return {
    onSubmit: ownProps.onSubmit || storeOperators.userFormOperator.submitLogin,
    plccCardNumber: userStoreView.getUserPlccCardNumber(state),
    isCountryUS: sitesAndCountriesStoreView.getCurrentCountry(state) === 'US',
    initialValues: {
      emailAddress: userStoreView.getUserEmail(state) || application.emailAddress,
      rememberMe: true,
      savePlcc: true
    }
  };
}

let LoginFormContainer = connectPlusStoreOperators({userFormOperator: getUserFormOperator}, mapStateToProps)(LoginForm);

export {LoginFormContainer};
