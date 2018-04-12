/** @module ReservationDetailsContainer
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import {PropTypes} from 'prop-types';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {ReservationDetails} from './ReservationDetails.jsx';
import {reservationsStoreView} from 'reduxStore/storeViews/reservationsStoreView';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';
import {getReservationsOperator} from 'reduxStore/storeOperators/reservationsOperator';
import {userStoreView} from 'reduxStore/storeViews/userStoreView.js';

const PROP_TYPES = {
  /** match prop passed by Route component */
  match: PropTypes.shape({
    params: PropTypes.object.isRequired
  }).isRequired
};

function mapStateToProps (state, ownProps, storeOperators) {
  let reservationId = ownProps.match.params.reservationId;
  let reservationSummary = !userStoreView.isGuest(state) && reservationsStoreView.getReservationsHistorySummary(state, reservationId);

  return {
    reservationId: ownProps.match.params.reservationId,
    emailAddress: ownProps.match.params.emailAddress || (reservationSummary && reservationSummary.emailAddress),
    onLoadReservationDetails: storeOperators.reservations.getSubmittedReservationDetails,
    reservation: reservationsStoreView.getSubmittedReservationDetails(state),
    currencySymbol: sitesAndCountriesStoreView.getCurrentCurrencySymbol(state),
    isMobile: routingInfoStoreView.getIsMobile(state),
    isGuest: userStoreView.isGuest(state)
  };
}

let ReservationDetailsContainer = connectPlusStoreOperators({
  reservations: getReservationsOperator
}, mapStateToProps)(ReservationDetails);
ReservationDetailsContainer.propTypes = {...ReservationDetailsContainer.propTypes, ...PROP_TYPES};

export {ReservationDetailsContainer};
