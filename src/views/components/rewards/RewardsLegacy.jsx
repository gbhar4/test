import React from 'react';
import {PropTypes} from 'prop-types';
import {LabeledInput} from 'views/components/common/form/LabeledInput.jsx';
import {LabeledCheckbox} from 'views/components/common/form/LabeledCheckbox.jsx';
import {LabeledSelect} from 'views/components/common/form/LabeledSelect.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.rewards-legacy.scss');
}

// TODO: rewrite this component
export class RewardsLegacy extends React.Component {
  static propTypes = {
    contact: PropTypes.object
  }

  render () {
    // let {contact, stateOptionMap} = this.props;
    return (
      <div className="viewport-container rewards-legacy">
        <div className="rewards-legacy-intro clearfix">
          <img src="/wcsstore/static/images/rewards-legacy-card.png" />
          <div className="rewards-legacy-intro-text">
            <p>Community Bank is the issuer of the My Place Rewards Credit Card. if you wish to proceed with this online application, you will be providing your personal information to community bank.</p>
            <p>To apply you must be at least 18 years of age, have a valid government-issued photo ID, have a U.S. Social Security Number, and be a United States resident with a street, rural route, or APO/FPO mailing address. We do not accept PO Box mailing addresses.</p>
          </div>
        </div>

        <form className="form-contact-info" onSubmit={this.onSubmit}>

          <fieldset className="inputs-contact-info">
            <h2>Contact Info</h2>

            <div className="inputs-contact-info-block">
              <LabeledInput className="input-first-name" title="First Name" type="text" name="firstName" value="" placeholder="" />
              <LabeledInput className="input-mi-name" title="M.I" type="text" name="mI" value="" placeholder="" />
              <LabeledInput className="input-last-name" title="Last Name" type="text" name="lastName" value="" placeholder="" />
              <LabeledInput title="Email (optional)" type="text" name="emailAddress" value="" placeholder="" />
              <LabeledInput title="Mobile Phone Number*" type="tel" name="mobilePhoneNumber" value="" placeholder="" />
              <LabeledInput title="Alternate Phone Number*" type="tel" name="alternatePhoneNumber" value="" placeholder="" />
            </div>

            <div className="inputs-contact-info-block">
              <LabeledInput title="Address Line 1" type="text" name="addressLine1" value="" placeholder="" />
              <LabeledInput title="Address Line 2 (optional)" type="text" name="addressLine2" value="" placeholder="" />
              <LabeledInput className="input-city" title="City" type="text" name="city" value="" placeholder="" />
              <LabeledSelect className="input-state select-state" title="State" name="state" placeholder="Select" value="" optionsMap={[]} />
              <LabeledInput className="input-zip-code" title="Zip Code" type="tel" name="zipCode" value="" placeholder="" />
            </div>

            <span className="contact-info-message-text">*At least one phone number is required.</span>

            <div className="contact-info-message-container">
              <div className="contact-info-message-content">
                <p>By providing your contact information above, including any cellular or other phone numbers, you agree to be contacted regarding any of your Comenity Bank or Comenity Capital Bank accounts via calls to cell phones, text messages or telephone calls, including the use of artificial or pre-recorded message calls, as well as calls made via automatic telephone dialing systems, or via e-mail.</p>
              </div>
            </div>
          </fieldset>

          <fieldset className="inputs-personal-info">
            <h2>Personal Info</h2>

            <LabeledSelect className="select-day" title="Date of Birth" name="day" placeholder="dd" value="" optionsMap={[]} />

            <LabeledSelect className="select-month" title="" name="month" placeholder="mm" value="" optionsMap={[]} />

            <LabeledSelect className="select-year" title="" name="year" placeholder="yy" value="" optionsMap={[]} />

            <LabeledInput className="input-social-security" title="Last 4 of Social Security " type="text" name="socialSecurity" value="" placeholder="" />

          </fieldset>

          <div className="contact-info-message-container">
            <h3>Important Info About Opening An Account</h3>
            <div className="contact-info-message-content">
              <p>To help the government fight the funding of terrorism and money laundering activities, Federal law requires all financial institutions to obtain, verify and record information that identifies each person who opens an account. What this means for you: When you open an account, we will ask for your name, address, date of birth and other information that will allow us to identify you. We may also ask to see your driver's license or other identifying documents.</p>
              <p>CA Residents: If you are married, you may apply for a separate account. NY, RI, and VT Residents: We may order credit reports in connection with processing applications and any update, renewal or extension of credit. Upon request, we will tell you the name and address of any consumer-reporting agency that furnished a report on you. You consent to the obtaining of such reports by signing or otherwise submitting an application or solicitation. OH Residents: The Ohio laws against discrimination require that all creditors make credit equally available to all creditworthy customers, and that credit reporting agencies maintain separate credit histories on each individual upon request. The Ohio Civil Rights Commission administers compliance with this law. WI Residents: No provision of marital property agreement, unilateral statement under Section 766.59 or court decree under Section 766.70 adversely affects the interest of &#60; Bank Name &#62; , unless the Bank, prior to the time credit is granted, is furnished a copy of the agreement, statement or decree or has actual knowledge of the adverse provision when the obligation to the Bank is incurred.</p>
              <p>New York Residents: Comenity Capital Bank 1- 866-412-5563 (TDD/TTY 1-888-819-1918) New York Residents may contact the New York state Department of Financial Services by telephone or visit its website for free information on comparative credit card rates, fees, and grace periods. New York Department of Financial Services 1 (800) 342-3736 or <a target="_blank" href="http://www.dfs.ny.gov/">www.dfs.ny.gov</a>.</p>
            </div>
          </div>

          <div className="contact-info-message-container">
            <h3>Electronic Consent</h3>
            <div className="contact-info-message-content">
              <p>You must read the disclosures presented in the Electronic Consent section of the Terms and Conditions box below prior to checking the consent box. Please also read the Credit Card Agreement, Privacy Statement and other information presented in the Terms and Conditions box prior to submitting this application and print a copy for your records.</p>
              <p>By signing or otherwise submitting this application / solicitation, each applicant (“I,” “me” or “my” below) agrees and certifies that (1) I have read and agree to the disclosures provided on or with this application / solicitation, (2) the information I have supplied is true and correct, (3) I am applying to Comenity Bank, P.O. Box 182273, Columbus, OH 43218-2273 (“Bank”) for a  Credit Card Account, (4) I authorize the Bank to obtain credit reports on me, (5) if approved, my account will be governed by the Credit Card Agreement, (6) I understand that I may pay all of my account balance at any time without penalty and (7) this application / solicitation, any information I submitted to the Bank, and the Bank’s final decision on my application / solicitation may be shared with and retained by.</p>
              <p>By signing or otherwise submitting this application / solicitation, each applicant (“I,” “me” or “my” below) agrees and certifies that (1) I have read and agree to the disclosures provided on or with this application / solicitation, (2) the information I have supplied is true and correct, (3) I am applying to Comenity Capital Bank, P.O. Box 183003, Columbus, OH 43218-3003 (“Bank”) for a  Credit Card Account, (4) I authorize the Bank to obtain credit reports on me, (5) if approved, my account will be governed by the Credit Card Agreement, (6) I understand that I may pay all of my account balance at any time without penalty and (7) this application / solicitation, any information I submitted to the Bank, and the Bank’s final decision on my application / solicitation may be shared with and retained by.</p>
            </div>
          </div>

          <div className="scrollable-apr-module">
          </div>

          <LabeledCheckbox
            title="By checking this box and clicking “Submit to open an account” I agree to the Terms and Conditions, acknowledge receipt of the Privacy Notice, consent to receive documents electronically, and electronically sign this application / solicitation."
            name="termsAndConditions" checked="checked" value="1" className="terms-and-conditions" />

          <button type="submit" className="button-primary button-create-account">Submit to open an account</button>

          <a href="#" className="link-no-thanks">No Thanks</a>

        </form>
      </div>
    );
  }
}
