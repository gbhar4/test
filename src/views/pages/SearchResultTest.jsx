/** @module SearchResultTest
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 */

import React from 'react';
import {HeaderGlobalSticky} from 'views/components/globalElements/HeaderGlobalSticky.jsx';
import {SearchResultContainer} from 'views/components/productList/SearchResultContainer.js';
import {FooterGlobal} from 'views/components/globalElements/FooterGlobal.jsx';

class SearchResultTest extends React.Component {
  render () {
    let {isMobile} = this.props;
    return (
      <div>
        <HeaderGlobalSticky isMobile={isMobile} />

        <main className="main-section-container">
          <SearchResultContainer />
        </main>

        <FooterGlobal isMobile={isMobile} />
      </div>
    );
  }
}

export {SearchResultTest};
