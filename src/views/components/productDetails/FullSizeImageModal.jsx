/** @module FullSizeImageModal
 * @summary Show a modal with the images for all the swatches/colors of a
 * product.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 */

import React from 'react';
import {PropTypes} from 'prop-types';
import {Modal} from 'views/components/modal/Modal.jsx';
import {ModalHeaderDisplayContainer} from 'views/components/modal/ModalHeaderDisplayContainer.jsx';
import cssClassName from 'util/viewUtil/cssClassName';
import {onDoubleTap} from 'util/viewUtil/captureDoubleTap';

if (DESKTOP) { // eslint-disable-line
  require('./_d.image-details-modal.scss');
} else {
  require('./_m.image-details-modal.scss');
}

export class FullSizeImageModal extends React.Component {
  static propTypes = {
    /** Current image's name or title to product's figure */
    name: PropTypes.string,

    /** Current image's path to main product's figure.  */
    image: PropTypes.string.isRequired,

    /** function to call to close this modal */
    onCloseClick: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);

    this.state = { isZoomIn: !!this.props.isZoomIn };
    this.handleTouchStart = onDoubleTap(() => {
      this.setState({ isZoomIn: !this.state.isZoomIn });
    });
  }

  render () {
    let {onCloseClick, className, name, image} = this.props;
    let {isZoomIn} = this.state;
    className = cssClassName('image-zoom ', {'active-zoom-in ': isZoomIn}, className);

    return (
      <Modal isOpen contentLabel="Simple Image preview" className="overlay-container overlay-simple-image-details"
        overlayClassName="react-overlay overlay-center">
        <ModalHeaderDisplayContainer onCloseClick={onCloseClick} />

        <div className="overlay-content">
          <figure className={className} onTouchStart={this.handleTouchStart}>
            <img src={image} alt={name} />
          </figure>
        </div>
      </Modal>
    );
  }
}
