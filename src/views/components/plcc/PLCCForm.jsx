/** @module PLCC Form application
 * @summary PLCC Form Application
 *
 * @author Oliver Ramirez
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Modal} from 'views/components/modal/Modal.jsx';
import cssClassName from 'util/viewUtil/cssClassName';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';
import {Field, Fields, FormSection, reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';

import {ModalAddressVerificationFormContainer} from 'views/components/address/verificationModal/ModalAddressVerificationFormContainer.js';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {LabeledInputGoogleAutoComplete} from 'views/components/common/form/LabeledInputGoogleAutoComplete.jsx';
import {LabeledSelect} from 'views/components/common/form/LabeledSelect.jsx';
import {PlccAgreements} from 'views/components/plcc/form/PlccAgreements.jsx';
import {PlccTermsNotice} from 'views/components/plcc/form/PlccTermsNotice.jsx';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';

import {CreditCardExisting} from 'views/components/plcc/CreditCardExisting.jsx';
import {ApprovedPlcc} from 'views/components/plcc/ApprovedPlcc.jsx';
import {UnderReviewPLCC} from 'views/components/plcc/UnderReviewPLCC.jsx';
import {ProcessingErrorContainer} from 'views/components/plcc/ProcessingErrorContainer.js';
import {ErrorMessage} from 'views/components/common/ErrorMessage.jsx';
import {AdaptiveField} from 'reduxStore/util/AdaptiveField';

import {PlccConfirmationConnect} from 'views/components/plcc/PlccConfirmationConnect.js';
import {PLCCTimeoutModal} from 'views/components/plcc/PLCCTimeoutModal.jsx';
import {scrollToFirstFormError} from 'util/formsValidation/scrollToFirstFormError';
import {getSetErrorInStateMethod} from 'reduxStore/storeOperators/operatorHelper';
import {ButtonWithSpinner} from 'views/components/common/ButtonWithSpinner.jsx';

let ApprovedPlccContainer = PlccConfirmationConnect(ApprovedPlcc);
let UnderReviewPlccContainer = PlccConfirmationConnect(UnderReviewPLCC);
let CreditCardExistingContainer = PlccConfirmationConnect(CreditCardExisting);
const EMPTY_MAP = [];
const DATE_FIELD_NAMES = ['birthMonth', 'birthDay', 'birthYear'];
const INVALID_PRESCREEN_CODE = 'INVALID_PRESCREEN_CODE';

if (DESKTOP) { // eslint-disable-line
  require('./_d.plcc-form.scss');
} else {
  require('./_m.plcc-form.scss');
}

function DateFields (props) {
  let {dayOptionsMap, monthOptionsMap, yearOptionsMap, birthMonth, birthDay, birthYear} = props;
  let dontShowErrorOrWarning = !birthMonth.meta.touched || !birthDay.meta.touched || !birthYear.meta.touched;
  return (
    <span>
      <LabeledSelect title="" {...birthMonth} className="select-month" placeholder="mm" optionsMap={monthOptionsMap}
        dontShowErrorOrWarning={dontShowErrorOrWarning} />
      <LabeledSelect title="" {...birthDay} className="select-day" placeholder="dd" optionsMap={dayOptionsMap}
        dontShowErrorOrWarning={dontShowErrorOrWarning} />
      <LabeledSelect title="" {...birthYear} className="select-year" placeholder="yyyy" optionsMap={yearOptionsMap}
        dontShowErrorOrWarning={dontShowErrorOrWarning} />
    </span>
  );
}

class _PLCCForm extends React.Component {
  static propTypes = {
    /** Flag to know if content should be into a modal */
    isModal: PropTypes.bool,

    isInstantCredit: PropTypes.bool,

    /** flags if the address verification modal should be rendered */
    isAddressVerifyModalOpen: PropTypes.bool.isRequired,

    application: PropTypes.shape({
      creditLimit: PropTypes.number,
      apr: PropTypes.number,
      couponCode: PropTypes.string,
      discount: PropTypes.number
    }),

    /** A map of the available countries to choose from */
    countriesOptionsMap: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired
    })),

    /** A table of states by country.
     * This is a symbol-table, i.e., it is an object whose properties are country codes;
     * and the value of each such property is an array of the states in that country.
     */
    countriesStatesTable: PropTypes.objectOf(
      PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired
      }))
    ),

    dayOptionsMap: PropTypes.array.isRequired,
    monthOptionsMap: PropTypes.array.isRequired,
    yearOptionsMap: PropTypes.array.isRequired,

    isApplicationApproved: PropTypes.bool.isRequired,
    isApplicationPending: PropTypes.bool.isRequired,
    isApplicationTimeout: PropTypes.bool.isRequired,

    snareApiUrl: PropTypes.string.isRequired, // ADS integration js

    onSubmit: PropTypes.func.isRequired,

    /** callback for restarting the PLCC application process */
    onRestartPlccApplication: PropTypes.func.isRequired,

    /** permission which access the form only when user is on US page */
    allowAccessFromCurrentCountry: PropTypes.bool,

    ...reduxFormPropTypes
  }

  static idleUserEvents = ['blur', 'change', 'click', 'dblclick', 'focus', 'focusin', 'focusout', 'hover', 'keydown', 'keypress', 'keyup', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll', 'select', 'submit']

  static autocompleteRestrictions = {
    country: 'US'
  }

  constructor (props, context) {
    super(props, context);

    this.state = {
      isIdleModalActive: false,
      isOpenPreeScreenCode: !!props.isOpenPreeScreenCode,
      isErrorModalActive: false
    };

    this.timeout = null;

    this.handleDeclineClick = this.handleDeclineClick.bind(this);
    this.handleDismissModal = this.handleDismissModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.captureFormRef = this.captureFormRef.bind(this);
    this.mapValuesToStateProps = this.mapValuesToStateProps.bind(this);
    this.handlePlaceSelected = this.handlePlaceSelected.bind(this);
    this.handleRestartAcceptance = this.handleRestartAcceptance.bind(this);

    this.handleContinueApplication = this.handleContinueApplication.bind(this);
    this.restartIdleUserTimeout = this.restartIdleUserTimeout.bind(this);
    this.bindIdleVerification = this.bindIdleVerification.bind(this);
    this.unbindIdleVerification = this.unbindIdleVerification.bind(this);
    this.handleTogglePreScreen = this.handleTogglePreScreen.bind(this);
    this.handleToggleListener = this.handleToggleListener.bind(this);

    this.setError = getSetErrorInStateMethod(this);
  }

  bindIdleVerification () {
    for (var i = 0, eventsCount = _PLCCForm.idleUserEvents.length; i < eventsCount; i++) {
      document.addEventListener(_PLCCForm.idleUserEvents[i], this.restartIdleUserTimeout, true);
    }
  }

  unbindIdleVerification () {
    for (var i = 0, eventsCount = _PLCCForm.idleUserEvents.length; i < eventsCount; i++) {
      document.removeEventListener(_PLCCForm.idleUserEvents[i], this.restartIdleUserTimeout, true);
    }
  }

  handleRestartAcceptance () {
    if (this.props.isApplicationApproved) {
      this.props.onRestartPlccApplication();
    } else {
      this.props.reset();
      this.handleContinueApplication();
    }
  }

  componentDidUpdate () {
    this.bindIdleVerification();
  }

  componentWillUnmount () {
    this.unbindIdleVerification();
    document.removeEventListener('click', this.handleToggleListener);
  }

  restartIdleUserTimeout () {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      let {isApplicationApproved, isApplicationPending, isApplicationExisting} = this.props;
      if (isApplicationApproved || isApplicationPending || isApplicationExisting) {
        return;
      }

      this.setError(null);
      this.setState({
        isIdleModalActive: true
      });
    }, 13 * 60 * 1000);
  }

  handleContinueApplication () {
    this.setState({
      isIdleModalActive: false
    });

    this.restartIdleUserTimeout();
  }

  handleDeclineClick () {
    return this.props.onDeclineClick().catch((err) => {
      if (!this.state.isIdleModalActive) {
        this.setError(err);
      } else {
        throw err;
      }
    });
  }

  handleDismissModal () {
    return this.props.onDismissModal();
  }

  render () {
    let { isModal, isMobile, isApplicationApproved, isApplicationPending, isApplicationExisting, isApplicationTimeout, isInstantCredit, allowAccessFromCurrentCountry } = this.props;
    let { isIdleModalActive } = this.state;
    let dismissCallback = this.handleDeclineClick;
    let content;
    let isForm = false;
    if (!allowAccessFromCurrentCountry) {
      return;
    }
    // REVIEW: we have confirmation and different 'thank you' pages
    // but we don't want/need different urls for them, so we need to handle with states on the store
    if (isApplicationApproved) {
      content = <div>
        <ApprovedPlccContainer isShowContinueShoppingLink={isInstantCredit} isModal={isModal} isInstantCredit={isInstantCredit} isApproved />
        {isIdleModalActive && <PLCCTimeoutModal isRedirectOnTimeout={!isModal} isMobile={isMobile} onClose={this.handleContinueApplication} onTimedoutClose={this.handleDeclineClick} time={120} onRestartAcceptance={this.handleRestartAcceptance} isInstantCredit={isInstantCredit} />}
      </div>;
      dismissCallback = this.handleDismissModal;
    } else if (isApplicationPending) {
      content = <UnderReviewPlccContainer isModal={isModal} isShowContinueShoppingLink={isInstantCredit} isInstantCredit={isInstantCredit} />;
      dismissCallback = this.handleDismissModal;
    } else if (isApplicationExisting) {
      content = <CreditCardExistingContainer isModal={isModal} isShowContinueShoppingLink={isInstantCredit} isInstantCredit={isInstantCredit} />;
      dismissCallback = this.handleDismissModal;
    } else {
      isForm = true;
      content = this.renderContent();
    }

    if (isModal) {
      return (<Modal className="overlay-container" onRequestClose={!isForm ? dismissCallback : null} contentLabel="PLCC" overlayClassName="react-overlay overlay-center overlay-form-plcc overlay-border-decoration" isOpen>
        {(!isForm || isInstantCredit || isApplicationTimeout) && <ModalHeaderDisplayContainer onCloseClick={dismissCallback} />}
        {!isApplicationTimeout
          ? content
          : <ProcessingErrorContainer isModal={false} isInstantCredit={isInstantCredit} />
        }
      </Modal>);
    } else {
      return content;
    }
  }

  static defaultValidation = {
    address: {
      ...getStandardConfig([
        'firstName',
        'lastName',
        'addressLine1',
        'addressLine2',
        'city',
        'state',
        'zipCode',
        'country',
        'prescreenCode',
        {
          addressLine1: 'plccAddressLine1'
        },
        {
          addressLine2: 'plccAddressLine2'
        },
        {
          middleNameInitial: 'mni'
        }
      ])
    },
    ...getStandardConfig(['emailAddress', 'plccTermsAndConditions', 'prescreenCode', {
      birthMonth: 'birthDate'
    }, {
      phoneNumber: 'phoneNumberWithAlt'
    }, {
      altPhoneNumber: 'altPhoneNumber'
    }, {
      ssn: 'ssn'
    }, {
      middleNameInitial: 'mni'
    }])
  }

  componentDidMount () {
    // basic configuration
    window.io_bbout_element_id = 'ioBlackBox'; // populate ioBlackBox in form
    window.io_install_stm = false; // do not install ActiveX
    window.io_install_flash = false; // do not install ActiveX
    window.io_exclude_stm = 12; // exclude Active X on XP and higher

    window.io_submit_element_id = 'plccSubmitButton'; // tie to form's submit button
    window.io_max_wait = 3000; // wait 3 seconds
    window.io_submit_form_id = 'plccForm';

    let hn = document.createElement('script');
    let sc = document.getElementsByTagName('script')[0];

    hn.type = 'text/javascript';
    hn.async = true;
    hn.src = this.props.snareApiUrl;
    sc.parentNode.insertBefore(hn, sc);

    this.bindIdleVerification();

    document.addEventListener('click', this.handleToggleListener);
  }

  handleToggleListener (event) {
    if (event.target.id === 'toggle-pre-screen') {
      event.preventDefault();
      this.handleTogglePreScreen();
    }
  }

  handleSubmit (e) {
    e.preventDefault();

    return this.props.handleSubmit((formData) => {
      return this.props.onSubmit({
        ...formData,
        BF_ioBlackBox: this.ioBlackBoxRef.value
      });
    })();
  }

  captureFormRef (ref) {
    this.ioBlackBoxRef = ref;
  }

  handlePlaceSelected (place, inputValue) {
    let address = LabeledInputGoogleAutoComplete.getAddressFromPlace(place, inputValue);     // obtain a new address object based on the given place
    let country = this.props.countriesOptionsMap.find((country) =>
      country.id.toUpperCase() === address.country.toUpperCase() ||
      country.displayName.toUpperCase() === address.country.toUpperCase()
    );

    if (!country) {
      return;             // service returned an address in another country -> ignore
    }

    // dispatch actions to the redux store to change the values of the relevant form fields
    this.props.change('address.addressLine1', address.street);
    this.props.change('address.city', address.city);
    this.props.change('address.country', country.id); // note: country first
    this.props.change('address.state', address.state);
    this.props.change('address.zipCode', address.zip);
  }

  mapValuesToStateProps (values) {
    let statesOptionsMap = values.country ? this.props.countriesStatesTable[values.country] || EMPTY_MAP : EMPTY_MAP;

    return {
      optionsMap: statesOptionsMap,
      title: values.country === 'US' ? 'State' : 'Province'
    };
  }

  handleTogglePreScreen () {
    this.setState({
      isOpenPreeScreenCode: !this.state.isOpenPreeScreenCode
    });

    if (!this.state.isOpenPreeScreenCode) {
      this.props.change('prescreenCode', '');
      this.props.untouch('prescreenCode');
    }
  }

  renderContent () {
    let {isModal, isMobile, asyncValidating, error, form, dayOptionsMap, monthOptionsMap, yearOptionsMap, submitting,
      isAddressVerifyModalOpen, isInstantCredit, isShowApplyButton} = this.props;

    let {isIdleModalActive, isOpenPreeScreenCode} = this.state;
    let classNameForm = cssClassName('plcc-form ', {'border-form': isInstantCredit && isMobile});

    return (
      <form id="plccForm" name="plccForm" className={classNameForm}>

        {(!isModal || !isIdleModalActive) && <div className="">
          <input ref={this.captureFormRef} type="hidden" name="BF_ioBlackBox" id="ioBlackBox" />

          <PlccTermsNotice />

          {this.state.error && (this.state.error !== INVALID_PRESCREEN_CODE) && <ErrorMessage error={this.state.error} formName={form} />}
          {this.state.error && (!isOpenPreeScreenCode && this.state.error === INVALID_PRESCREEN_CODE) && <ErrorMessage formName={form}>
            THERE WAS AN ERROR PROCESSING YOUR REQUEST.<br /><br />
            We&rsquo;re sorry. We&rsquo;re experiencing technical difficulties,<br />
            and cannot process your request at this time.<br />
            Please call 1-866-254-9967 (TDD/TTY: 1-888-819-1918) and speak to a customer service representative
          </ErrorMessage>}

          <p className="message message-review">You agree that this application and any information you submit to Comenity Capital Bank may be shared with and retained by The Children’s Place.</p>

          {(isShowApplyButton && !isOpenPreeScreenCode && isInstantCredit) && <div className="inline-pre-screen-code-container">
            <p className="message">If you’ve received a pre-screen code, <button type="button" onClick={this.handleTogglePreScreen} className="button-here">click here</button>.</p>
          </div>}

          {isOpenPreeScreenCode && <div className="input-pre-screen-code-container">
            <Field component={LabeledInput} name="prescreenCode" className="input-pre-screen" maxLength="12" title="Enter Pre-Screen Code (optional)">
              <p className="pre-screen-code-message">If you’ve received a pre-screen code, enter it here.</p>
            </Field>

            {!this.state.error && error && (error === INVALID_PRESCREEN_CODE) && <div className="label-error">
              <ErrorMessage className="inline-error-message" error={error} formName={form}>
                The pre-screen code entered is invalid.<br />You may try again, or <button id="toggle-pre-screen">click here</button> to apply {/* for the MY PLACE REWARDS CREDIT CARD */}
              </ErrorMessage>
            </div>}
          </div>}

          <FormSection name="address">
            <h2 className="title title-contact">Contact Information</h2>

            <Field name="firstName" component={LabeledInput} className="input-first-name" title="First Name" maxLength="15" />
            <Field name="middleNameInitial" component={LabeledInput} className="input-m-i" title="M.I." />
            <Field name="lastName" component={LabeledInput} className="input-last-name" title="Last Name" maxLength="20" />
          </FormSection>

          {isMobile && <Field name="emailAddress" component={LabeledInput} className="input-email" title="Email" maxLength="50" />}

          <FormSection name="address">
            <Field name="addressLine1" component={LabeledInputGoogleAutoComplete} className="input-address-one"
              title="Address Line 1" onPlaceSelected={this.handlePlaceSelected}
              componentRestrictions={_PLCCForm.autocompleteRestrictions} maxLength="30" />
            <Field name="addressLine2" component={LabeledInput} className="input-address-two" title="Address Line 2 (optional)" />
            <Field name="city" component={LabeledInput} className="input-city" title="City" maxLength="20" />
            <AdaptiveField name="state" component={LabeledSelect} className="select-state"
              adaptTo="country" mapValuesToProps={this.mapValuesToStateProps} optionsMap={EMPTY_MAP} isHideIfEmptyOptionsMap />
            <Field name="zipCode" type="tel" component={LabeledInput} className="input-zip-code" title="Zip Code" />
          </FormSection>

          <Field className="input-phone-number" name="phoneNumber" component={LabeledInput} title="Mobile Phone Number*" type="tel" />
          {!isMobile && <Field name="emailAddress" component={LabeledInput} className="input-email" title="Email" maxLength="50" />}
          <Field className="input-alt-phone-number" name="altPhoneNumber" component={LabeledInput} title="Alternate Phone Number*" type="tel" />

          <p className="message-required">At least one phone number is required</p>

          <p className="message-information">*By providing your contact information above, including any cellular or other phone numbers,
            you agree to be contacted regarding any of your Comenity Bank or Comenity Capital Bank accounts via calls to cell phones,
            text messages or telephone calls, including the use of artificial or pre-recorded message calls,
            as well as calls made via automatic telephone dialing systems, or via e-mail.
          </p>

          <h2 className="title">Personal information</h2>
          <span className="title-data-birth">Date of Birth</span>
          <Fields component={DateFields} names={DATE_FIELD_NAMES}
            dayOptionsMap={dayOptionsMap} monthOptionsMap={monthOptionsMap} yearOptionsMap={yearOptionsMap} />

          <Field className="input-digits-ssn" name="ssn" component={LabeledInput} title="Last 4 Digits of SSN" type="password"
            pattern="[0-9]*" inputMode="numeric" maxLength="4" placeholder="Last 4 Digits of SSN" />

          <PlccAgreements isMobile={isMobile} />

          {!this.state.error && error && (error !== INVALID_PRESCREEN_CODE) && <ErrorMessage error={error} formName={form} />}
          {!this.state.error && error && !isOpenPreeScreenCode && error === INVALID_PRESCREEN_CODE && <ErrorMessage formName={form}>
            THERE WAS AN ERROR PROCESSING YOUR REQUEST.<br /><br />
            We&rsquo;re sorry. We&rsquo;re experiencing technical difficulties,<br />
            and cannot process your request at this time.<br />
            Please call 1-866-254-9967 (TDD/TTY: 1-888-819-1918) and speak to a customer service representative
          </ErrorMessage>}

          <ButtonWithSpinner onClick={this.handleSubmit} id="plccSubmitButton"
            disabled={submitting || asyncValidating}
            className={cssClassName('button-submit ', 'open-an-account-button')}
            spinnerClassName="open-an-account-spinner">
            Submit to open an account
          </ButtonWithSpinner>
          <button type="button" onClick={this.handleDeclineClick} className="button-disagree">No thanks</button>
        </div>}

        {isIdleModalActive && <PLCCTimeoutModal isRedirectOnTimeout={!isModal} isInstantCredit={isInstantCredit} isMobile={isMobile} onClose={this.handleContinueApplication} onTimedoutClose={this.handleDeclineClick} time={120} onRestartAcceptance={this.handleRestartAcceptance} />}
        {isInstantCredit && isAddressVerifyModalOpen && <ModalAddressVerificationFormContainer isOpen />}
        {!isModal && <ProcessingErrorContainer isModal isInstantCredit={isInstantCredit} />}
      </form>
    );
  }
}

let validateMethod = createValidateMethod({
  ..._PLCCForm.defaultValidation
});

let PLCCForm = reduxForm({
  form: 'plccForm',
  ...validateMethod,
  enableReinitialize: true,
  onSubmitFail: (errors, dispatch, submitError, props) => scrollToFirstFormError(props.form)
})(_PLCCForm);

export {PLCCForm};
