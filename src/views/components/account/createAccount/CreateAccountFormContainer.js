import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {CreateAccountForm} from './CreateAccountForm.jsx';
import {getUserFormOperator} from 'reduxStore/storeOperators/formOperators/userFormOperator';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {plccStoreView} from 'reduxStore/storeViews/plccStoreView.js';

function mapStateToProps (state, ownProps, storeOperators) {
  // DT-21869: if PLCC data is avaialble, we need to use as initial values for this form
  let application = plccStoreView.getApplication(state) || {};
  let {address} = application;

  return {
    onSubmit: ownProps.onSubmit || storeOperators.userFormOperator.submitRegister,
    plccCardNumber: userStoreView.getUserPlccCardNumber(state),
    country: sitesAndCountriesStoreView.getCurrentCountry(state),
    isCountryUS: sitesAndCountriesStoreView.getCurrentCountry(state) === 'US',
    initialValues: {
      ...address,
      emailAddress: application.emailAddress,
      phoneNumber: application.phoneNumber,
      rememberMe: true,
      savePlcc: true
    },
    isRewardsEnabled: sitesAndCountriesStoreView.isRewardsEnabled(state)
  };
}

let CreateAccountFormContainer = connectPlusStoreOperators({
  userFormOperator: getUserFormOperator
}, mapStateToProps)(CreateAccountForm);

export {CreateAccountFormContainer};
