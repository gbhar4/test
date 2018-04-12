/** @module ReservationsHistoryContainer
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {ReservationsHistory} from './ReservationsHistory.jsx';
import {reservationsStoreView} from 'reduxStore/storeViews/reservationsStoreView';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView.js';
import {getReservationsOperator} from 'reduxStore/storeOperators/reservationsOperator';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    reservationsPages: reservationsStoreView.getReservationsHistoryPages(state),
    totalNumberOfPages: reservationsStoreView.getReservationsHistoryTotalPages(state),
    onGoToPage: storeOperators.reservations.getReservationsHistoryPage,
    isMobile: routingInfoStoreView.getIsMobile(state)
  };
}

let ReservationsHistoryContainer = connectPlusStoreOperators({
  reservations: getReservationsOperator
}, mapStateToProps)(ReservationsHistory);

export {ReservationsHistoryContainer};
