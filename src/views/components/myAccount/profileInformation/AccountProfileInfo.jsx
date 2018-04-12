/**
 * @module AccountProfileInfo
 * Shows the different views for the user on Profile Information sections
 *
 * @author Damian <drossi@minutentag.com>
 * @author gabriel gomez
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Route} from 'views/components/common/routing/Route.jsx';
import {Switch} from 'views/components/common/routing/Switch.jsx';
import cssClassName from 'util/viewUtil/cssClassName';
import {ProfileInformationContainer} from './ProfileInformationContainer';
import {BirthdaysSavingsContainer} from './BirthdaysSavingsContainer';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';
import {BreadCrumbs} from 'views/components/common/routing/BreadCrumbs.jsx';
import {Spinner} from 'views/components/common/Spinner.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.profile-information.scss');
} else {
  require('./_m.profile-information.scss');
}

class AccountProfileInfo extends React.Component {

  static propTypes = {
    /**
     * Callback to run on component mount (usually to populate redux store information consumened by this component).
     * Should return a promise
     * */
    onMount: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);
    this.state = {isLoading: true};
  }

  componentDidMount () {
    this.props.onMount()
      .then(() => this.setState({isLoading: false}))
      .catch(() => this.setState({isLoading: false}));
  }

  render () {
    let {className} = this.props;
    let profileContainerClass = cssClassName('my-rewards-section ', className);
    let profileInfoRoute = MY_ACCOUNT_SECTIONS.profileInformation;

    if (this.state.isLoading) { return <Spinner />; }
    return (
      <div className={profileContainerClass}>
        <Route component={BreadCrumbs} componentProps={{sections: MY_ACCOUNT_SECTIONS}} />
        <Switch>
          <Route path={profileInfoRoute.subSections.birthdaySavings.pathPattern}
            component={BirthdaysSavingsContainer} />
          <Route path={profileInfoRoute.pathPattern}
            component={ProfileInformationContainer} />
        </Switch>
      </div>
    );
  }
}

export {AccountProfileInfo};
