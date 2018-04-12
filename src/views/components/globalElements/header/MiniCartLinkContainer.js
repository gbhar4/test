import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {MiniCartLink} from './MiniCartLink.jsx';
import {cartStoreView} from 'reduxStore/storeViews/cartStoreView';

function mapStateToProps (state) {
  return {
    itemsCount: cartStoreView.getItemsCount(state)
  };
}

let MiniCartLinkContainer = connectPlusStoreOperators(mapStateToProps)(MiniCartLink);
export {MiniCartLinkContainer};
