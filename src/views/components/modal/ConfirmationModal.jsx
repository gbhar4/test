/** @module ConfirmationModal
 * @summary A modal displaying a confirmation dialog (similar to window.alert).
 *
 * Note that any extra props other than <code>title, prompt, promptClassName, confirmButtonText, cancelButtonText,
 *  onModalClose, onConfirm</code>, e.g., <code>contentLabel</code>, that are passed to this component
 *  will be passed along to the rendered react-modal.
 *
 * @author Ben
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {Modal} from 'views/components/modal/Modal.jsx';
import {ModalHeaderDisplayContainer} from './ModalHeaderDisplayContainer.jsx';
import cssClassName from 'util/viewUtil/cssClassName';

if (DESKTOP) { // eslint-disable-line
  require('./_d.modal-confirmation.scss');
} else {
  require('./_m.modal-confirmation.scss');
}

export class ConfirmationModal extends React.Component {

  static propTypes = {
    /** Please note that the container of this object defines and extra prop called
    modalId */

    /** Indicates mobile version (most components need it to handle specific layout settings) */
    isMobile: PropTypes.bool.isRequired,
    /** title for the modal */
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    /** subtitle for the modal */
    subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

    /** the alert messasge to prompt the user */
    prompt: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,

    /** an optional css class name for the <p> element rendering the prompt */
    promptClassName: PropTypes.string,

    /** text of confirm button (defaults to "OK") */
    confirmButtonText: PropTypes.string,
    /** text of confirm button (defaults to "Cancel") */
    cancelButtonText: PropTypes.string,

    /** Callback to dismiss this modal, and cancel the submit */
    onModalClose: PropTypes.func.isRequired,
    /**
     * Callback to call when the confirmation (i.e., OK) button is clicked.
     */
    onConfirm: PropTypes.func.isRequired,
    /** Indicates how the content container of this modal
     * should be announced to screenreaders.
     * See the prop with the same name in (Modal of react-modal).
     */
    contentLabel: PropTypes.string.isRequired,

    /** flags if this modal should be displayed */
    isOpen: PropTypes.bool.isRequired
  }

  static defaultProps = {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel'
  }

  render () {
    let {isMobile, isOpen, title, subtitle, prompt, promptClassName, onModalClose, onConfirm, confirmButtonText, cancelButtonText,
      ...otherProps} = this.props;
    let confirmationContainerClass = cssClassName('overlay-container ', 'overlay-confirmation ', promptClassName, {'-container': !!promptClassName});

    // NOTE: do not even render <Modal> if it's not open. There's a bug un react-modal when there are multiple modals (not necesarely opened)
    // depending on the order of propagation of the open state, the global body class gets removed causing a scroll-on-background issue
    // I didn't dig too much into it, but rendering only the open ones solves the problem
    if (!isOpen) { return null; }

    return (
      <Modal {...otherProps} isOpen className={confirmationContainerClass} overlayClassName="react-overlay overlay-center">
        <div className="container-confirmation">
          <ModalHeaderDisplayContainer isMobile={isMobile} title={title} subtitle={subtitle} onCloseClick={onModalClose} />
          <div className={promptClassName}>{prompt}</div>

          <div className="overlay-button-container">
            <button type="button" className="button-cancel" aria-label="cancel" onClick={onModalClose}>{cancelButtonText}</button>
            <button type="button" className="button-confirm" aria-label="confirm" onClick={onConfirm}>{confirmButtonText}</button>
          </div>
        </div>
      </Modal>
    );
  }

}
