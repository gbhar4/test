/**
 * @module Plcc Promo Modal (for checkout) Container
 * @author Agu
 */

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {PLCCPromoModal} from './PLCCPromoModal.jsx';
import {getPlccOperator} from 'reduxStore/storeOperators/plccOperator.js';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    onAcceptPlccPromo: storeOperators.plccOperator.submitAcceptPlccOffer,
    onDeclinePlccPromo: storeOperators.plccOperator.submitDeclinePlccOffer,
    isMobile: routingInfoStoreView.getIsMobile(state)
  };
}

let PLCCPromoModalContainer = connectPlusStoreOperators({
  plccOperator: getPlccOperator
}, mapStateToProps)(PLCCPromoModal);

export {PLCCPromoModalContainer};
