/**
 * @module MyBagDrawerNonEmptyContainer
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * Exports the container component for the MyBagDrawerNonEmpty component,
 * connecting state to it's props.
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {MiniBagDrawerNonEmpty} from './MiniBagDrawerNonEmpty.jsx';
import {userStoreView} from 'reduxStore/storeViews/userStoreView';
import {getCartOperator} from 'reduxStore/storeOperators/cartOperator.js';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';

const mapStateToProps = function (state, ownProps, storeOperators) {
  return {
    isGuest: userStoreView.isGuest(state),
    isPayPalEnabled: cartStoreView.getIsPayPalEnabled(state),
    isRemembered: userStoreView.isRemembered(state),
    onCheckoutClick: storeOperators.cartOperator.startCheckout,
    isAirMilesEnabled: sitesAndCountriesStoreView.isAirMilesEnabled(state),
    isShowingUnavailableOrOssNotification: (cartStoreView.getUnavailableCount(state) > 0) || (cartStoreView.getOOSCount(state) > 0),
    isShowingUpdatedNotification: cartStoreView.getIsShowingNotification(state),
    userHasPlcc: userStoreView.getUserIsPlcc(state)
  };
};

let MiniBagDrawerNonEmptyContainer = connectPlusStoreOperators(
  {cartOperator: getCartOperator}, mapStateToProps
)(MiniBagDrawerNonEmpty);

export {MiniBagDrawerNonEmptyContainer};
