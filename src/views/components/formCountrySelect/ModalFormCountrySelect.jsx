/**
 * @module ModalFormCountrySelect
 * @author Miguel Alvarze Igarzábal
 * Modal to include the FormCountrySelect component.
 */
import React from 'react';
import {PropTypes} from 'prop-types';
import {Modal} from 'views/components/modal/Modal.jsx';
import {FormCountrySelectContainer} from './FormCountrySelectContainer.js';

export class ModalFormCountrySelect extends React.Component {
  static propTypes = {
    /** Whether the modal should be open. */
    isOpen: PropTypes.bool,

    /** Callback to close the modal */
    onCloseClick: PropTypes.func.isRequired
  }

  render () {
    let {isOpen, onCloseClick} = this.props;

    return (isOpen
      ? <Modal contentLabel="Select Shiping Country, Language, and Currency Modal" className="overlay-container" overlayClassName="react-overlay overlay-center" preventEventBubbling isOpen>
        <div className="overlay-content ship-to">
          <FormCountrySelectContainer onCloseClick={onCloseClick} />
        </div>
      </Modal> : null
    );
  }
}
