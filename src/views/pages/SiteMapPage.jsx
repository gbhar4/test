/**
 * @author Oliver
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {FooterGlobalContainer} from 'views/components/globalElements/FooterGlobalContainer.js';
import {HeaderGlobalSticky} from 'views/components/globalElements/HeaderGlobalSticky.jsx';
import {SiteMap} from 'views/components/siteMap/SiteMap.jsx';
import cssClassName from 'util/viewUtil/cssClassName';
import {Route} from 'views/components/common/routing/Route.jsx';
import {PAGES} from 'routing/routes/pages.js';

export class SiteMapPage extends React.Component {

  static propTypes = {
    /** indicates device (mobile vs desktop) */
    isMobile: PropTypes.bool.isRequired
  }

  render () {
    let {isMobile} = this.props;

    return (
      <div>
        <HeaderGlobalSticky isMobile={isMobile} />

        <main className={cssClassName('main-section-container store-search-section ', {'viewport-container': !isMobile})}>
          <Route path={PAGES.siteMap.pathPattern} component={SiteMap} />
        </main>

        <FooterGlobalContainer isMobile={isMobile} />
      </div>
    );
  }
}
