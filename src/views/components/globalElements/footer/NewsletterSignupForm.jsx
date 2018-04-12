/** @module NewsletterSignupForm
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {Field, reduxForm, propTypes as reduxFormPropTypes} from 'redux-form';
import {createValidateMethod} from 'util/formsValidation/createValidateMethod';
import cssClassName from 'util/viewUtil/cssClassName';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {getStandardConfig} from 'util/formsValidation/validatorStandardConfig';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {PAGES} from 'routing/routes/pages';
import {CustomSpinnerIcon} from 'views/components/common/Spinner.jsx';
import {ContentSlot} from 'views/components/common/contentSlot/ContentSlot.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.sign-in-to-newsletter.scss');
}

class SignupForm extends React.Component {

  static propTypes = {
    /** flags if this component should render its mobile instead of desktop version */
    isMobile: PropTypes.bool.isRequired,

    /** Flags if we need to show a spinner while waiting for the backend to complete an update of this item */
    isUpdating: PropTypes.bool,

    /** Flags if we need to show an indication that this form was submitted successfully */
    isConfirming: PropTypes.bool,

    ...reduxFormPropTypes
  }

  render () {
    let { isUpdating, isConfirming, handleSubmit } = this.props;
    let titleText = 'SIGN UP TODAY FOR EMAILS FROM THE CHILDREN\'S PLACE AND GET $10 OFF YOUR NEXT PURCHASE!';
    let placeholder = 'Enter email address';
    let buttonText = isConfirming ? '' : isUpdating ? <CustomSpinnerIcon className="button-loading" /> : 'SUBMIT';
    let buttonProps = {
      className: cssClassName('button-submit-newsletter', {' button-check': isConfirming})
    };

    return (
      <form className="sign-in-to-newsletter email-to-newsletter" onSubmit={handleSubmit}>
        <div className="input-with-button">
          <span>{titleText}</span>
          <div className="input-and-button-container">
            <Field component={LabeledInput} name="emailAddress" className="newsletter-input" type="text" title={placeholder}/>
            <button className={buttonProps.className}>{buttonText}</button>
          </div>
        </div>

        {isConfirming
          ? <p className="text-notification thanks-notification">Thanks for signing up! Be on the lookout for an email with your $10 off coupon.</p>
          : <p className="text-notification">Be the first to learn about special offers, new arrivals, exclusive events and more! <br />
              Applies to new email subscribers only. Exclusions apply. <br />
              Offer valid on your next purchase of $40 or more. <br />
              You may withdraw your consent at any time. <HyperLink destination={PAGES.helpCenter} pathSuffix="contact-us" >Contact us</HyperLink> <br />
              The Children's Place, 500 Plaza Drive, Secaucus, NJ07094, <HyperLink destination={PAGES.homePage}>www.childrensplace.com</HyperLink>.
            </p>
        }
        <ContentSlot contentSlotName="global_footer_signup_form_espot" className="global-footer-signup-content-slot" />
      </form>
    );
  }
}

// DT-32279: We want to exclude the asyncValidators validation
let { asyncValidators, ...othersValidators } = getStandardConfig(['emailAddress']);
let validateMethod = createValidateMethod(othersValidators);

let NewsletterSignupForm = reduxForm({
  form: 'NewsletterSignupForm',  // a unique identifier for this form
  ...validateMethod,
  destroyOnUnmount: false, // On PDP's and other places we are re-rendering the fotter... which we need to fix. This is causing issues with the form flags
  keepDirtyOnReinitialize: true,
  touchOnBlur: true       // THIS CAN NOT BE FALSE ->  // this prevents validation errors from showing when the user exits the email input field
})(SignupForm);

export {NewsletterSignupForm};
