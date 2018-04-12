/** @module MyAccounTest
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 */

import React from 'react';
import {HeaderGlobalSticky} from 'views/components/globalElements/HeaderGlobalSticky.jsx';
import {EmailUsFormContainer} from 'views/components/helpCenter/emailUs/EmailUsFormContainer.js';
import {FooterGlobal} from 'views/components/globalElements/FooterGlobal.jsx';

class EmailUsHCTest extends React.Component {
  render () {
    let {isMobile} = this.props;
    return (
      <div>
        <HeaderGlobalSticky isMobile={isMobile} />

        <main className="main-section-container">
          <EmailUsFormContainer />
        </main>

        <FooterGlobal isMobile={isMobile} />
      </div>
    );
  }
}

export {EmailUsHCTest};
