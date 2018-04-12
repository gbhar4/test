import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {HelpCenter} from './HelpCenter.jsx';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';

// function mapStateToProps (state, ownProps, storeOperators) {
let mapStateToProps = function (state, ownProps, storeOperators) {
  return {
    isMobile: routingInfoStoreView.getIsMobile(state)
  };
};

let HelpCenterContainer = connectPlusStoreOperators(mapStateToProps)(HelpCenter);

export {HelpCenterContainer};
