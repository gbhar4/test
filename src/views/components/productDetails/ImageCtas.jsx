/** @module ImageCtas
 * Shows the buttons to navigate the images or show them in full size.
 *
 * @author Miguel Alvarez Igarzábal <malvarez@minutentag.com>
 */

import React from 'react';
import PropTypes from 'prop-types';
import {SliderBar, BULLET} from 'views/components/sliderBar/SliderBar.jsx';

if (DESKTOP) { // eslint-disable-line
  require('./_d.display-image-product.scss');
} else {
  require('./_m.display-image-product.scss');
}

class ImageCtas extends React.Component {
  static propTypes = {
    /** flags if the slider bar should be visible */
    isSliderBarVisible: PropTypes.bool.isRequired,
    /** number of images that may be navigated */
    imageCount: PropTypes.number,
    /** index of the currently visible image */
    currentImageIndex: PropTypes.number,
    /** function to call when the Next button is clicked */
    onNextClick: PropTypes.func.isRequired,
    /** function to call when the Previous button is clicked */
    onPreviousClick: PropTypes.func.isRequired
  }

  render () {
    let {isSliderBarVisible, imageCount, currentImageIndex, onNextClick,
      onPreviousClick} = this.props;

    return (
      <div className="product-images-ctas-container">
        {imageCount > 1 && <button aria-label="show previous image" className="button-prev" onClick={onPreviousClick}>Previous</button>}

        {imageCount > 1 && <button aria-label="show next image" className="button-next" onClick={onNextClick}>Next</button>}

        {/* TODO: didn't get into mobile yet */}
        {isSliderBarVisible && <SliderBar type={BULLET} qtyPages={imageCount} selectedItem={currentImageIndex} />}
      </div>
    );
  }
}

export {ImageCtas};
