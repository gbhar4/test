/**
 * @module AddChildBirthdayForm
 * @summary a form to add child birthdays to receive saving offers in My Account
 * Profile Information.
 *
 * @author Oliver Ramirez
 * @author Miguel <malvarez@d3sistemas.com.ar>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {LabeledCheckbox} from 'views/components/common/form/LabeledCheckbox.jsx';
import {LabeledSelect} from 'views/components/common/form/LabeledSelect.jsx';
import {getStandardConfigRules, getStandardConfigMessages} from 'util/formsValidation/validatorStandardConfig';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {MONTH_OPTIONS_MAP, MY_ACCOUNT_PROFILE_CHILD_GENDERS} from './Constants';
import {scrollToFirstFormError} from 'util/formsValidation/scrollToFirstFormError';
import {PAGES} from 'routing/routes/pages.js';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';

class _AddChildBirthdayForm extends React.Component {

  static propTypes = {
    /** timestamp for the digital signature */
    timestamp: PropTypes.instanceOf(Date).isRequired,
    /** callback to call when cancelling the form */
    onCancel: PropTypes.func,
    /** props passed by the wrapping redux form */
    ...reduxFormPropTypes
  }

  static timestampFormatOptions = {
    timeZoneName: 'short'
  }

  constructor (props) {
    super(props);
    this.timestamp = props.timestamp;
  }

  render () {
    let {error, handleSubmit, onCancel} = this.props;

    let currentYear = (new Date()).getFullYear();
    let yearOptionsMap = Array(17).fill(currentYear).map((e, index) => {
      let year = e - index;
      return {id: year + '', displayName: year + ''};
    });
    let monthOptionsMap = MONTH_OPTIONS_MAP;
    let genderOptions = [
      {id: MY_ACCOUNT_PROFILE_CHILD_GENDERS.MALE, displayName: 'Boy'},
      {id: MY_ACCOUNT_PROFILE_CHILD_GENDERS.FEMALE, displayName: 'Girl'}
    ];

    return (
      <form onSubmit={handleSubmit} className="birthday-add-new-container">
        <h4 className="add-a-child-title">Add a child</h4>
        {error && <ErrorMessage error={error} />}
        <div className="field-container">
          <Field component={LabeledInput} name="childName" className="input-child-name"
            title="Child's Name" />
          <div className="select-birthday-container">
            <span className="select-birthday-title">Birthday</span>
            <Field component={LabeledSelect} name="birthMonth" title=""
              className="select-month" placeholder="mm" optionsMap={monthOptionsMap} />
            <Field component={LabeledSelect} name="birthYear" title="" className="select-year"
              placeholder="yyyy" optionsMap={yearOptionsMap} />
          </div>
          <Field component={LabeledSelect} name="gender" title="Gender" className="input-gender"
            placeholder="choose" optionsMap={genderOptions} />
        </div>

        <div className="field-container field-container-with-signature">
          <h4 className="digital-signature-title">Digital Signature</h4>
          <Field component={LabeledInput} name="digitalSignatureFirstName" className="input-first-name"
            title="First Name" />
          <Field component={LabeledInput} name="digitalSignatureLastName" className="input-last-name"
            title="Last Name" />
          <aside className="timestamp-container">Timestamp <strong className="timestamp-date">{this.timestamp.toLocaleString('en-US', _AddChildBirthdayForm.timestampFormatOptions)}</strong></aside>
          <Field component={LabeledCheckbox} name="agreeTermAndConditions" className="checkbox-term-and-conditions"
            title={
              <span>By entering your name and pressing "Add Child," you are signing this record and verifying to The Children's Place that you are (1) the parent or legal guardian of the child(ren) listed above, and (2) consenting to register yourself and the child(ren) listed above into the Birthday Savings.
                <br />
                <HyperLink destination={PAGES.helpCenter} pathSuffix="#policies" className="term-and-conditions-link" alt="Privacy Policy">
                  Privacy</HyperLink> | <HyperLink destination={PAGES.helpCenter} pathSuffix="#faq" className="term-and-conditions-link" alt="Frequently Asked Questions">Frequently Asked Questions</HyperLink>
              </span>
            } />
          <Field component={LabeledInput} title="" type="hidden" name="timestamp" />
        </div>

        <div className="button-container">
          <button className="button-cancel-information" onClick={onCancel}>Cancel</button>
          <button type="submit" className="button-add">Add Child</button>
        </div>
      </form>
    );
  }
}

let validateMethod = createValidateMethod({
  rules: {
    ...getStandardConfigRules([{'agreeTermAndConditions': 'termsAndConditions'}, {'childName': 'firstName'}]),
    digitalSignatureFirstName: {
      nonEmpty: true,
      name: true,
      maxLength: 50
    },
    birthMonth: {
      required: true
    },
    birthYear: {
      required: true
    },
    gender: {
      required: true
    },
    digitalSignatureLastName: {
      nonEmpty: true,
      name: true,
      maxLength: 50
    }
  },
  messages: getStandardConfigMessages([
    {'agreeTermAndConditions': 'agreeTermAndConditions'},
    {'childName': 'childName'},
    {'digitalSignatureFirstName': 'firstName'},
    {'digitalSignatureLastName': 'lastName'},
    {'birthMonth': 'birthMonth'},
    {'birthYear': 'birthYear'},
    {'gender': 'gender'}
  ])
});

let AddChildBirthdayForm = reduxForm({
  form: 'addChildForm',
  ...validateMethod,
  onSubmitFail: (errors, dispatch, submitError, props) => scrollToFirstFormError(props.form)
})(_AddChildBirthdayForm);

export {AddChildBirthdayForm};
