/** @module PlccPage
 * Component for PLCC/WIC page
 *
 * @author Agu
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {Switch} from 'views/components/common/routing/Switch.jsx';
import {HeaderGlobalSticky} from 'views/components/globalElements/HeaderGlobalSticky.jsx';
import {Route} from 'views/components/common/routing/Route.jsx';
import {FooterGlobalContainer} from 'views/components/globalElements/FooterGlobalContainer.js';
import {PLCC_SECTIONS, PLCC_PAGE} from 'routing/routes/plccRoutes.js';
import {Redirect} from 'react-router-dom';
import {RoutingWindowRefresherContainer} from 'views/components/common/routing/RoutingWindowRefresherContainer';

import {PLCCFormContainer} from 'views/components/plcc/PLCCFormContainer.js';
import {LandingPLCCContainer} from 'views/components/plcc/LandingPLCCContainer.js';
import {HeaderSpinnerFooter} from 'views/components/globalElements/HeaderSpinnerFooter.jsx';

const RedirectToRoot = (props) => <Redirect to={props.match.url} />;

export class PlccPage extends React.Component {
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
        <RoutingWindowRefresherContainer sections={PLCC_SECTIONS} /> {/* scrolls window up whenever stage changes */}

        <HeaderGlobalSticky isMobile={isMobile} />

        <main className="main-section-container">
          <div className="plcc-container">
            <Switch>
              <Route path={PLCC_SECTIONS.application.pathPattern}
                component={PLCCFormContainer}
                componentProps={{className: 'plcc-section-content', isModal: false, isInstantCredit: true}} />

              <Route path={PLCC_SECTIONS.rootPathPattern} exact
                component={LandingPLCCContainer}
                componentProps={{className: 'plcc-section-content', isInstantCredit: true}} />

              <Route path={PLCC_PAGE.rootPathPattern} render={RedirectToRoot} strict /> {/* redirects all unknown sections to the root of this page */}
            </Switch>
          </div>
        </main>

        <FooterGlobalContainer />
      </div>
    );
  }
}
