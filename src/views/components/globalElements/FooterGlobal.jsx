  /**
Component description: Global Footer from desktop

Usage:
var FooterGlobal = require("./FooterGlobal.jsx");

<FooterGlobal />

Style (ClassName) Elements description/enumeration

Uses:
	N/A
*/

import React from 'react';
import {PropTypes} from 'prop-types';
import {CountrySelectorContainer} from './footer/CountrySelectorContainer.js';
import {SocialNetworks} from './footer/SocialNetworks.jsx';
import {NavigationFooterContainer} from './footer/NavigationFooterContainer.js';
import {LegalInformation} from './footer/LegalInformation.jsx';
import {AuthModalContainer} from 'views/components/login/AuthModalContainer.js';
import {ContentSlotModalsRendererContainer} from 'views/components/common/contentSlot/ContentSlotModalsRendererContainer';
import cssClassName from 'util/viewUtil/cssClassName';

if (DESKTOP) { // eslint-disable-line
  require('./_d.footer-global.scss');
  // #if LEGACY
  require('./_d.legacy-footer-global.scss');
  // #endif
} else {
  require('./_m.footer-global.scss');
}

export class FooterGlobal extends React.Component {
  static propTypes = {
    /** Whether we are rendering for mobile. */
    isMobile: PropTypes.bool,

    /** UI flag to support number of columns based on country */
    countryCode: PropTypes.string.isRequired
  }

  render () {
    let {isMobile, countryCode} = this.props;
    let footerClassName = cssClassName(
      {'viewport-container ': !isMobile},
      'footer-global'
    );

    return (
      <footer className={footerClassName + ' footer-global-' + countryCode}>
        <div className="country-select-and-social-networks">
          <CountrySelectorContainer />
          <SocialNetworks />
        </div>

        <div className="navigation-and-newsletter">
          <NavigationFooterContainer />
        </div>

        <div className="copyright-and-legal-information">
          <LegalInformation />
        </div>

        <ContentSlotModalsRendererContainer />
        <AuthModalContainer />
      </footer>
    );
  }
}
