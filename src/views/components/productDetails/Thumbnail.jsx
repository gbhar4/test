/** @module Thumbnail
 * Shows a thumbnail image.
 *
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 */

import React from 'react';
import PropTypes from 'prop-types';
import cssClassName from 'util/viewUtil/cssClassName.js';

class Thumbnail extends React.Component {
  static propTypes = {
    /** thumbnail image data */
    image: PropTypes.shape({
      /** id of the image */
      id: PropTypes.number.isRequired,
      /** thumbnail's name */
      name: PropTypes.string.isRequired,
      /** url path of the thumbnail */
      thumbnailPath: PropTypes.string.isRequired
    }).isRequired,
    /** flags if the thumbnail should be shown as selected */
    isSelected: PropTypes.bool,
    /**
     * Function to call when a thumbnail is clicked, which will receive the id
     * of the corresponding image as the only parameter.
     */
    onClick: PropTypes.func
  }

  constructor (props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick () {
    let {onClick, image: {id}} = this.props;
    onClick && onClick(id);
  }

  render () {
    let {image, isSelected} = this.props;
    let className = cssClassName('preview-image-item ', {'preview-image-item-selected': isSelected});

    return (
      <li className={className}>
        <button className="image-item" onClick={this.handleClick} itemScope itemType="http://schema.org/ImageObject">
          <img src={image.thumbnailPath} alt={image.name} title={image.name} itemProp="thumbnailUrl" />
        </button>
      </li>
    );
  }
}

export {Thumbnail};
