/**
 * @module Rewards
 * Shows the different views for the user to manage it's rewards in My Account.
 *
 * @author Miguel <malvarez@minutentag.com>
 * Gabriel Gomez
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName';
import {Route} from 'views/components/common/routing/Route.jsx';
import {Switch} from 'views/components/common/routing/Switch.jsx';
import {EarnedRewardsContainer} from './EarnedRewardsContainer';
import {PointsHistoryContainer} from './PointsHistoryContainer';
import {OffersAndCouponsContainer} from './OffersAndCouponsContainer';
import {PointsClaimFormContainer} from './PointsClaimFormContainer';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';
import {Spinner} from 'views/components/common/Spinner.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.my-rewards-section.scss');
} else {
  require('./_m.my-rewards-section.scss');
}

export class USARewards extends React.Component {

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
    let rewardsContainerClass = cssClassName('my-rewards-section ', className);
    let rewardsRoute = MY_ACCOUNT_SECTIONS.myRewards;

    if (this.state.isLoading) { return <Spinner />; }
    return (
      <div className={rewardsContainerClass}>
        <Switch>
          <Route path={rewardsRoute.subSections.pointsHistory.pathPattern} component={PointsHistoryContainer} />
          <Route path={rewardsRoute.subSections.offersAndCoupons.pathPattern} component={OffersAndCouponsContainer} />
          <Route path={rewardsRoute.subSections.pointsClaim.pathPattern} component={PointsClaimFormContainer} />
          <Route component={EarnedRewardsContainer} />
        </Switch>
      </div>
    );
  }
}
