/**
 * @author Florencia Acosta <facosta@minutentag.com>
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {FooterGlobalContainer} from 'views/components/globalElements/FooterGlobalContainer.js';
import {HeaderGlobalSticky} from 'views/components/globalElements/HeaderGlobalSticky.jsx';
import {SiteStoresListContainer} from 'views/components/store/list/SiteStoresListContainer.js';
import cssClassName from 'util/viewUtil/cssClassName';
import {Route} from 'views/components/common/routing/Route.jsx';
import {PAGES} from 'routing/routes/pages.js';

export class SiteStoresPage extends React.Component {

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
          <Route path={PAGES.usAndCaStores.pathPattern} component={SiteStoresListContainer} />
        </main>

        <FooterGlobalContainer isMobile={isMobile} />
      </div>
    );
  }
}
