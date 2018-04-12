import React from 'react';
import {HeaderGlobalSticky} from 'views/components/globalElements/HeaderGlobalSticky.jsx';
import {FooterGlobalContainer} from 'views/components/globalElements/FooterGlobalContainer.js';
import {Spinner} from 'views/components/common/Spinner.jsx';

export function HeaderSpinnerFooter (props) {
  let {isMobile} = props;
  return (
    <div>
      <HeaderGlobalSticky isMobile={isMobile} />
      <main className="main-section-container"><Spinner /></main>
      <FooterGlobalContainer />
    </div>
  );
}
