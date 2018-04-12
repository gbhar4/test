/**
 * @module ReservationStatus
 * Shows reservation status.
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {RESERVATION_STATUS} from 'reduxStore/storeReducersAndActions/user/reservations/reducer';
import invariant from 'invariant';
import formatTime from 'util/formatTime.js';

class ReservationStatus extends React.Component {
  static propTypes = {
    /** status of the reservation */
    status: PropTypes.oneOf(Object.keys(RESERVATION_STATUS).map((key) => RESERVATION_STATUS[key])).isRequired,
    /** date when a BOPIS order expires */
    pickUpExpirationDate: PropTypes.string,
    /** date when a BOPIS order has been picked up by the user */
    pickedUpDate: PropTypes.string
  }

  getLabelAndMessage () {
    let label, message;
    let {status, pickUpExpirationDate, pickedUpDate} = this.props;

    switch (status) {
      case RESERVATION_STATUS.RESERVATION_RECEIVED:
        label = 'Order in Process';
        message = '- We will notify you when your order is ready for pickup';
        break;
      case RESERVATION_STATUS.RESERVATION_CANCELED:
      case RESERVATION_STATUS.RESERVATION_EXPIRED:
        label = '';
        message = 'This order has been canceled.';
        break;
      case RESERVATION_STATUS.ITEMS_READY_FOR_PICKUP:
        label = 'Please pick up before:';
        message = pickUpExpirationDate;

        let pickUpExpirationTime = pickUpExpirationDate && pickUpExpirationDate.split(' ')[1];
        if (pickUpExpirationTime) {
          message += ` at ${formatTime(pickUpExpirationDate)}`;
        }
        break;
      case RESERVATION_STATUS.ITEMS_PICKED_UP:
        label = 'Picked up on:';
        message = pickedUpDate;

        let pickedUpTime = pickedUpDate.split(' ')[1];
        if (pickedUpTime) {
          message += ` at ${formatTime(pickedUpDate)}`;
        }
        break;
      default:
        invariant(false, `${status} is not one of the expected values for the reservation status.`);
    }

    return {label, message};
  }

  render () {
    let {label, message} = this.getLabelAndMessage();

    return (
      <div className="internal-notification reservation-notification">
        {label && <strong className="status">{label}</strong>}
        {message && <strong className="message">{message}</strong>}
      </div>
    );
  }
}

export {ReservationStatus};
