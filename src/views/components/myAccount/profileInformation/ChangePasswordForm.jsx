/**
 * @module ChangePasswordForm
 * @summary a form for the user to change it's password.
 *
 * @author Miguel <malvarez@d3sistemas.com.ar>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {InputPassword} from 'views/components/common/form/InputPassword.jsx';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';

class _ChangePasswordForm extends React.Component {

  static propTypes = {
    /** callback to call when cancelling the form */
    onCancel: PropTypes.func,
    /** props passed by the wrapping redux form */
    ...reduxFormPropTypes
  }

  render () {
    let {
      error,
      handleSubmit,
      onCancel
    } = this.props;

    return (
      <form onSubmit={handleSubmit} className="personal-information-form">

        <div className="my-account-title-section profile-information-header">
          <h2 className="profile-information-title">Password</h2>
        </div>

        <p className="message-password">
          Your password must be at least 8 characters long, contain at least one
          uppercase letter, one number and one special character.<br />
          It cannot be your last used password or email.
        </p>

        {error && <ErrorMessage error={error} />}

        <Field component={InputPassword} name="currentPassword" title="Current Password" disabledTooltip />

        <Field isShowSuccessMessage successMessage="Looks Good" component={InputPassword} name="password" title="New Password" />

        <Field isShowSuccessMessage successMessage="Looks Good" component={InputPassword} name="confirmPassword" title="Confirm Password" disabledTooltip />

        <div className="button-container">
          <button type="button" className="button-cancel-information" onClick={onCancel}>Cancel</button>
          <button type="submit" className="button-save">Save</button>
        </div>
      </form>
    );
  }
}

let validateMethod = createValidateMethod(getStandardConfig([
  {'currentPassword': 'currentPassword'},
  'password',
  {'confirmPassword': 'confirmPassword'}
]));

let ChangePasswordForm = reduxForm({
  form: 'changePasswordForm',
  ...validateMethod
})(_ChangePasswordForm);

export {ChangePasswordForm};
