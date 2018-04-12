/** @module ReservationsList
 * @summary Table with the history of reservations for the user.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName.js';
import {HyperLink} from 'views/components/common/routing/HyperLink.jsx';
import {MY_ACCOUNT_SECTIONS} from 'routing/routes/myAccountRoutes.js';

if (DESKTOP) { // eslint-disable-line
  require('./_d.reservation-list.scss');
} else {
  require('./_m.reservation-list.scss');
}

class ReservationsList extends React.Component {
  static propTypes = {
    /** array of reservations for the current list page */
    reservationsList: PropTypes.arrayOf(PropTypes.shape({
      /** Date of the reservation. */
      reserveDate: PropTypes.string.isRequired,
      /** Date of the reservation. */
      expiryDate: PropTypes.string.isRequired,
      /** Number of the reservation. */
      reservationId: PropTypes.string.isRequired,
      /** Current status of the reservation. */
      reservationStatus: PropTypes.string.isRequired
    })),
    /** flag indicating if we're rendering for mobile */
    isMobile: PropTypes.bool.isRequired
  }

  static defaultProps = {
    reservationsList: []
  }

  render () {
    let {reservationsList, isMobile} = this.props;

    return (
      <table className={cssClassName('order-or-reservation-list', {' table-reservation': isMobile})}>
        {!isMobile &&
          <thead>
            <tr className="table-reservation-title">
              <th>Reservation Date</th>
              <th>Reservation ID</th>
              <th>Expiration Date</th>
              <th>Status</th>
            </tr>
          </thead>
        }

        <tbody>
        {reservationsList.map((reservation) =>
          <tr key={reservation.reservationId} className="reservation-item">
            <td className="reservation-date">{reservation.reserveDate}</td>
            <td className="reservation-number-container">
              <HyperLink destination={MY_ACCOUNT_SECTIONS.reservations.subSections.reservationDetails}
                pathSuffix={reservation.reservationId} className="reservation-number">{reservation.reservationId}</HyperLink>
            </td>
            {isMobile && <td className="status-reservation">{reservation.reservationStatus}</td>}
            <td className="expiration-date-item">{isMobile && 'Expiration Date: '}{reservation.expiryDate}</td>
            {!isMobile && <td className="status-reservation">{reservation.reservationStatus}</td>}
          </tr>
        )}
        </tbody>
      </table>
    );
  }
}

export {ReservationsList};
