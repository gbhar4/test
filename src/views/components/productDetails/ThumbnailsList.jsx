/** @module ThumbnailsList
 * Shows thumbnail images.
 *
 * @author Florencia Acosta <facosta@minutentag.com>
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 */

import React from 'react';
import PropTypes from 'prop-types';
import {Thumbnail} from './Thumbnail.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.display-image-product.scss');
} else {
  require('./_m.display-image-product.scss');
}

class ThumbnailsList extends React.Component {
  static propTypes = {
    /** list of thumbnail images */
    images: PropTypes.arrayOf(
      PropTypes.shape({
        imageName: PropTypes.string.isRequired,
        imageUrl: PropTypes.string.isRequired
      })
    ).isRequired,
    /** index of the currently selected image in the images array */
    selectedImageIndex: PropTypes.number.isRequired,
    /**
     * Function to call when a thumbnail is clicked, which will receive the id
     * of the corresponding image as the only parameter.
     */
    onThumbnailClick: PropTypes.func
  }

  render () {
    let {images, onThumbnailClick, selectedImageIndex} = this.props;

    return (
      <ul className="preview-image-list">
        {images.map((image, index) => (
          <Thumbnail key={index} image={{name: image.imageName, thumbnailPath: image.imageUrl, id: index}}
            isSelected={selectedImageIndex === index} onClick={onThumbnailClick} />
        ))}
      </ul>
    );
  }
}

export {ThumbnailsList};
