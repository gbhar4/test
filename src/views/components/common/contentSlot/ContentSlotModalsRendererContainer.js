/** @module ContentSlotModalsRendererContainer
 *
 * @author Ben
 */

import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {ContentSlotModalsRenderer} from './ContentSlotModalsRenderer.jsx';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView';
import {getGeneralOperator} from 'reduxStore/storeOperators/generalOperator';

const mapStateToProps = function (state, ownProps, storeOperators) {
  return {
    modalId: generalStoreView.getOpenModalId(state),
    openModal: storeOperators.generalOperator.openCustomModal
  };
};

let ContentSlotModalsRendererContainer = connectPlusStoreOperators({
  generalOperator: getGeneralOperator
},
mapStateToProps)(ContentSlotModalsRenderer);

export {ContentSlotModalsRendererContainer};
