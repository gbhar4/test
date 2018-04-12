/**
 * @module ReservationsHistory
 * Shows a list of reservations with pagination in my account.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {ReservationsList} from './ReservationsList.jsx';
import {PagedListNav} from 'views/components/common/PagedListNav.jsx';

class ReservationsHistory extends React.Component {
  static propTypes = {
    /** total number of reservation pages */
    totalNumberOfPages: PropTypes.number.isRequired,
    /**
     * callback to handle request to view a certain page of the list. It should
     * accept a single parameter that is the page number (one-based).
     */
    onGoToPage: PropTypes.func.isRequired,
    /**
     * array with one element for each page. Each element is itself and array
     * of the reservations in the page.
     */
    reservationsPages: PropTypes.array.isRequired,
    /** merge page nav propTypes */
    ...PagedListNav.propTypes,
    /** flag indicating if we're rendering for mobile */
    isMobile: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props);
    this.state = {currentPage: 1};
    this.handleGoToPage = this.handleGoToPage.bind(this);
  }

  handleGoToPage (pageNumber) {
    this.props.onGoToPage(pageNumber).then(() => {
      this.setState({currentPage: pageNumber});
    });
  }

  render () {
    let {reservationsPages, totalNumberOfPages, isMobile} = this.props;
    let {currentPage} = this.state;
    let currentPageReservations = reservationsPages[currentPage - 1];

    return (
      <section className="reservations-section">
        <div className="reservation-list-container">
          {isMobile &&
            <PagedListNav {...{currentPage, totalNumberOfPages}}
              onGoToPage={this.handleGoToPage} />}
          <ReservationsList reservationsList={currentPageReservations} isMobile={isMobile} />
          <PagedListNav {...{currentPage, totalNumberOfPages}}
            onGoToPage={this.handleGoToPage} />
        </div>
      </section>
    );
  }
}

export {ReservationsHistory};
