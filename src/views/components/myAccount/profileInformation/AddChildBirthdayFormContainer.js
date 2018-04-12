/**
 * @module AddChildBirthdayFormContainer
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import {PropTypes} from 'prop-types';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {AddChildBirthdayForm} from './AddChildBirthdayForm.jsx';
import {getAccountFormOperator} from 'reduxStore/storeOperators/formOperators/accountFormOperator.js';

const PROP_TYPES = {
  onAdded: PropTypes.func.isRequired
};

function mapStateToProps (state, ownProps, storeOperators) {
  let {onAdded} = ownProps;
  let timestamp = new Date();
  return {
    timestamp,
    onSubmit: storeOperators.accountFormOperator.submitAddChild,
    onSubmitSuccess: onAdded,
    initialValues: {
      timestamp
    }
  };
}

let AddChildBirthdayFormContainer = connectPlusStoreOperators({
  accountFormOperator: getAccountFormOperator
}, mapStateToProps)(AddChildBirthdayForm);
AddChildBirthdayFormContainer.propTypes = {...AddChildBirthdayFormContainer.propTypes, ...PROP_TYPES};

export {AddChildBirthdayFormContainer};
