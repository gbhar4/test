/**
 * @module MyBagEmptyContainer
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 * Exports the container component for the MyBagEmpty component, connecting
 * state to it's props.
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {MyBagEmpty} from './MyBagEmpty.jsx';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView.js';

const mapStateToProps = function (state) {
  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    isRewardsEnabled: sitesAndCountriesStoreView.isRewardsEnabled(state)
  };
};

let MyBagEmptyContainer = connectPlusStoreOperators(mapStateToProps)(MyBagEmpty);

export {MyBagEmptyContainer};
