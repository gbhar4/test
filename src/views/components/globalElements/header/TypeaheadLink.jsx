/**
 * @module TypeaheadLink
 * @author Oliver Ramírez
 * @author Florencia <facosta@minutentag.com>
 *
 */
import React from 'react';

import {InputWithTypeAheadContainer} from 'views/components/globalElements/header/InputWithTypeAheadContainer.js';
import {Modal} from 'views/components/modal/Modal.jsx';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';
import {isTouchClient} from 'routing/routingHelper';

export class TypeaheadLink extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: !!props.isOpen
    };

    this.handleToggleTypeahead = this.handleToggleTypeahead.bind(this);
  }

  handleToggleTypeahead () {
    this.setState({ isOpen: !this.state.isOpen });

    if (isTouchClient()) {
      if (this.state.isOpen) {
        document.removeEventListener('touchstart', this.handleInputBlur);
      } else {
        document.addEventListener('touchstart', this.handleInputBlur);
      }
    }
  }

  handleInputBlur () {
    let activeElement = document.activeElement;
    activeElement && activeElement.nodeName === 'INPUT' && activeElement.blur();
  }

  render () {
    let {isOpen} = this.state;

    return (
      <div className="typeahead-section">
        <button className="typeahead-icon" title="Typeahead" onClick={this.handleToggleTypeahead}>Search</button>
        {isOpen && <Modal contentLabel="Typeahead" className="overlay-container"
            overlayClassName="typeahead-overlay react-overlay overlay-center" isOpen={isOpen}>
            <ModalHeaderDisplayContainer onCloseClick={this.handleToggleTypeahead} />
            <InputWithTypeAheadContainer />
          </Modal>
        }
      </div>
    );
  }
}
