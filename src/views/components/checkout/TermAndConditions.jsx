/**
 * @module TermAndConditions
 * @author Florencia Acosta <facosta@minutentag.com>
 * Shows the leyend of terms and conditions for checkout and its hyperlink
 */

import React from 'react';
import {PAGES} from 'routing/routes/pages.js';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';

export class TermAndConditions extends React.Component {
  render () {
    return (
      <p className="term-and-conditions-checkout">By selecting "Submit Order", I agree to the <HyperLink destination={PAGES.helpCenter} pathSuffix="#termsAndConditionsli" className="term-and-conditions-link" target="_blank">Terms & Conditions</HyperLink>.</p>
    );
  }
}
