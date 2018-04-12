/**
 * @module PickUpFormPartContainer
 * @author Agustin H. Andina Silva <asilva@minutentag.com>
 * Exports the container component for the PickUpFormPart component,
 * connecting state to it's props.
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {PickUpFormPart} from './PickUpFormPart.jsx';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';

let mapStateToProps = function (state, ownProps, storeOperators) {
  let isGuest = userStoreView.isGuest(state);

  return {
    isGuest: userStoreView.isGuest(state),
    emailAddress: !isGuest ? userStoreView.getUserEmail(state) : null,
    isMobile: routingInfoStoreView.getIsMobile(state),
    isSMSActive: false
  };
};

let PickUpFormPartContainer = connectPlusStoreOperators(mapStateToProps)(PickUpFormPart);

export {PickUpFormPartContainer};
