/**
* @module Email Us - Help Center
* @summary
* @author Oliver Ramirez
* @author Agu
* @author Damian <drossi@minutentag.com>
**/

import React from 'react';
import {PropTypes} from 'prop-types';
import {reduxForm, Field, propTypes as reduxFormPropTypes} from 'redux-form';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {CustomSelect} from 'views/components/common/form/CustomSelect.jsx';
import {LabeledTextArea} from 'views/components/common/form/LabeledTextArea.jsx';

import {getStandardConfigRules, getStandardConfigAsync, getStandardConfigMessages} from 'util/formsValidation/validatorStandardConfig';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {SuccessMessage} from 'views/components/common/SuccessMessage.jsx';
import {scrollToFirstFormError} from 'util/formsValidation/scrollToFirstFormError';

import {AdaptiveField} from 'reduxStore/util/AdaptiveField';
import {getAdaptiveFormPart} from 'reduxStore/util/adaptiveFormPart.js';
import cssClassName from 'util/viewUtil/cssClassName.js';
import {PAGES} from 'routing/routes/pages.js';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.email-us.scss');
} else {
  require('./_m.email-us.scss');
}

let AdditionalFieldsFormPart = getAdaptiveFormPart((props) => {
  if (props.subject === 'orderstatus') {
    return (<div>
      <Field name="orderNumber" component={LabeledInput} className="input-order-number" title="Online Order Number" />
      <Field name="orderTrackingNumber" component={LabeledInput} className="input-tracking-number" title="Original Tracking Number" />
    </div>);
  } else if (props.subject === 'returns') {
    return (<Field name="orderNumber" component={LabeledInput} className="input-order-number" title="Online Order Number" />);
  } else if (props.subject === 'store') {
    return (<Field name="storeNameOrAddress" component={LabeledInput} className="input-store-name" title="Store Name / Address" />);
  } else if (props.subject === 'merchandise') {
    return (<Field name="merchandiseNumber" component={LabeledInput} className="input-merchandise-number" title="Gift Card Number or Merchandise Credit Number" />);
  }

  return null;
});

let NoticeOrSubmitFormPart = getAdaptiveFormPart((props) => {
  // FIXME: get values from storeview or something
  if (props.subject !== 'myPlaceRewards' || props.reasonCode !== 'MyPLACE Rewards Credit Card') {
    let {pristine, submitting, submitSucceeded} = props;

    return (<div>
      <Field name="message" component={LabeledTextArea} title="Message" className="textarea-box" />

      <button type="submit" disabled={pristine || submitting} title="Submit" className="button-submit button-secondary">Submit</button>

      {submitSucceeded && <SuccessMessage message="Thank You For Contacting The Children's Place. Your email has been sent to our customer care team" />}
    </div>);
  }

  return (<ErrorMessage className="error-box credit-card-notice" error="The Children's Place Customer Service Team does not have access to credit card account information. For assistance with your myPlace Rewards credit card account, please call 1-866-254-9967." />);
});

class _EmailUsForm extends React.Component {
  static propTypes = {
    emailSubjectAndReason: PropTypes.array.isRequired,
    optionsMapSubject: PropTypes.array.isRequired,
    optionsMapReasonCode: PropTypes.array.isRequired,
    isMobile: PropTypes.bool.isRequired,
    ...reduxFormPropTypes
  }

  constructor (props, context) {
    super(props, context);

    this.state = {
      submitSucceeded: false
    };

    this.mapValuesToAdditionalFieldsProps = this.mapValuesToAdditionalFieldsProps.bind(this);
    this.mapValuesToReasonProps = this.mapValuesToReasonProps.bind(this);
    this.getOptionsMapSubject = this.getOptionsMapSubject.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.cleanReasonCode = this.cleanReasonCode.bind(this);
  }

  getOptionsMapSubject () {
    let {emailSubjectAndReason, isCanada} = this.props;
    let unusedItem = isCanada ? emailSubjectAndReason.find((entry) => entry.id === 'myPlaceRewards') : emailSubjectAndReason.find((entry) => entry.id === 'airmiles');

    let optionsMap = [];
    Object.keys(emailSubjectAndReason).map((key, index) => {
      unusedItem.id !== emailSubjectAndReason[key].id && optionsMap.push({
        value: emailSubjectAndReason[key].id,
        content: <span>{emailSubjectAndReason[key].content}</span>,
        title: emailSubjectAndReason[key].content
      });
    });

    return optionsMap;
  }

  mapValuesToAdditionalFieldsProps (values) {
    return values;
  }

