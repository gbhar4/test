/** PLCC Application form - static agreement text
 * @author Agu
 */

import React from 'react';
import {Field} from 'redux-form';
import {LabeledCheckbox} from 'views/components/common/form/LabeledCheckbox.jsx';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {PAGES} from 'routing/routes/pages.js';

export class PlccAgreements extends React.Component {
  handlePrintClick () {
    window.print();
  }

  render () {
    let { isMobile } = this.props;
    return (<div className="plcc-agreements-container">
      <p className="message-information">
        <strong>IMPORTANT INFORMATION ABOUT OPENING AN ACCOUNT</strong> To help the government fight the funding of terrorism and money laundering activities, Federal law requires all financial institutions to obtain, verify and record information that identifies each person who opens an account. What this means for you: When you open an account, we will ask for your name, address, date of birth or other information that will allow us to identify you. We may also ask to see your driver’s license or other identifying documents.<br /><br /><br />
        <strong>CA Residents:</strong> If you are married, you may apply for a separate account. <strong>NY, RI and VT Residents:</strong> We may order credit reports in connection with processing applications and any update, renewal or extension of credit. Upon request, we will tell you the name and address of any consumer-reporting agency that furnished a report on you. You consent to the obtaining of such reports by signing or otherwise submitting an application or solicitation. <strong>OH Residents:</strong> The Ohio laws against discrimination require that all creditors make credit equally available to all creditworthy customers, and that credit reporting agencies maintain separate credit histories on each individual upon request. The Ohio Civil Rights Commission administers compliance with this law. <strong>WI Residents:</strong> No provision of a marital property agreement, unilateral statement under Section 766.59 or court decree under Section 766.70 adversely affects the interest of Comenity Capital Bank unless the Bank, prior to the time credit is granted, is furnished a copy of the agreement, statement or decree or has actual knowledge of the adverse provision when the obligation to the Bank is incurred.
      </p>

      <h2 className="title">Electronic Consent</h2>
      {!isMobile ? <p className="message-information">
        <strong>You must read the disclosures presented in the Electronic Consent section of the <HyperLink destination={PAGES.content} pathSuffix="myplace-rewards-terms" className="link-footer" target="_blank">Terms and Conditions</HyperLink> box below prior to checking the consent box. Please also read the Credit Card Agreement, Privacy Statement and other information presented in the Terms and Conditions box prior to submitting this application and <button type="button" className="button-print" onClick={this.handlePrintClick}>print a copy</button> for your records.<br /><br />
        By signing or otherwise submitting this application/solicitation, each applicant ("I," "me" or "my" below) agrees and certifies that (1) I have read and agree to the disclosures provided on or with this application/solicitation, (2) the information I have supplied is true and correct, (3) I am applying to Comenity Capital Bank, P.O. Box 183003, Columbus, OH 43218-3003 (“Bank”) for a My Place Rewards Credit Card Account, (4) I authorize the Bank to obtain credit reports on me, (5) if approved, my account will be governed by the Credit Card Agreement, (6) I understand that I may pay all of my account balance at any time without penalty and (7) this application/solicitation, any information I submitted to the Bank, and the Bank&apos;s final decision on my application/solicitation may be shared with and retained by The Children&apos;s Place. </strong></p>
      : <p className="message-information">'You must read the disclosures presented in the Electronic Consent section of the <HyperLink destination={PAGES.content} pathSuffix="myplace-rewards-terms" className="link-footer" target="_blank">Terms and Conditions</HyperLink> box below prior to checking the consent box. Please also read the Credit Card Agreement, Privacy Statement and other information presented in the Terms and Conditions box prior to submitting this application and <button type="button" className="button-print" onClick={this.handlePrintClick}>print a copy</button> for your records.<br /><br />
        By signing or otherwise submitting this application/solicitation, each applicant ("I," "me" or "my" below) agrees and certifies that (1) I have read and agree to the disclosures provided on or with this application/solicitation, (2) the information I have supplied is true and correct, (3) I am applying to Comenity Capital Bank, P.O. Box 183003, Columbus, OH 43218-3003 (“Bank”) for a My Place Rewards Credit Card Account, (4) I authorize the Bank to obtain credit reports on me, (5) if approved, my account will be governed by the Credit Card Agreement, (6) I understand that I may pay all of my account balance at any time without penalty and (7) this application/solicitation, any information I submitted to the Bank, and the Bank&apos;s final decision on my application/solicitation may be shared with and retained by The Children&apos;s Place.'
        </p>}

      <h2 className="title">Financial Terms of Your Account</h2>
      <div className="financial-tems-container">
        <iframe src="https://comenity.net/childrensplace/common/Legal/disclosures.xhtml"></iframe>
      </div>

      <Field component={LabeledCheckbox} name="plccTermsAndConditions" className="checkbox-term-and-conditions"
        title="By checking this box and clicking 'Submit to open an account' I agree to the Terms and Conditions, acknowledge receipt of the Privacy Notice, consent to receive documents electronically, and electronically sign this application/solicitation." />
    </div>);
  }
}
