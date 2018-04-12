/**
 * @module ContentSlotListModal
 * Component which renders a list of content slots (array) and its props
 * inside a react-modal.
 *
 * This modal will be open whenever it's rendered, so the way to avoid it
 * being open is not to render it at all.
 *
 * Note that any extra props other than <code>title, selectedAddress, addressSuggestionsList,
 *  onModalClose, onSubmit, className, overlayClassName</code>,
 * e.g., <code>portalClassName</code>, that are passed to this component will be passed along to the rendered react-modal.
 *
 * @author Miguel Alvarez Igarzábal <malvarez@d3sistemas.com.ar>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Modal} from 'views/components/modal/Modal.jsx';
import {ContentSlotList} from './ContentSlotList.jsx';
import cssClassName from 'util/viewUtil/cssClassName';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';

export class ContentSlotListModal extends React.Component {

  static propTypes = {
    /** List that holds all content slots and corresponding props. */
    contentSlots: PropTypes.arrayOf(PropTypes.shape({
      contentSlotName: PropTypes.string.isRequired,
      props: PropTypes.object
    })).isRequired,
    /*
     * String indicating how the content container should be announced to
     * screenreaders.
     */
    contentLabel: PropTypes.string.isRequired,
    /*
     * String className to be applied to the overlay. This class names will be
     * appended to the default react-overlay class name. e.g.: overlay-center
     */
    overlayClassName: PropTypes.string.isRequired,
    /*
     * String className to be applied to the modal content.
     * Default value: overlay-container
     */
    className: PropTypes.string,
    /* Function to be called when the modal is requested to be closed. */
    onRequestClose: PropTypes.func.isRequired
  }

  static defaultProps = {
    className: 'overlay-container'
  }

  render () {
    let {contentSlots, contentLabel, overlayClassName, className, onRequestClose,
      ...otherProps} = this.props;
    overlayClassName = cssClassName('react-overlay ', overlayClassName);
    return (
      <Modal className={className} contentLabel={contentLabel} overlayClassName={overlayClassName}
        isOpen onRequestClose={onRequestClose} {...otherProps}>
        <ModalHeaderDisplayContainer onCloseClick={onRequestClose} />
        <ContentSlotList contentSlots={contentSlots} />
      </Modal>
    );
  }
}