  mapValuesToReasonProps (values) {
    let selectedSubject = this.props.emailSubjectAndReason.find((option) => option.id === values.subject);

    return {
      optionsMap: selectedSubject ? selectedSubject.reasons.map((entry) => {
        return {
          value: entry.id,
          content: <span>{entry.content}</span>,
          title: entry.content
        };
      }) : []
    };
  }

  handleSubmit (event) {
    event.preventDefault();

    this.props.handleSubmit((formData) => {
      return this.props.onSubmit(formData).then(() => {
        this.setState({
          submitSucceeded: true
        });

        setTimeout(() => {
          this.setState({
            submitSucceeded: false
          });
        }, 5000);

        this.props.reset();
        this.props.untouch();
      });
    })();
  }

  cleanReasonCode () {
    this.props.change('reasonCode', '');
    this.props.untouch('reasonCode');
  }

  render () {
    let {pristine, submitting, error, isMobile} = this.props;
    let {submitSucceeded} = this.state;
    let titleClassName = cssClassName(
      'email-title ',
      {'viewport-container': !isMobile}
    );

    let formClassName = cssClassName(
      'email-us-form-container ',
      {'viewport-container': !isMobile}
    );

    return (
      <section className="email-us-container">
        <div className="email-us-header">
          <h1 className={titleClassName}>Email Us</h1>
        </div>

        <div className={formClassName}>
          <p className="email-notice">At The Children's Place, we value your feedback. if you have any questions, comments, or concerns, please fill out the form below and an agent will address your inquiry as promptly as possible.</p>
          <p className="email-notice">The Children's Place has an Unsolicited Ideas Policy. To read this policy, click <HyperLink destination={PAGES.helpCenter} pathSuffix="#policies" className="policy-click">here</HyperLink></p>

          <form onSubmit={this.handleSubmit} className="email-us-form">
            {error && <ErrorMessage error={error} />}

            <Field name="firstName" component={LabeledInput} className="input-first-name" title="First Name" />
            <Field name="lastName" component={LabeledInput} className="input-last-name" title="Last Name" />

            <Field name="emailAddress" component={LabeledInput} title="Email Address" type="text" />
            <Field name="confirmEmailAddress" component={LabeledInput} title="Confirm Email Address" type="text" />

            <Field name="phoneNumber" component={LabeledInput} title="Phone Number (optional)" type="tel" />

            <Field name="subject" onChange={this.cleanReasonCode} component={CustomSelect} optionsMap={this.getOptionsMapSubject()} className="subject" title="Subject" placeholder="Select a Subject" />

            <AdditionalFieldsFormPart adaptTo="subject" mapValuesToProps={this.mapValuesToAdditionalFieldsProps} />

            <AdaptiveField name="reasonCode" component={CustomSelect} className="reason-code"
              title="Reason Code" placeholder="Select a Reason"
              adaptTo="subject" mapValuesToProps={this.mapValuesToReasonProps} />

            <NoticeOrSubmitFormPart adaptTo="subject,reasonCode" mapValuesToProps={this.mapValuesToAdditionalFieldsProps} pristine={pristine} submitting={submitting} submitSucceeded={submitSucceeded} />
          </form>
        </div>
      </section>
    );
  }
}

let validateMethod = createValidateMethod({
  rules: {
    ...getStandardConfigRules(['firstName', 'lastName', 'emailAddress', 'confirmEmailAddress', 'phoneNumber', 'message', 'subject', 'reasonCode', 'orderNumber', {'orderTrackingNumber': 'trackingNumber'}]),
    storeNameOrAddress: {
      required: true,
      address: true
    },
    merchandiseNumber: {
      required: true,
      number: true
    },
    phoneNumber: {
      required: false
    },
    subject: {
      required: true
    },
    reasonCode: {
      required: true
    },
    message: {
      required: true
    }
  },
  asyncValidators: getStandardConfigAsync(['emailAddress'], true),
  messages: {
    ...getStandardConfigMessages(['firstName', 'lastName', 'emailAddress', 'confirmEmailAddress', 'phoneNumber', 'subject', 'reasonCode', 'orderNumber', {'orderTrackingNumber': 'trackingNumber'}]),
    storeNameOrAddress: 'Please enter order store name or address',
    merchandiseNumber: 'Please enter gift card or merchandise number',
    message: 'Please enter a message so we can better assist you'
  }
});

let EmailUsForm = reduxForm({
  form: 'emailUsForm',
  onSubmitFail: (errors, dispatch, submitError, props) => scrollToFirstFormError(props.form),
  ...validateMethod
})(_EmailUsForm);

export {EmailUsForm};
