/**
Component description: legal information from Footer (logotype, copyright and site map)

Usage:
var LegalInformation = require("./LegalInformation.jsx");

<LegalInformation />

Component Props description/enumaration:

Style (ClassName) Elements description/enumeration

Note:
copyright-information changed position with item-navigation to not make two components for mobile and desktop

Uses:
	N/A

* @author Noam (I'm making minor changes)
*/
import React from 'react';
import {PAGES} from 'routing/routes/pages.js';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.legal-information.scss');
}

class LegalInformation extends React.Component {

  render () {
    return (
      <div className="legal-information container-viewport">
        <div className="copyright-and-navigation">

          <nav className="item-navigation">
            <HyperLink destination={PAGES.helpCenter}
              pathSuffix="#termsAndConditionsli" className="item-navigation-link">Terms and Conditions</HyperLink>

            <HyperLink destination={PAGES.helpCenter}
              pathSuffix="#privacyPolicySectionli" className="item-navigation-link">Privacy Policy</HyperLink>

            <HyperLink destination={PAGES.content}
              pathSuffix="supply-chain" className="item-navigation-link">California Supply Chains Act</HyperLink>

            <HyperLink destination={PAGES.siteMap} className="item-navigation-link">Site Map</HyperLink>
          </nav>

          <span className="copyright-information">
            <p className="item-navigation-link">&copy; 2018 The Children's Place</p>
            Big Fashion, Little Prices
          </span>

        </div>
      </div>
    );
  }
}

export {LegalInformation};
