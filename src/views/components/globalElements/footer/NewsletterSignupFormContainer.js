/**
 * @module NavigationFooterContainer
 * @author Noam Man
 * Exports the container component for the NewsletterSignupFormContainer component
 */

import {NewsletterSignupForm} from './NewsletterSignupForm.jsx';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {globalSignalsStoreView} from 'reduxStore/storeViews/globalSignalsStoreView';
import {getGlobalComponentsFormOperator} from 'reduxStore/storeOperators/formOperators/globalComponentsFormOperator';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    onSubmit: storeOperators.globalComponentsFormOperator.submitNewsLetterSignup,
    isUpdating: globalSignalsStoreView.getIsNewsLetterSignUpUpdating(state),
    isConfirming: globalSignalsStoreView.getIsNewsLetterSignUpConfirming(state)
  };
}

let NewsletterSignupFormContainer = connectPlusStoreOperators(
  {globalComponentsFormOperator: getGlobalComponentsFormOperator}, mapStateToProps)(NewsletterSignupForm);

export {NewsletterSignupFormContainer};
