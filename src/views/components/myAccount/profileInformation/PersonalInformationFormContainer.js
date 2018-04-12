/**
 * @module PersonalInformationFormContainer
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import {PropTypes} from 'prop-types';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {PersonalInformationForm} from './PersonalInformationForm.jsx';
import {userStoreView} from 'reduxStore/storeViews/userStoreView.js';
import {getAccountFormOperator} from 'reduxStore/storeOperators/formOperators/accountFormOperator.js';

const PROP_TYPES = {
  onUpdated: PropTypes.func.isRequired
};

function mapStateToProps (state, ownProps, storeOperators) {
  let {onUpdated} = ownProps;
  let contactInfo = userStoreView.getUserContactInfo(state);
  let airMiles = userStoreView.getAirmilesDetails(state);
  let associateId = userStoreView.getAssociateId(state);
  return {
    onSubmit: storeOperators.accountFormOperator.submitPersonalInfo,
    onSubmitSuccess: onUpdated,
    initialValues: {
      ...contactInfo,
      airMilesAccountNumber: airMiles ? airMiles.accountNumber : '',
      associateId: associateId,
      isEmployee: !!associateId
    }
  };
}

let PersonalInformationFormContainer = connectPlusStoreOperators({
  accountFormOperator: getAccountFormOperator
}, mapStateToProps)(PersonalInformationForm);
PersonalInformationFormContainer.propTypes = {...PersonalInformationFormContainer.propTypes, ...PROP_TYPES};

export {PersonalInformationFormContainer};
