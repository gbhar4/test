import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {FooterGlobal} from './FooterGlobal.jsx';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';

const mapStateToProps = function (state) {
  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    countryCode: sitesAndCountriesStoreView.getCurrentSiteId(state)
  };
};

const FooterGlobalContainer = connectPlusStoreOperators(mapStateToProps)(FooterGlobal);
export {FooterGlobalContainer};
