/**
 * @module ReservationDetails
 * Shows the details of a reservation.
 *
 * @author Miguel <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {ReservationSummary} from './ReservationSummary.jsx';
import {ReservationStatus} from './ReservationStatus.jsx';
import {OrderItemsList} from 'views/components/myAccount/orders/OrderItemsList.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./reservationDetails/_d.reservation-details.scss');
  require('./_d.reservation-list.scss');
} else {
  require('./reservationDetails/_m.reservation-details.scss');
  require('./_m.reservation-list.scss');
}

class ReservationDetails extends React.Component {
  static propTypes = {
    /** id of the reservation whose details to show */
    reservationId: PropTypes.string.isRequired,
    /** for guest user, email address to use to search for the reservation. It
     * must receive two parameters:
     *  -reservationId: number/id of the reservation to load
     *  -emailAddress (optional): email of the guest user which generated the
     *  order.
    */
    emailAddress: PropTypes.string,
    /** function to call to have the reservation details loaded */
    onLoadReservationDetails: PropTypes.func.isRequired,
    /** The whole information of the reservation. */
    reservation: PropTypes.shape({
      ...ReservationSummary.propTypes,
      ...ReservationStatus.propTypes,
      purchasedItems: OrderItemsList.propTypes.orderItems,
      canceledItems: OrderItemsList.propTypes.orderItems
    }),
    /** This is used to display the correct currency symbol */
    currencySymbol: PropTypes.string.isRequired,
    /** flag indicating if we're rendering for mobile */
    isMobile: PropTypes.bool.isRequired,
    /** Flag indicates whether the user is a guest */
    isGuest: PropTypes.bool
  }

  loadingReservationId: null

  componentDidMount () {
    this.loadReservationDetails(this.props);
  }

  componentWillReceiveProps (nextProps) {
    this.loadReservationDetails(nextProps);
  }

  loadReservationDetails (props) {
    let {reservationId, emailAddress} = props;
    if (this.loadingReservationId !== reservationId) {
      this.loadingReservationId = reservationId;
      this.props.onLoadReservationDetails(reservationId, emailAddress);
    }
  }

  render () {
    if (!this.props.reservation) {
      if (this.props.isGuest) {
        return <section className="unavailable-reservation-details">
          <h1 className="reservation-details-section-title">Your reservation was not found.</h1>
        </section>;
      }
      return <section className="unavailable-reservation-details"></section>;
    }

    let {reservation: {
      orderNumber, orderDate, pickUpExpirationDate, checkout, status, pickedUpDate, purchasedItems, canceledItems
    }, currencySymbol, isMobile} = this.props;

    let reservationStatus =
      <ReservationStatus {...{status, pickUpExpirationDate, pickedUpDate}} />;

    return (
      <section className="reservation-details-section">
        {isMobile && reservationStatus}
        <ReservationSummary {...{orderNumber, orderDate, pickUpExpirationDate, checkout}} />
        <div className="order-list-container">
          {!isMobile && reservationStatus}

          {purchasedItems.length > 0 &&
            <OrderItemsList isMobile={isMobile} items={purchasedItems} currencySymbol={currencySymbol}
              className="processing-list" isShowWriteReview={false}
              header={<p className="header-status">Reserved Items: {purchasedItems.length}</p>}
            />}

          {canceledItems.length > 0 &&
            <OrderItemsList isMobile={isMobile} items={canceledItems} currencySymbol={currencySymbol}
              className="canceled-list" isShowWriteReview={false}
              header={<p className="header-status">Canceled Items: {canceledItems.length}</p>}
            />}
        </div>
      </section>
    );
  }
}

export {ReservationDetails};
