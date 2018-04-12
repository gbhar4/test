/**
 * @module Reservations
 * Shows the different views for the user to see the list and details of his
 * reservations in My Account.
 *
 * @author Miguel <malvarez@minutentag.com>
 * @author gabriel gomez
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {ReservationsHistoryContainer} from './ReservationsHistoryContainer';
import {ReservationDetailsContainer} from './ReservationDetailsContainer';
import {Route} from 'views/components/common/routing/Route.jsx';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';
import {BreadCrumbs} from 'views/components/common/routing/BreadCrumbs.jsx';
import {Spinner} from 'views/components/common/Spinner.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.reservation-section.scss');
} else {
  require('./_m.reservation-section.scss');
}

class Reservations extends React.Component {
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

    if (this.state.isLoading) { return <Spinner />; }
    return (
      <div className={className}>
        <Route component={BreadCrumbs} componentProps={{sections: MY_ACCOUNT_SECTIONS}} />
        <Route exact path={MY_ACCOUNT_SECTIONS.reservations.pathPattern}
          component={ReservationsHistoryContainer} />
        <Route path={MY_ACCOUNT_SECTIONS.reservations.subSections.reservationDetails.pathPattern}
          component={ReservationDetailsContainer} />
      </div>
    );
  }
}

export {Reservations};
