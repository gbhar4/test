import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {checkoutStoreView} from 'reduxStore/storeViews/checkoutStoreView.js';

const mapStateToProps = function (state) {
  return {
    isExpressCheckout: checkoutStoreView.isExpressCheckout(state)
  };
};

let expressCheckoutConnect = connectPlusStoreOperators(mapStateToProps);
export {expressCheckoutConnect};
