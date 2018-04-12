import React from 'react';
import {HeaderGlobalSticky} from 'views/components/globalElements/HeaderGlobalSticky.jsx';
import {FooterGlobalContainer} from 'views/components/globalElements/FooterGlobalContainer.js';
import {Rewards} from 'views/components/rewards/Rewards.jsx';
import {HelpCenterContainer} from 'views/components/helpCenter/HelpCenterContainer.js';
import {HELP_CENTER_PAGE, HELP_CENTER_SECTIONS} from 'routing/routes/helpCenterRoutes.js';
import {EmailUsFormContainer} from 'views/components/helpCenter/emailUs/EmailUsFormContainer.js';

import {Switch} from 'views/components/common/routing/Switch.jsx';
import {Route} from 'views/components/common/routing/Route.jsx';
import {Redirect} from 'react-router-dom';
import {HeaderSpinnerFooter} from 'views/components/globalElements/HeaderSpinnerFooter.jsx';
import {RoutingWindowRefresherContainer} from 'views/components/common/routing/RoutingWindowRefresherContainer';

const RedirectToRoot = (props) => <Redirect to={props.match.url} />;

export class HelpCenterPage extends React.Component {

  render () {
    let {isMobile, isLoading} = this.props;

    if (isLoading) return <HeaderSpinnerFooter isMobile={isMobile} />;

    return (
      <div>
        <RoutingWindowRefresherContainer sections={HELP_CENTER_SECTIONS} /> {/* scrolls window up whenever stage changes */}
        <HeaderGlobalSticky isMobile={isMobile} />

        <main className="main-section-container">
          <Switch>
            <Route path={HELP_CENTER_SECTIONS.contactUs.pathPattern} component={EmailUsFormContainer} />

            <Route path={HELP_CENTER_PAGE.rootPathPattern} component={HelpCenterContainer} />

            <Route path={HELP_CENTER_PAGE.rootPathPattern} render={RedirectToRoot} strict /> {/* redirects all unknown sections to the root of this page */}
          </Switch>
        </main>

        <FooterGlobalContainer isMobile={isMobile} />
        {this.props.rewardsOverlay ? <Rewards {...this.props} /> : ''}
      </div>
    );
  }
}
