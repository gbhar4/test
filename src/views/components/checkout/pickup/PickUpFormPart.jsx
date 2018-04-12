/** @module PickUpFormPart
 * @summary a form part for selecting a pickup person for BOPIS.
 *
 * @author Agustin H. Andina Silva <asilva@minutentag.com>
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, FormSection} from 'redux-form';
import {PickupMainContactEditForm} from './PickupMainContactEditForm.jsx';
import {PickUpAlternateFormPart} from './PickUpAlternateFormPart.jsx';
import {LabeledCheckbox} from 'views/components/common/form/LabeledCheckbox.jsx';
import {ContactFormFields} from './ContactFormFields.jsx';
import {getAdaptiveFormPart} from 'reduxStore/util/adaptiveFormPart.js';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import cssClassName from 'util/viewUtil/cssClassName.js';
import {PAGES} from 'routing/routes/pages.js';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.checkout-review-pickup.scss');
} else {  // eslint-disable-line
  require('./_m.checkout-review-pickup.scss');
}

let MainContactForm = getAdaptiveFormPart(PickupMainContactEditForm);

// This is done to take away the briteVerify asyncValidation. In future if we have other asynv validators we will have to explicity just exclude the BV one
let { asyncValidators, ...otherValidators } = getStandardConfig(['firstName', 'lastName', 'emailAddress', 'phoneNumber']);

export class PickUpFormPart extends React.Component {
  static propTypes = {
    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool,
    isMobile: PropTypes.bool,
    error: PropTypes.string,
    isSMSActive: PropTypes.bool.isRequired,
    /** a method to change values in the form (comes from redux form) */
    change: PropTypes.func.isRequired,

    /**
     * A callback to call whenever switching between the read-only and editing an address modes.
     * Will accept a single Boolean parameter that is true when entering edit mode
     * and is false when exiting the edit mode.
     */
    onEditModeChange: PropTypes.func
  }

  static defaultValidation = {
    pickUpContact: otherValidators,
    pickUpAlternate: PickUpAlternateFormPart.defaultValidation
  }

  constructor (props) {
    super(props);

    this._workaround_ = true;

    this.state = {isEditing: props.isGuest};

    this.handleEditModeChange = this.handleEditModeChange.bind(this);
    this.exitEditMode = this.handleEditModeChange.bind(this, false);
    this.onEditMainContactSubmit = this.onEditMainContactSubmit.bind(this);
    this.mapValuesToMainContactFormProps = this.mapValuesToMainContactFormProps.bind(this);
  }

  mapValuesToMainContactFormProps (values) {
    return {
      initialValues: {
        firstName: values.firstName,
        lastName: values.lastName,
        emailAddress: values.emailAddress,
        phoneNumber: values.phoneNumber
      }
    };
  }

  handleEditModeChange (isEditing) {
    this.setState({isEditing: isEditing});
    if (this.props.onEditModeChange) {
      this.props.onEditModeChange(isEditing);
    }
  }

  onEditMainContactSubmit (values) {
    this.setState({isEditing: false});
    this._workaround_ = !this._workaround_;
    // this.currentContactDetails = {
    //   firstName: values.firstName,
    //   lastName: values.lastName,
    //   emailAddress: values.emailAddress,
    //   phoneNumber: values.pickUpContact.phoneNumber
    // };
    this.props.change('pickUpContact.firstName', values.firstName);
    this.props.change('pickUpContact.lastName', values.lastName);
    this.props.change('pickUpContact.emailAddress', values.emailAddress);
    this.props.change('pickUpContact.phoneNumber', values.phoneNumber);
  }

  render () {
    let {isGuest, isMobile, isSMSActive, error} = this.props;

    return (
      <div className="checkout-review-section checkout-review-pickup">

        {error && <ErrorMessage error={error} />}

        <FormSection name="pickUpContact" className="pick-up-form-container">
          {isGuest
            ? <ContactFormFields className="pickup-contact-guest-form" showEmailAddress showPhoneNumber />
            /* Note: Due to a bug in redux-form 6.5.0 (see issue 2572)  we need to pass a fake prop called _workaround_
              that changes every time the initialValues prop changes, otherwise the the new initialValues do not propagate to the wrapped form component. */
            : <MainContactForm className="pickup-contact-register-form" isMobile={isMobile} adaptTo={'firstName,lastName,emailAddress,phoneNumber'}
              mapValuesToProps={this.mapValuesToMainContactFormProps}
              isEditing={this.state.isEditing} initialValues={this.currentMainContactDetails}
              onEditModeChange={this.handleEditModeChange} onSubmit={this.onEditMainContactSubmit} onSubmitSuccess={this.exitEditMode}
              _workaround_={this._workaround_} />
          }

          {isSMSActive && <Field name="sendSMS" component={LabeledCheckbox} className="send-sms"
            title="Please send me pick up confirmation via text message" />}

          {isGuest &&
            <div className="email-signup-container">
              <Field name="emailSignup" component={LabeledCheckbox} title="Sign up for email today & get $10 off your next purchase!*" className="email-signup" />
              <p className="email-signup-note">
                I understand I will receive marketing emails from The Children’s Place. <br />
                *Applies to new email subscribers only. Exclusions apply. Offer valid on your next purchase of $40 or more. You may withdraw your consent at any time. <br />
              <HyperLink destination={PAGES.helpCenter} pathSuffix="#customerServiceli" target="_blank" className="contact-us-link">Contact us.</HyperLink>
              </p>
            </div>
          }
        </FormSection>
        <PickUpAlternateFormPart className={cssClassName({'pick-up-alternate-form-aux': this.state.isEditing})} showTitle showNoteOnToggle />
      </div>
    );
  }

}
