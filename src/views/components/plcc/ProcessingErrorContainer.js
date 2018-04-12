/**
 * @module Processing Error Container
 * @author Florencia Acosta
 */

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {plccStoreView} from 'reduxStore/storeViews/plccStoreView.js';
import {ProcessingError} from './ProcessingError.jsx';
import {getPlccOperator} from 'reduxStore/storeOperators/plccOperator.js';

function mapStateToProps (state, ownProps, storeOperators) {
  return {
    isModal: ownProps.isModal,
    isInstantCredit: ownProps.isInstantCredit,
    isApplicationTimeout: plccStoreView.isApplicationTimeout(state),
    onDissmissErrorModal: storeOperators.plccOperator.dismissErrorModal
  };
}

let ProcessingErrorContainer = connectPlusStoreOperators({
  plccOperator: getPlccOperator
}, mapStateToProps)(ProcessingError);

export {ProcessingErrorContainer};
