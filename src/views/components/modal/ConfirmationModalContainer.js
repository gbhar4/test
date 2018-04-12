import {PropTypes} from 'prop-types';
import {connectPlusStoreOperators} from 'reduxStore/util/connectPlusStoreOperators';
import {ConfirmationModal} from './ConfirmationModal.jsx';
import {generalStoreView} from 'reduxStore/storeViews/generalStoreView';
import {routingInfoStoreView} from 'reduxStore/storeViews/routing/routingInfoStoreView';

const NOP = () => {};

const PROP_TYPES = {
  /**
   * The id of this confirmation modal instance;
   * this is used differentiate it from other confirmation modals
   */
  modalId: PropTypes.string.isRequired
};

function mapStateToProps (state, ownProps) {
  return {
    isMobile: routingInfoStoreView.getIsMobile(state),
    isOpen: generalStoreView.getOpenModalId(state) === ownProps.modalId,
    onConfirm: generalStoreView.getConfirmModalOkCallback(state) || NOP,
    onModalClose: generalStoreView.getConfirmModalCancelCallback(state) || NOP
  };
}

let ConfirmationModalContainer = connectPlusStoreOperators(mapStateToProps)(ConfirmationModal);
ConfirmationModalContainer.propTypes = {...ConfirmationModalContainer.propTypes, ...PROP_TYPES};

export {ConfirmationModalContainer};
