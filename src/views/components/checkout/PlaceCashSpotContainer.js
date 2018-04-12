/** @module PlaceCashSpotContainer
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 */

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {PlaceCashSpot} from './PlaceCashSpot.jsx';
import {confirmationStoreView} from 'reduxStore/storeViews/confirmationStoreView';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';

function mapStateToProps (state, ownProps, storeOperators) {
  let earnedPlaceCashValue = '';
  if (ownProps.isConfirmation) {
    earnedPlaceCashValue = confirmationStoreView.getEarnedPlaceCashValue(state);
  } else {
    earnedPlaceCashValue = cartStoreView.getRewardToBeEarned(state);
  }

  return {
    isEnabled: cartStoreView.getPlaceCashSpotEnabled(state) || confirmationStoreView.getPlaceCashSpotEnabled(state),
    currencySymbol: sitesAndCountriesStoreView.getCurrentCurrencySymbol(state),
    value: earnedPlaceCashValue,
    isInternationalShipping: sitesAndCountriesStoreView.getIsInternationalShipping(state)
  };
}

let PlaceCashSpotContainer = connectPlusStoreOperators(mapStateToProps)(PlaceCashSpot);
export {PlaceCashSpotContainer};
