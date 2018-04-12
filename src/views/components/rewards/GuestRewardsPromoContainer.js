/**
 * Author NM
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {GuestRewardsPromo} from './GuestRewardsPromo.jsx';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    globalSignalsOperator: storeOperators.globalSignalsOperator,
    pointsInYourBag: cartStoreView.getEstimatedRewardsEarned(state),
    isRemembered: userStoreView.isRemembered(state)
  };
}

let GuestRewardsPromoContainer = connectPlusStoreOperators(
  {globalSignalsOperator: getGlobalSignalsOperator}, mapStateToProps
)(GuestRewardsPromo);

export {GuestRewardsPromoContainer};
