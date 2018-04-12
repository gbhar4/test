/**
 * @module ReservationDetailsPageContainer
 *
 * @author Florencia <fcosta@minutentag.com>
 * @author Miguel <malvarez@minutentag.com>
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {ReservationDetailsPage} from './ReservationDetailsPage.jsx';
import {getGeneralOperator} from 'reduxStore/storeOperators/generalOperator.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    isLoading: generalStoreView.getIsLoading(state)
  };
}

let ReservationDetailsPageContainer = connectPlusStoreOperators({
  general: getGeneralOperator
}, mapStateToProps)(ReservationDetailsPage);

export {ReservationDetailsPageContainer};
