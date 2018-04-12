import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {HeaderGlobalTopBar} from './HeaderGlobalTopBar.jsx';
import {storesStoreView} from 'reduxStore/storeViews/storesStoreView.js';
import {MAIN_CONTENT_SELECTOR} from 'util/viewUtil/scrollingAndFocusing.js';

const mapStateToProps = function (state) {
  let defaultStore = storesStoreView.getDefaultStore(state);

  return {
    defaultStoreName: defaultStore ? defaultStore.basicInfo.storeName : null,
    mainContentSelector: MAIN_CONTENT_SELECTOR
  };
};

let HeaderGlobalTopBarContainer = connectPlusStoreOperators(mapStateToProps)(HeaderGlobalTopBar);

export {HeaderGlobalTopBarContainer};
