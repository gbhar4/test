import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {EmailUsForm} from './EmailUsForm.jsx';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {getHelpCenterFormOperator} from 'reduxStore/storeOperators/formOperators/helpCenterFormOperator.js';
import {communicationStoreView} from 'reduxStore/storeViews/communicationStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    emailSubjectAndReason: communicationStoreView.getEmailSubjectAndReason(),
    isCanada: sitesAndCountriesStoreView.getIsCanada(state),
    onSubmit: storeOperators.helpCenterFormOperator.submitContactUsForm,
    isMobile: routingInfoStoreView.getIsMobile(state)
  };
}

let EmailUsFormContainer = connectPlusStoreOperators({
  helpCenterFormOperator: getHelpCenterFormOperator
}, mapStateToProps)(EmailUsForm);

export {EmailUsFormContainer};
