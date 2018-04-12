/**
 * FIXME: no comments?
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {GlobalNavigationBar} from './GlobalNavigationBar.jsx';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView';

let mapStateToProps = function (state) {
  let menuList = generalStoreView.getHeaderNavigationTree(state);

  return {
    menusList: menuList,
    containsActiveCategory: menuList.findIndex((category) => category.selected) >= 0, // FIXME: this should be done at the StoreView level
    isMobile: routingInfoStoreView.getIsMobile(state)
  };

};
let GlobalNavigationBarContainer = connectPlusStoreOperators(mapStateToProps)(GlobalNavigationBar);

export { GlobalNavigationBarContainer };
