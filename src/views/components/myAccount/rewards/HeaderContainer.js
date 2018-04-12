/** @module HeaderContainer
 *
 * @author Miguel <malvarez@minutentag.com>
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {Header} from './Header.jsx';
import {couponsAndPromosStoreView} from 'reduxStore/storeViews/couponsAndPromosStoreView';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';

function mapStateToProps (state) {
  return {
    offersAndCouponsNumber: couponsAndPromosStoreView.getPlaceCashAndPublicCoupons(state).length,
    isCanada: sitesAndCountriesStoreView.getIsCanada(state)
  };
}

let HeaderContainer = connectPlusStoreOperators(mapStateToProps)(Header);

export {HeaderContainer};
