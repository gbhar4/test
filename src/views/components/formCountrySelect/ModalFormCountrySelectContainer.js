/** @module ModalFormCountrySelectContainer
 *
 * @author Ben
 */

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {ModalFormCountrySelect} from './ModalFormCountrySelect.jsx';
import {globalSignalsStoreView} from 'reduxStore/storeViews/globalSignalsStoreView';
import {getGlobalSignalsOperator} from 'reduxStore/storeOperators/uiSignals/globalSignalsOperator';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isOpen: globalSignalsStoreView.getIsCountrySelectorVisible(state),
    onCloseClick: storeOperators.globalSignalsOperator.closeCountrySelectorModal
  };
}

let ModalFormCountrySelectContainer = connectPlusStoreOperators(
  {globalSignalsOperator: getGlobalSignalsOperator}, mapStateToProps
)(ModalFormCountrySelect);

export {ModalFormCountrySelectContainer};
