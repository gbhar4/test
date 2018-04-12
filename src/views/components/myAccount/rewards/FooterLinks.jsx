/** @module FooterLinks
 * @summary Component that display the nav bar of term and conditions from Rewards.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 */

import React from 'react';
import {PAGES} from 'routing/routes/pages.js';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.footer-links.scss');
} else {
  require('./_m.footer-links.scss');
}

class FooterLinks extends React.Component {
  render () {
    return (
      <nav className="my-rewards-footer-container">
        <HyperLink destination={PAGES.content} pathSuffix="myplace-rewards-page" className="my-rewards-footer-item" target="_blank">Program Details</HyperLink>
        <HyperLink destination={PAGES.helpCenter} pathSuffix="#fullTermsli" className="my-rewards-footer-item">Terms & Conditions</HyperLink>
      </nav>
    );
  }
}

export {FooterLinks};
