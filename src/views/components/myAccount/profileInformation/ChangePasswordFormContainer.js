/**
 * @module ChangePasswordFormContainer
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import {PropTypes} from 'prop-types';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {ChangePasswordForm} from './ChangePasswordForm.jsx';
import {getUserFormOperator} from 'reduxStore/storeOperators/formOperators/userFormOperator.js';

const PROP_TYPES = {
  onUpdated: PropTypes.func.isRequired
};

function mapStateToProps (state, ownProps, storeOperators) {
  let {onUpdated} = ownProps;
  return {
    onSubmit: storeOperators.userFormOperator.submitNewPassword,
    onSubmitSuccess: onUpdated
  };
}

let ChangePasswordFormContainer = connectPlusStoreOperators({
  userFormOperator: getUserFormOperator
}, mapStateToProps)(ChangePasswordForm);
ChangePasswordFormContainer.propTypes = {...ChangePasswordFormContainer.propTypes, ...PROP_TYPES};

export {ChangePasswordFormContainer};
