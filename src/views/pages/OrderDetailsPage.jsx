/** @module MyAccountPage
 * Guest user order details.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {HeaderGlobalSticky} from 'views/components/globalElements/HeaderGlobalSticky.jsx';
import {FooterGlobalContainer} from 'views/components/globalElements/FooterGlobalContainer.js';
import {OrderDetailsContainer} from 'views/components/myAccount/orders/OrderDetailsContainer.js';
import cssClassName from 'util/viewUtil/cssClassName';
import {Route} from 'views/components/common/routing/Route.jsx';
import {PAGES} from 'routing/routes/pages.js';
import {HeaderSpinnerFooter} from 'views/components/globalElements/HeaderSpinnerFooter.jsx';

if (DESKTOP) { // eslint-disable-line
  require('views/components/myAccount/_d.my-account-section.scss');
} else {
  require('views/components/myAccount/_m.my-account-section.scss');
}

export class OrderDetailsPage extends React.Component {
  static propTypes = {
    /** flags if we're rendering for mobile */
    isMobile: PropTypes.bool.isRequired,
    /** flags if data is being loaded */
    isLoading: PropTypes.bool
  }

  render () {
    let {isMobile, isLoading} = this.props;

    if (isLoading) return <HeaderSpinnerFooter isMobile={isMobile} />;

    return (
      <div>
        <HeaderGlobalSticky isMobile={isMobile} />

        <main className="main-section-container">
          <section className={cssClassName('guest-order-content ', {'viewport-container ': !isMobile, 'my-account-section-content ': isMobile})}>
            <h1 className="order-details-guest-title">Order Details</h1>
            <Route path={PAGES.guestOrderDetails.pathPattern} component={OrderDetailsContainer} />
          </section>
        </main>

        <FooterGlobalContainer />
      </div>
    );
  }
}
