/** @module IconContainer
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 */
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {sitesAndCountriesStoreView} from 'reduxStore/storeViews/sitesAndCountriesStoreView';
import {Icon} from './Icon.jsx';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isCanada: !sitesAndCountriesStoreView.isRewardsEnabled(state)
  };
}

let IconContainer = connectPlusStoreOperators(mapStateToProps)(Icon);

export {IconContainer};
