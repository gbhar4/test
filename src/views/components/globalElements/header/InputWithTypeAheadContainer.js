/** @module InputWithTypeAheadContainer
 * @summary A container component for {@linkcode InputWithTypeAhead}.
 *
 * @author Ben
 */
import {InputWithTypeAhead} from './InputWithTypeAhead.jsx';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {getGlobalComponentsFormOperator} from 'reduxStore/storeOperators/formOperators/globalComponentsFormOperator';
import {searchStoreView} from 'reduxStore/storeViews/searchStoreView';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    suggestionsMap: searchStoreView.getSearchSuggestions(state),
    onTypedTextChange: storeOperators.globalComponentsFormOperator.submitGetSearchSuggestions,
    onSubmitKeywordSearch: storeOperators.globalComponentsFormOperator.submitKeywordSearch
  };
}

let InputWithTypeAheadContainer = connectPlusStoreOperators(
  {globalComponentsFormOperator: getGlobalComponentsFormOperator},
  mapStateToProps
)(InputWithTypeAhead);

export {InputWithTypeAheadContainer};
